import { REGIONS } from '../data/regions';
import type { CaseCategory, FeeMode, LitigationStage } from '../types';

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
  feeMode: FeeMode
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

    const min = Math.round(baseMin * stageMultiplier);
    const max = Math.round(baseMax * stageMultiplier);
    const median = Math.round((min + max) / 2);

    return {
      min,
      max,
      median,
      riskEst: 0,
      hourlyRange: region.hourlyRateRange,
      notes: '非财产争议案件，按件收费基准。',
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

  let min = Math.round(baseFee * 0.8 * stageMultiplier);
  let max = Math.round(baseFee * 1.25 * stageMultiplier);

  if (category === 'ip' || category === 'company') {
    min = Math.round(min * 1.2);
    max = Math.round(max * 1.3);
  } else if (category === 'labor') {
    min = Math.round(min * 0.85);
    max = Math.round(max * 0.9);
  }

  min = Math.max(Math.round(min / 100) * 100, region.minCaseFee);
  max = Math.max(Math.round(max / 100) * 100, min + 1000);
  const median = Math.round((min + max) / 200) * 100;

  const riskRate = Math.min(0.18, region.riskFeeCap);
  const riskEst = Math.round(amount * riskRate);

  let notes = `${region.shortName}地区律协参考标准计算`;
  if (feeMode === 'risk') {
    notes = '纯风险代理：前期通常收取极低材料费/0元，胜诉实际回款后按15%~25%提成。';
  } else if (feeMode === 'half_risk') {
    notes = '半风险代理：前期收取基础律师费（约标准价50%），结案回款按8%~15%提成。';
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
