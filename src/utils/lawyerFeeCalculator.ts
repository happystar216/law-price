import { REGIONS } from '../data/regions';
import type { CaseCategory, FeeMode, LawyerTier, LitigationStage } from '../types';

export interface LawyerFeeResult {
  min: number;
  max: number;
  median: number;
  riskEst: number;
  hourlyRange: [number, number];
  notes: string;
}

export function calculateLawyerFee(
  regionId: string,
  category: CaseCategory,
  amount: number,
  isProperty: boolean,
  stage: LitigationStage,
  feeMode: FeeMode,
  lawyerTier: LawyerTier = 'senior'
): LawyerFeeResult {
  const region = REGIONS.find((r) => r.id === regionId) || REGIONS[0];

  let stageMultiplier = 1.0;
  if (stage === 'second_instance') {
    stageMultiplier = 0.7;
  } else if (stage === 'execution') {
    stageMultiplier = 0.5;
  } else if (stage === 'preservation_only') {
    stageMultiplier = 0.3;
  }

  // 律师档次系数调节
  let tierMultiplier = 1.0;
  let tierMinFloor = region.minCaseFee;

  if (lawyerTier === 'economic') {
    tierMultiplier = 0.65;
    tierMinFloor = Math.round(region.minCaseFee * 0.6);
  } else if (lawyerTier === 'elite') {
    tierMultiplier = 2.4;
    tierMinFloor = 15000;
  }

  if (!isProperty || amount <= 0) {
    let baseMin = region.minCaseFee;
    let baseMax = region.minCaseFee * 2.5;

    if (category === 'marriage') {
      baseMin = Math.max(baseMin, 5000);
      baseMax = Math.max(baseMax, 15000);
    } else if (category === 'ip') {
      baseMin = Math.max(baseMin, 8000);
      baseMax = Math.max(baseMax, 25000);
    } else if (category === 'labor') {
      baseMin = Math.max(baseMin, 3000);
      baseMax = Math.max(baseMax, 8000);
    }

    let min = Math.round(baseMin * stageMultiplier * tierMultiplier);
    let max = Math.round(baseMax * stageMultiplier * tierMultiplier);

    min = Math.max(min, tierMinFloor);
    max = Math.max(max, min + 1000);
    const median = Math.round((min + max) / 2);

    let tierNote = '资深专案型（5~10年熟手）：市场主流公道价，办案稳健。';
    if (lawyerTier === 'economic') {
      tierNote = '经济实惠型（青年骨干）：主打高性价比，收费约为市场均价 60%~70%。';
    } else if (lawyerTier === 'elite') {
      tierNote = '红圈知名合伙人型：适合疑难大案与重大争端，名所专家团队代理。';
    }

    return {
      min,
      max,
      median,
      riskEst: 0,
      hourlyRange: region.hourlyRateRange,
      notes: tierNote,
    };
  }

  let baseFee = 0;
  for (const tier of region.tiers) {
    if (amount > tier.min) {
      const taxable = Math.min(amount, tier.max) - tier.min;
      baseFee += taxable * tier.rate;
    }
  }

  baseFee = Math.max(baseFee, region.minCaseFee);

  let min = Math.round(baseFee * 0.8 * stageMultiplier * tierMultiplier);
  let max = Math.round(baseFee * 1.25 * stageMultiplier * tierMultiplier);

  if (category === 'ip' || category === 'company') {
    min = Math.round(min * 1.2);
    max = Math.round(max * 1.3);
  } else if (category === 'labor') {
    min = Math.round(min * 0.85);
    max = Math.round(max * 0.9);
  }

  min = Math.max(Math.round(min / 100) * 100, tierMinFloor);
  max = Math.max(Math.round(max / 100) * 100, min + 1000);
  const median = Math.round((min + max) / 200) * 100;

  let riskRate = Math.min(0.18, region.riskFeeCap);
  if (lawyerTier === 'economic') riskRate = 0.12;
  if (lawyerTier === 'elite') riskRate = 0.25;

  const riskEst = Math.round(amount * riskRate);

  let notes = `${region.shortName}当地市场参考标准计算`;
  if (feeMode === 'risk') {
    notes = '纯风险代理：前期通常收取极低材料费/0元，胜诉实际回款后按提成比例结算。';
  } else if (feeMode === 'half_risk') {
    notes = '半风险代理：前期收取基础律师费（约标准价50%），结案回款后按低比例提成。';
  } else {
    if (lawyerTier === 'economic') {
      notes = '【经济实惠型 · 青年骨干】：性价比首选，约市场均价 60%~70%，适合事实确凿的普通纠纷。';
    } else if (lawyerTier === 'elite') {
      notes = '【红圈所合伙人 · 大案名状】：高规格配置，适合千万标的或复杂商事争端，专家团队主办。';
    } else {
      notes = '【资深专案型 · 5~10年熟手】：80%当事人首选，法庭经验丰富，证据质证与财产查控最稳健。';
    }
  }

  return {
    min,
    max,
    median,
    riskEst,
    hourlyRange: region.hourlyRateRange,
    notes,
  };
}
