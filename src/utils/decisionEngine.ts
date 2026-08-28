import { CASE_CATEGORIES } from '../data/caseTypes';
import { getLawyerWorkloadTemplate } from '../data/workloadTemplates';
import type {
  CaseInputState,
  FinancialBreakdown,
  FullCaseAnalysis,
  RoiAssessment,
  TimeAndEffortBreakdown,
  TimelineStage,
} from '../types';
import {
  calculateCivilCourtFee,
  calculateExecutionFee,
  calculatePreservationFee,
  getNonPropertyCourtFee,
} from './courtFeeCalculator';
import { calculateLawyerFee } from './lawyerFeeCalculator';

export function runFullCaseAnalysis(input: CaseInputState): FullCaseAnalysis {
  const categoryMeta = CASE_CATEGORIES.find((c) => c.id === input.category) || CASE_CATEGORIES[0];
  const claimAmount = input.isPropertyCase ? Math.max(input.claimAmount, 0) : 0;

  // ==========================================
  // 1. 法院诉讼费与保全费用精准计算 (Court Fees)
  // ==========================================
  let standardCourtFee = 0;
  if (input.isPropertyCase && claimAmount > 0) {
    if (input.stage === 'execution') {
      standardCourtFee = calculateExecutionFee(claimAmount);
    } else {
      standardCourtFee = calculateCivilCourtFee(claimAmount);
    }
  } else {
    standardCourtFee = getNonPropertyCourtFee(input.category);
  }

  const isSummaryDiscount = input.stage === 'first_instance_summary';
  let courtFeeDiscounted = standardCourtFee;
  if (input.stage === 'execution') {
    courtFeeDiscounted = 0; // 执行申请费由被执行人承担，立案时无需预交
  } else if (isSummaryDiscount) {
    courtFeeDiscounted = Math.round(standardCourtFee * 0.5);
  }

  const needPreservation = input.isPropertyCase && claimAmount > 10000 && input.stage !== 'execution';
  const preservationFee = needPreservation ? calculatePreservationFee(claimAmount) : 0;
  const preservationInsuranceFee =
    needPreservation && claimAmount > 30000 ? Math.max(300, Math.round(claimAmount * 0.0015)) : 0;
  const executionFee = input.isPropertyCase && claimAmount > 0 ? calculateExecutionFee(claimAmount) : 50;

  // ==========================================
  // 2. 律师费区间与收费模式计算 (Lawyer Fees)
  // ==========================================
  const lawyerFeeRes = calculateLawyerFee(
    input.regionId,
    input.category,
    claimAmount,
    input.isPropertyCase,
    input.stage,
    input.feeMode
  );

  let canTransferLawyerFee = false;
  let lawyerFeeTransferReason = '';

  if (input.hasContractFeeClause && ['debt', 'contract', 'real_estate', 'company', 'other'].includes(input.category)) {
    canTransferLawyerFee = true;
    lawyerFeeTransferReason = '合同明确约定“违约方承担守约方维权律师费”，依据《民法典》违约赔偿原则，法院支持率极高。';
  } else if (input.category === 'ip' || categoryMeta.statutoryFeeTransfer) {
    canTransferLawyerFee = true;
    lawyerFeeTransferReason = '依据《著作权法》《商标法》及最高法司法解释，知识产权侵权维权合理律师费与公证费依法由侵权人全额赔偿。';
  } else {
    canTransferLawyerFee = false;
    lawyerFeeTransferReason = '本案为普通民商事纠纷且未约定违约承担律师费，依法律师费通常由委托人自行承担。';
  }

  // ==========================================
  // 3. 异地差旅费精算（核心商业壁垒与省钱机会点）
  // ==========================================
  const isCrossRegion = Boolean(input.isOpponentCity);
  let traditionalTravelCostMin = 0;
  let traditionalTravelCostMax = 0;

  if (isCrossRegion) {
    // 若找本地律师去异地出庭办案：包含2~3次往返高铁/机票、酒店住宿及异地办案出差补贴
    if (input.stage === 'first_instance_normal') {
      traditionalTravelCostMin = 5000;
      traditionalTravelCostMax = 12000;
    } else if (input.stage === 'execution') {
      traditionalTravelCostMin = 3000;
      traditionalTravelCostMax = 6000;
    } else {
      traditionalTravelCostMin = 3500;
      traditionalTravelCostMax = 8000;
    }
  }

  // 平台直配起诉地同城律师，差旅费恒为 0 元！
  const platformTravelCost = 0;
  const travelCostSaved = isCrossRegion ? Math.round((traditionalTravelCostMin + traditionalTravelCostMax) / 2) : 0;

  // ==========================================
  // 4. 前期垫付与终局净成本精算
  // ==========================================
  let upfrontCostMin = courtFeeDiscounted + preservationFee + preservationInsuranceFee;
  let upfrontCostMax = upfrontCostMin;

  if (input.feeMode === 'risk') {
    upfrontCostMin += 1000;
    upfrontCostMax += 3000;
  } else if (input.feeMode === 'half_risk') {
    upfrontCostMin += Math.round(lawyerFeeRes.min * 0.5);
    upfrontCostMax += Math.round(lawyerFeeRes.max * 0.5);
  } else {
    upfrontCostMin += lawyerFeeRes.min;
    upfrontCostMax += lawyerFeeRes.max;
  }

  let finalNetCostMin = 0;
  let finalNetCostMax = 0;

  if (canTransferLawyerFee) {
    finalNetCostMin = preservationInsuranceFee;
    finalNetCostMax = preservationInsuranceFee + Math.round(lawyerFeeRes.min * 0.05);
  } else {
    if (input.feeMode === 'risk') {
      finalNetCostMin = lawyerFeeRes.riskEst + preservationInsuranceFee;
      finalNetCostMax = lawyerFeeRes.riskEst * 1.2 + preservationInsuranceFee;
    } else {
      finalNetCostMin = lawyerFeeRes.min + preservationInsuranceFee;
      finalNetCostMax = lawyerFeeRes.max + preservationInsuranceFee;
    }
  }

  const financial: FinancialBreakdown = {
    courtFee: standardCourtFee,
    courtFeeDiscounted,
    isSummaryDiscount,
    lawyerFeeMin: lawyerFeeRes.min,
    lawyerFeeMax: lawyerFeeRes.max,
    lawyerFeeMedian: lawyerFeeRes.median,
    riskFeeEst: lawyerFeeRes.riskEst,
    preservationFee,
    preservationInsuranceFee,
    executionFee,
    isCrossRegion,
    traditionalTravelCostMin,
    traditionalTravelCostMax,
    platformTravelCost,
    travelCostSaved,
    upfrontCostMin,
    upfrontCostMax,
    finalNetCostMin: Math.max(0, finalNetCostMin),
    finalNetCostMax: Math.max(0, finalNetCostMax),
    canTransferLawyerFee,
    lawyerFeeTransferReason,
  };

  // ==========================================
  // 5. 时间周期与当事人精力消耗精算
  // ==========================================
  let calendarMonthsMin = 3;
  let calendarMonthsMax = 6;

  const isBusyRegion = ['bj', 'sh', 'gd', 'zj', 'js'].includes(input.regionId);
  const regionMonthBuffer = isBusyRegion ? 0.5 : 0;
  const weakEvidenceBuffer = input.evidenceLevel === 'weak' ? 1.0 : 0;

  if (input.stage === 'first_instance_summary') {
    calendarMonthsMin = 1.5;
    calendarMonthsMax = Math.round((3 + regionMonthBuffer + weakEvidenceBuffer) * 10) / 10;
  } else if (input.stage === 'first_instance_normal') {
    calendarMonthsMin = 3;
    calendarMonthsMax = Math.round((6 + regionMonthBuffer + weakEvidenceBuffer) * 10) / 10;
  } else if (input.stage === 'second_instance') {
    calendarMonthsMin = 2;
    calendarMonthsMax = Math.round((3 + regionMonthBuffer) * 10) / 10;
  } else if (input.stage === 'execution') {
    calendarMonthsMin = 1;
    calendarMonthsMax = 6;
  }

  let clientHoursWithLawyer = 4;
  let clientHoursSelf = 65;

  if (input.stage === 'execution') {
    clientHoursWithLawyer = 2;
    clientHoursSelf = isCrossRegion ? 55 : 35; // 异地执行自己跑需大量跨省奔波
  } else if (input.stage === 'second_instance') {
    clientHoursWithLawyer = 3;
    clientHoursSelf = isCrossRegion ? 60 : 45;
  } else {
    if (input.evidenceLevel === 'weak') {
      clientHoursWithLawyer = 5.5;
      clientHoursSelf = isCrossRegion ? 105 : 85;
    } else if (input.evidenceLevel === 'medium') {
      clientHoursWithLawyer = 4;
      clientHoursSelf = isCrossRegion ? 85 : 65;
    } else {
      clientHoursWithLawyer = 3;
      clientHoursSelf = isCrossRegion ? 70 : 50;
    }
  }

  let courtAppearancesWithLawyer = 0;
  if (input.stage === 'execution') {
    courtAppearancesWithLawyer = 0;
  } else if (input.category === 'marriage') {
    courtAppearancesWithLawyer = 1;
  } else {
    courtAppearancesWithLawyer = 0;
  }

  let courtAppearancesSelf = 5;
  if (input.stage === 'execution') {
    courtAppearancesSelf = 3;
  } else if (input.stage === 'second_instance') {
    courtAppearancesSelf = 3;
  } else {
    courtAppearancesSelf = input.evidenceLevel === 'weak' ? 6 : input.evidenceLevel === 'medium' ? 5 : 4;
  }

  const lawFirmVisitsWithLawyer = 0;

  const hourlyWage = input.clientMonthlySalary > 0 ? input.clientMonthlySalary / 174 : 60;
  const clientLostWageSelf = Math.round(clientHoursSelf * hourlyWage);
  const clientLostWageWithLawyer = Math.round(clientHoursWithLawyer * hourlyWage);

  const timelineStages: TimelineStage[] = [
    {
      name: '诉前准备与立案审核',
      durationDays: input.stage === 'execution' ? 7 : 15,
      description:
        input.stage === 'execution'
          ? '整理生效裁判文书、核算加倍迟延履行利息、提交执行立案'
          : '收集整理材料、撰写起诉状、保全冻结、法院系统审核立案',
      courtAction: input.stage === 'execution' ? '审查执行依据，分配执行案号与执行法官' : '审查起诉材料，分配案号并下达受理通知书',
      clientAction: '委托律师一键代办，线上签署授权委托书（无需跑立案庭）',
    },
    {
      name: input.stage === 'execution' ? '总对总网络财产查控' : '送达排期与庭前答辩',
      durationDays: input.stage === 'execution' ? 20 : 35,
      description:
        input.stage === 'execution'
          ? '全国联网线上冻结被执行人银行卡、微信零钱、证券理财及房产'
          : '法院向被告送达传票、被告提出答辩或管辖异议、合议庭排期',
      courtAction: input.stage === 'execution' ? '下达协助冻结通知书，网络线上直连查控' : '电子送达/邮寄传票，组织证据交换与庭前调解',
      clientAction: '无需到庭，安心正常上班等待进展',
    },
    {
      name: input.stage === 'execution' ? '强制措施施压与执行和解' : '开庭审理与裁判下发',
      durationDays: input.stage === 'execution' ? 30 : 45,
      description:
        input.stage === 'execution'
          ? '下达限制高消费令、纳入失信名单、约谈被执行人促成还款'
          : '法庭调查、举证质证、法庭辩论、主审法官起草判决书',
      courtAction: input.stage === 'execution' ? '对拒不履行的被执行人依法采取限高及惩戒措施' : '开庭审理记录笔录，合议庭评议并撰写判决书',
      clientAction:
        input.stage === 'execution'
          ? '律师跟进执行法官，当事人无需露面'
          : courtAppearancesWithLawyer === 1
          ? '家事案件配合律师出庭 1 次'
          : '律师全权出庭应诉，当事人 0 次出庭',
    },
    {
      name: input.stage === 'execution' ? '执行款划扣发还与结案' : '判决生效与申请执行',
      durationDays: input.stage === 'execution' ? 15 : 60,
      description:
        input.stage === 'execution'
          ? '冻结款项划入法院执行专用账户，直接打入当事人银行卡'
          : '判决书上诉期届满生效，若对方未履行，启动强制执行查控',
      courtAction: input.stage === 'execution' ? '出具执行结案通知书，划扣执行款' : '执行网络查控系统总对总冻结银行卡、扣划财产、限高',
      clientAction: '律师跟进执行款到账，直接打款至当事人银行账户',
    },
  ];

  const timeAndEffort: TimeAndEffortBreakdown = {
    calendarMonthsMin,
    calendarMonthsMax,
    clientHoursWithLawyer,
    clientHoursSelf,
    lawFirmVisitsWithLawyer,
    courtAppearancesWithLawyer,
    courtAppearancesSelf,
    clientLostWageSelf,
    clientLostWageWithLawyer,
    timelineStages,
  };

  // ==========================================
  // 6. 律师具体工作量工时与交付项
  // ==========================================
  const workload = getLawyerWorkloadTemplate(claimAmount, input.category, input.stage, input.evidenceLevel);

  // ==========================================
  // 7. 胜诉率、回款率与净期望收益精算 (ROI)
  // ==========================================
  let winProbability = 0.85;

  if (input.stage === 'execution') {
    winProbability = 1.0;
  } else if (input.stage === 'second_instance') {
    if (input.evidenceLevel === 'strong') winProbability = 0.65;
    else if (input.evidenceLevel === 'medium') winProbability = 0.40;
    else winProbability = 0.20;
  } else {
    const categoryWinBase: Record<string, { strong: number; medium: number; weak: number }> = {
      debt: { strong: 0.95, medium: 0.75, weak: 0.45 },
      labor: { strong: 0.92, medium: 0.70, weak: 0.40 },
      contract: { strong: 0.90, medium: 0.65, weak: 0.38 },
      real_estate: { strong: 0.92, medium: 0.70, weak: 0.42 },
      tort: { strong: 0.94, medium: 0.68, weak: 0.42 },
      marriage: { strong: 0.88, medium: 0.65, weak: 0.40 },
      ip: { strong: 0.95, medium: 0.72, weak: 0.45 },
      company: { strong: 0.85, medium: 0.60, weak: 0.35 },
      other: { strong: 0.88, medium: 0.65, weak: 0.40 },
    };

    const rates = categoryWinBase[input.category] || categoryWinBase.debt;
    winProbability = rates[input.evidenceLevel] || 0.75;
  }

  let recoveryProbability = 0.80;
  if (input.solvencyLevel === 'high') {
    recoveryProbability = input.category === 'tort' || input.category === 'ip' ? 0.95 : 0.90;
  } else if (input.solvencyLevel === 'medium') {
    recoveryProbability = needPreservation ? 0.65 : 0.55;
  } else {
    recoveryProbability = 0.20;
  }

  const expectedGrossRecovery = Math.round(claimAmount * winProbability * recoveryProbability);
  const avgFinalCost = (financial.finalNetCostMin + financial.finalNetCostMax) / 2;
  const expectedNetReturnMin = Math.round(claimAmount * winProbability * recoveryProbability - financial.finalNetCostMax);
  const expectedNetReturnMax = Math.round(claimAmount * winProbability * recoveryProbability - financial.finalNetCostMin);

  let roiScore = 50;
  if (input.isPropertyCase && claimAmount > 0) {
    const costRatio = avgFinalCost / claimAmount;
    if (costRatio < 0.12 && winProbability >= 0.75 && recoveryProbability >= 0.6) {
      roiScore = 95;
    } else if (costRatio < 0.20 && winProbability >= 0.65 && recoveryProbability >= 0.5) {
      roiScore = 80;
    } else if (recoveryProbability <= 0.25 || winProbability <= 0.35) {
      roiScore = 30;
    } else {
      roiScore = 65;
    }
  } else {
    roiScore = input.evidenceLevel === 'strong' ? 88 : input.evidenceLevel === 'medium' ? 68 : 45;
  }

  let recommendation: 'strongly_recommended' | 'recommended' | 'mediation_preferred' | 'cautious' = 'recommended';
  let recommendationTitle = '建议积极启动诉讼与财产保全';
  const recommendationDetails: string[] = [];

  if (input.stage === 'execution') {
    recommendation = 'strongly_recommended';
    recommendationTitle = '建议立即申请法院网络总对总查控冻结';
    recommendationDetails.push('您已有生效胜诉依据，胜诉权属已完全确定（胜诉率100%）。');
    recommendationDetails.push('执行时效为生效后2年内，建议第一时间立案并敦促执行法官冻结对方微信与银行账户，防止资产转移。');
  } else if (roiScore >= 80) {
    recommendation = 'strongly_recommended';
    recommendationTitle = '强烈推荐启动诉讼，维权性价比极高';
    recommendationDetails.push('本案证据链较为完整，法律事实清晰，胜诉确定性高。');
    recommendationDetails.push('对方具有可供执行的有效财产，建议在立案同时**立即申请诉讼财产保全**，锁定对方银行账户或房产。');
    if (canTransferLawyerFee) {
      recommendationDetails.push('律师费可依法请求对方全额报销，极大降低了实际维权自担成本。');
    }
  } else if (roiScore >= 60) {
    recommendation = 'recommended';
    recommendationTitle = '建议诉讼维权，建议重点补强关键证据';
    recommendationDetails.push('综合投入产出比良好，但需注意在起诉前针对存疑证据做补充固化（如补充对账单或录音取证）。');
    recommendationDetails.push('建议密切关注对方经营动态，防范被执行人恶意转移隐匿财产。');
  } else if (input.solvencyLevel === 'low' || recoveryProbability <= 0.25) {
    recommendation = 'cautious';
    recommendationTitle = '警惕“执行不能”风险，建议控制前期垫资';
    recommendationDetails.push('【高危风险提示】对方可能缺乏实际偿还能力或下落不明，存在“打赢官司拿不到现金”的执行风险。');
    recommendationDetails.push('建议优先采用【纯风险代理】模式，或先行发送正式律师函施压，暂缓大额诉讼垫资。');
  } else {
    recommendation = 'mediation_preferred';
    recommendationTitle = '建议优先通过诉前调解或律师函协商';
    recommendationDetails.push('诉讼成本相对标的额占比较高，或现有证据直接证明力存在欠缺。');
    recommendationDetails.push('优先申请法院诉前调解或聘请律师发函施压，可享受诉讼费减免且周期更短。');
  }

  const roi: RoiAssessment = {
    winProbability,
    winProbabilityLevel: winProbability >= 0.8 ? 'high' : winProbability >= 0.6 ? 'medium' : 'low',
    recoveryProbability,
    recoveryProbabilityLevel: recoveryProbability >= 0.8 ? 'high' : recoveryProbability >= 0.5 ? 'medium' : 'low',
    expectedGrossRecovery,
    expectedNetReturnMin,
    expectedNetReturnMax,
    roiScore,
    recommendation,
    recommendationTitle,
    recommendationDetails,
  };

  return {
    input,
    financial,
    timeAndEffort,
    workload,
    roi,
    generatedAt: new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}
