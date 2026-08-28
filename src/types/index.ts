export type CaseCategory =
  | 'contract'      // 买卖/合同纠纷
  | 'debt'          // 民间借贷/借款
  | 'labor'         // 劳动人事争议
  | 'marriage'      // 婚姻家事与继承
  | 'ip'            // 知识产权侵权
  | 'tort'          // 侵权纠纷/交通事故
  | 'real_estate'   // 房屋买卖与租赁
  | 'company'       // 公司股权/商事纠纷
  | 'other';        // 其他民商事

export type LitigationStage =
  | 'first_instance_normal'   // 一审（普通程序，审限6个月）
  | 'first_instance_summary'  // 一审（简易程序，审限3个月）
  | 'second_instance'         // 二审上诉程序（审限3个月）
  | 'execution'               // 申请强制执行程序
  | 'preservation_only';      // 仅诉前财产保全

export type FeeMode =
  | 'standard'  // 普通阶梯代理（前期固定/区间）
  | 'risk'      // 纯风险代理 / 胜诉提成
  | 'half_risk' // 半风险代理（基础费+低比例提成）
  | 'hourly';   // 计时收费

export type EvidenceLevel =
  | 'strong'   // 证据确凿充分
  | 'medium'   // 核心证据具备，但需补充质证
  | 'weak';    // 缺少直接书证

export type SolvencyLevel =
  | 'high'     // 有明确房产车辆/正常发薪营业
  | 'medium'   // 正常生活工作，需法院查控
  | 'low';     // 失联跑路/欠款过多

export type VenueRoute = 'client_residence' | 'client_domicile' | 'opponent_residence' | 'opponent_domicile' | 'incident_place';

export interface CaseInputState {
  category: CaseCategory;
  isPropertyCase: boolean;       // 是否涉及财产标的
  claimAmount: number;           // 争议标的金额（元）
  
  // 双方 4 大地点事实（我方常住、我方户籍、对方常住、对方户籍）
  clientResidenceRegionId: string; // 我方常住地（如北京）
  clientDomicileRegionId: string;  // 我方户籍地（如河北）
  clientDomicileSameAsResidence?: boolean;
  
  opponentResidenceRegionId: string; // 对方常住/工作/经营地（如广东）
  opponentDomicileRegionId: string;  // 对方户籍老家/注册地（如四川）
  opponentDomicileSameAsResidence?: boolean;
  
  incidentRegionId?: string;       // 房产地/事故地/工作地省市ID
  
  chosenVenueKey: string;          // 当前选中的管辖法院Key
  regionId: string;                // 实际起诉地省市ID（用于费率核算）
  isOpponentCity: boolean;         // 是否在异地起诉
  
  // 兼容旧字段
  clientRegionId?: string;
  opponentRegionId?: string;
  chosenRoute?: string;
  
  stage: LitigationStage;          // 诉讼程序阶段
  feeMode: FeeMode;                // 偏好计费方式
  evidenceLevel: EvidenceLevel;    // 证据完备度
  solvencyLevel: SolvencyLevel;    // 对方偿债能力与财产线索
  hasContractFeeClause: boolean;   // 合同是否明确约定败诉方承担律师费
  clientMonthlySalary: number;     // 当事人月薪（元，用于机会成本折算）
  customHourlyRate?: number;       // 律师自定义时薪
}

export interface FeeTier {
  min: number;
  max: number;
  rate: number; // 比例，如 0.05
}

export interface RegionConfig {
  id: string;
  name: string;
  shortName: string;
  minCaseFee: number;            // 基础件最低起步价
  tiers: FeeTier[];              // 阶梯费率表
  hourlyRateRange: [number, number]; // 计时收费参考区间（元/小时）
  riskFeeCap: number;            // 风险代理最高上限
  description?: string;
}

export interface FinancialBreakdown {
  courtFee: number;              // 法院受理费（标准）
  courtFeeDiscounted: number;    // 实际应交诉讼费（若简易程序则减半）
  isSummaryDiscount: boolean;    // 是否享受简易程序减半
  
