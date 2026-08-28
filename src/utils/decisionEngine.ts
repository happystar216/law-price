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

  // 1. Calculate Court Fees
  let standardCourtFee = 0;
  if (input.isPropertyCase && claimAmount > 0) {
    standardCourtFee = calculateCivilCourtFee(claimAmount);
  } else {
    standardCourtFee = getNonPropertyCourtFee(input.category);
  }

  const isSummaryDiscount = input.stage === 'first_instance_summary';
  const courtFeeDiscounted = isSummaryDiscount ? Math.round(standardCourtFee * 0.5) : standardCourtFee;

  const preservationFee = input.isPropertyCase && claimAmount > 10000 ? calculatePreservationFee(claimAmount) : 0;
  const preservationInsuranceFee =
    input.isPropertyCase && claimAmount > 30000 ? Math.max(300, Math.round(claimAmount * 0.0015)) : 0;
  const executionFee = input.isPropertyCase && claimAmount > 0 ? calculateExecutionFee(claimAmount) : 50;

  // 2. Calculate Lawyer Fees
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

  if (input.hasContractFeeClause) {
    canTransferLawyerFee = true;
    lawyerFeeTransferReason = '合同明确约定“违约方承担守约方维权律师费”，依据《民法典》违约赔偿原则，法院支持率极高。';
  } else if (categoryMeta.statutoryFeeTransfer) {
    canTransferLawyerFee = true;
    lawyerFeeTransferReason = categoryMeta.statutoryTransferReason || '法律法规或司法解释支持该案由下合理律师费由败诉/侵权方承担。';
  } else {
    canTransferLawyerFee = false;
    lawyerFeeTransferReason = '本案为普通民商事纠纷且未约定违约承担律师费，依法律师费通常由委托人自行承担。';
  }

  // 3. Upfront and Ending Financial Summary
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
    finalNetCostMax = preservationInsuranceFee + Math.round(lawyerFeeRes.min * 0.1);
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
    upfrontCostMin,
    upfrontCostMax,
    finalNetCostMin: Math.max(0, finalNetCostMin),
    finalNetCostMax: Math.max(0, finalNetCostMax),
    canTransferLawyerFee,
    lawyerFeeTransferReason,
  };

  // 4. Time & Effort Analysis
  let calendarMonthsMin = 3;
  let calendarMonthsMax = 6;

  if (input.stage === 'first_instance_summary') {
    calendarMonthsMin = 1.5;
    calendarMonthsMax = 3;
  } else if (input.stage === 'second_instance') {
    calendarMonthsMin = 2;
    calendarMonthsMax = 3;
  } else if (input.stage === 'execution') {
    calendarMonthsMin = 3;
    calendarMonthsMax = 6;
  }

  const timelineStages: TimelineStage[] = [
    {
      name: '诉前准备与立案审核',
      durationDays: 15,
      description: '收集整理材料、撰写起诉状、保全冻结、法院系统审核立案',
      courtAction: '审查起诉材料，分配案号并下达受理通知书',
      clientAction: input.feeMode ? '委托律师一键代办，线上签署授权委托书' : '需自行学习格式要求，多次跑立案庭补正',
    },
    {
      name: '送达排期与庭前答辩',
      durationDays: 35,
      description: '法院向被告送达传票、被告提出答辩或管辖异议、合议庭排期',
      courtAction: '电子送达/邮寄传票，组织证据交换与庭前调解',
      clientAction: '无需到庭，安心正常上班等待开庭传票',
    },
    {
      name: '开庭审理与裁判下发',
      durationDays: 45,
      description: '法庭调查、举证质证、法庭辩论、主审法官起草判决书',
      courtAction: '开庭审理记录笔录，合议庭评议并撰写判决书',
      clientAction: '出庭参加诉讼（委托律师可由律师全权代为发言）',
    },
    {
      name: '判决生效与申请执行',
      durationDays: 60,
      description: '判决书上诉期届满生效，若对方未履行，启动强制执行查控',
      courtAction: '执行网络查控系统总对总冻结银行卡、扣划财产、限高',
      clientAction: '提供被执行人隐藏财产线索，跟进执行法官回款到账',
    },
  ];

  const clientHoursWithLawyer = 4;
  const clientHoursSelf = 65;

  const hourlyWage = input.clientMonthlySalary > 0 ? input.clientMonthlySalary / 174 : 60;
  const clientLostWageSelf = Math.round(clientHoursSelf * hourlyWage);
  const clientLostWageWithLawyer = Math.round(clientHoursWithLawyer * hourlyWage);

  const timeAndEffort: TimeAndEffortBreakdown = {
    calendarMonthsMin,
    calendarMonthsMax,
    clientHoursWithLawyer,
    clientHoursSelf,
    clientLostWageSelf,
    clientLostWageWithLawyer,
    timelineStages,
  };

  const workload = getLawyerWorkloadTemplate(claimAmount);

  // 5. Win Probability & ROI
  let winProbability = 0.85;
  if (input.evidenceLevel === 'strong') winProbability = 0.90;
  else if (input.evidenceLevel === 'medium') winProbability = 0.65;
  else if (input.evidenceLevel === 'weak') winProbability = 0.40;

  let recoveryProbability = 0.80;
  if (input.solvencyLevel === 'high') recoveryProbability = 0.90;
  else if (input.solvencyLevel === 'medium') recoveryProbability = 0.60;
  else if (input.solvencyLevel === 'low') recoveryProbability = 0.20;

  const expectedGrossRecovery = Math.round(claimAmount * winProbability * recoveryProbability);
  const avgFinalCost = (financial.finalNetCostMin + financial.finalNetCostMax) / 2;
  const expectedNetReturnMin = Math.round(claimAmount * winProbability * recoveryProbability - financial.finalNetCostMax);
  const expectedNetReturnMax = Math.round(claimAmount * winProbability * recoveryProbability - financial.finalNetCostMin);

  let roiScore = 50;
  if (input.isPropertyCase && claimAmount > 0) {
    const costRatio = avgFinalCost / claimAmount;
    if (costRatio < 0.15 && winProbability >= 0.7 && recoveryProbability >= 0.6) {
      roiScore = 90;
    } else if (costRatio < 0.25 && winProbability >= 0.6 && recoveryProbability >= 0.5) {
      roiScore = 75;
    } else if (recoveryProbability <= 0.3 || winProbability <= 0.45) {
      roiScore = 35;
    } else {
      roiScore = 60;
    }
  } else {
    roiScore = input.evidenceLevel === 'strong' ? 85 : input.evidenceLevel === 'medium' ? 65 : 45;
  }

  let recommendation: 'strongly_recommended' | 'recommended' | 'mediation_preferred' | 'cautious' = 'recommended';
  let recommendationTitle = '建议积极启动诉讼与财产保全';
  const recommendationDetails: string[] = [];

  if (roiScore >= 80) {
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
  } else if (input.solvencyLevel === 'low' || recoveryProbability <= 0.3) {
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