  lawyerFeeMin: number;          // 律师费参考区间下限
  lawyerFeeMax: number;          // 律师费参考区间上限
  lawyerFeeMedian: number;       // 律师费市场中位数
  
  riskFeeEst: number;            // 若风险代理预计提成
  
  preservationFee: number;       // 财产保全费（最高5000元）
  preservationInsuranceFee: number; // 保全责任险费（约0.15%）
  
  executionFee: number;          // 申请执行费（从执行回款中扣除）
  
  // 异地差旅费对比（核心商业机会点）
  isCrossRegion: boolean;        // 是否属于异地/对方城市诉讼
  traditionalTravelCostMin: number; // 传统请本地律师出差的额外差旅费（高铁飞机酒店补贴）
  traditionalTravelCostMax: number;
  platformTravelCost: number;    // 平台直连当地律师的差旅费（恒为0元）
  travelCostSaved: number;       // 平台匹配立省差旅费
  
  upfrontCostMin: number;        // 前期需垫付总资金下限
  upfrontCostMax: number;        // 前期需垫付总资金上限
  
  finalNetCostMin: number;       // 胜诉后当事人最终实际承担成本下限
  finalNetCostMax: number;       // 胜诉后当事人最终实际承担成本上限
  
  canTransferLawyerFee: boolean; // 律师费是否可由对方承担
  lawyerFeeTransferReason: string; // 律师费转嫁支持的法律依据或条款说明
}

export interface TimelineStage {
  name: string;
  durationDays: number;
  description: string;
  courtAction: string;
  clientAction: string;
}

export interface TimeAndEffortBreakdown {
  calendarMonthsMin: number;     // 法定/平均审限下限（月）
  calendarMonthsMax: number;     // 法定/平均审限上限（月）
  
  clientHoursWithLawyer: number; // 委托律师后当事人需投入工时（小时）
  clientHoursSelf: number;       // 自己打官司预计耗费工时（小时）
  
  lawFirmVisitsWithLawyer: number;   // 委托律师后需去律所次数（0~1次）
  courtAppearancesWithLawyer: number; // 委托律师后需亲自出庭次数（通常0次，家事1次）
  courtAppearancesSelf: number;       // 自己打官司需跑法院次数（通常4~6次）
  
  clientLostWageSelf: number;    // 自己打官司折算误工机会成本（元）
  clientLostWageWithLawyer: number; // 委托律师后误工成本（元）
  
  timelineStages: TimelineStage[];
}

export interface WorkloadItem {
  id: string;
  title: string;
  hours: number;
  description: string;
  stageName: string;
}

export interface WorkloadStage {
  stageId: string;
  stageTitle: string;
  stageHours: number;
  items: WorkloadItem[];
}

export interface LawyerWorkloadBreakdown {
  totalHours: number;
  stages: WorkloadStage[];
}

export interface RoiAssessment {
  winProbability: number;         // 法律胜诉概率 (0 ~ 1)
  winProbabilityLevel: 'high' | 'medium' | 'low';
  
  recoveryProbability: number;    // 实际执行到位率 (0 ~ 1)
  recoveryProbabilityLevel: 'high' | 'medium' | 'low';
  
  expectedGrossRecovery: number;  // 预期毛回款 (标的额 * 胜诉率 * 执行率)
  expectedNetReturnMin: number;   // 预期净收益下限
  expectedNetReturnMax: number;   // 预期净收益上限
  
  roiScore: number;               // 综合维权健康分 (0 ~ 100)
  recommendation: 'strongly_recommended' | 'recommended' | 'mediation_preferred' | 'cautious';
  recommendationTitle: string;
  recommendationDetails: string[];
}

export interface FullCaseAnalysis {
  input: CaseInputState;
  financial: FinancialBreakdown;
  timeAndEffort: TimeAndEffortBreakdown;
  workload: LawyerWorkloadBreakdown;
  roi: RoiAssessment;
  generatedAt: string;
}
