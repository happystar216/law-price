import React from 'react';
import type {
  CaseCategory,
  CaseInputState,
  LitigationStage,
  SolvencyLevel,
} from '../types';
import { REGIONS } from '../data/regions';
import { Check } from 'lucide-react';

interface UserFriendlyConfiguratorProps {
  input: CaseInputState;
  onChange: (updates: Partial<CaseInputState>) => void;
}

// 100% 用户视角的通俗生活纠纷场景
const USER_FRIENDLY_SCENARIOS: {
  id: CaseCategory;
  title: string;
  desc: string;
  emoji: string;
}[] = [
  {
    id: 'debt',
    title: '朋友/熟人借钱不还',
    desc: '有借条、欠条或转账记录逾期不还',
    emoji: '💸',
  },
  {
    id: 'labor',
    title: '公司拖欠工资 / 乱开除',
    desc: '被违法辞退要赔偿金、未签合同、拖欠加班费',
    emoji: '💼',
  },
  {
    id: 'contract',
    title: '买卖/生意合作违约',
    desc: '对方不给货款、供货质量出问题、违约赔偿',
    emoji: '🤝',
  },
  {
    id: 'real_estate',
    title: '房东不退押金 / 租房纠纷',
    desc: '退租押金被扣、二手房买卖违约、房屋质量',
    emoji: '🏠',
  },
  {
    id: 'tort',
    title: '被撞伤 / 意外受伤索赔',
    desc: '交通事故赔偿、人身意外伤害医药费与误工费',
    emoji: '🩹',
  },
  {
    id: 'marriage',
    title: '离婚要分财产 / 遗产继承',
    desc: '夫妻共同房产存款分割、争夺抚养权、老人遗产',
    emoji: '💍',
  },
  {
    id: 'ip',
    title: '作品/商标被抄袭盗用',
    desc: '图片字体被侵权、软件源码被盗、商标被抢注',
    emoji: '🎨',
  },
  {
    id: 'other',
    title: '其他民事金钱纠纷',
    desc: '一般财产纠纷、服务合同争议、权益受损',
    emoji: '⚖️',
  },
];

// 根据不同纠纷类型，定制专属的金额问法、说明与常用金额快捷标签
interface ClaimConfig {
  title: string;
  subtitle: string;
  unit: string;
  hasNonPropertyOption?: boolean;
  nonPropertyLabel?: string;
  propertyLabel?: string;
  quickAmounts: { label: string; val: number }[];
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
}

const CLAIM_CONFIG_MAP: Record<CaseCategory, ClaimConfig> = {
  debt: {
    title: '对方一共欠你多少借款没还？',
    subtitle: '包含借款本金、利息与逾期违约利息',
    unit: '元',
    quickAmounts: [
      { label: '2万以内', val: 20000 },
      { label: '5万', val: 50000 },
      { label: '10万', val: 100000 },
      { label: '30万', val: 300000 },
      { label: '50万', val: 500000 },
      { label: '100万', val: 1000000 },
      { label: '300万', val: 3000000 },
      { label: '500万+', val: 5000000 },
    ],
    sliderMin: 5000,
    sliderMax: 5000000,
    sliderStep: 5000,
  },
  labor: {
    title: '主张公司赔偿 / 补发多少钱？',
    subtitle: '包含拖欠工资、未签合同双倍工资、违法辞退赔偿金(2N/N+1)、未休年假及加班费',
    unit: '元',
    quickAmounts: [
      { label: '1万', val: 10000 },
      { label: '3万', val: 30000 },
      { label: '5万', val: 50000 },
      { label: '8万', val: 80000 },
      { label: '12万', val: 120000 },
      { label: '20万', val: 20000 },
      { label: '35万', val: 350000 },
      { label: '50万+', val: 500000 },
    ],
    sliderMin: 2000,
    sliderMax: 1000000,
    sliderStep: 2000,
  },
  contract: {
    title: '对方拖欠的货款 / 违约损失金额是多少？',
    subtitle: '包含未付货款、工程款、定金、违约金及直接经济损失',
    unit: '元',
    quickAmounts: [
      { label: '5万', val: 50000 },
      { label: '10万', val: 100000 },
      { label: '30万', val: 300000 },
      { label: '50万', val: 500000 },
      { label: '100万', val: 1000000 },
      { label: '200万', val: 2000000 },
      { label: '500万', val: 5000000 },
      { label: '1000万+', val: 10000000 },
    ],
    sliderMin: 10000,
    sliderMax: 10000000,
    sliderStep: 10000,
  },
  real_estate: {
    title: '涉及的押金 / 房屋纠纷金额是多少？',
    subtitle: '包含被扣租房押金、中介费、二手房买卖违约定金或房屋维修损失',
    unit: '元',
    quickAmounts: [
      { label: '3000元', val: 3000 },
      { label: '5000元', val: 5000 },
      { label: '1万', val: 10000 },
      { label: '2万', val: 20000 },
      { label: '5万', val: 50000 },
      { label: '10万', val: 100000 },
      { label: '30万', val: 300000 },
      { label: '100万+', val: 1000000 },
    ],
    sliderMin: 1000,
    sliderMax: 3000000,
    sliderStep: 1000,
  },
  tort: {
    title: '你要求赔偿的人身损害 / 车祸赔偿总额？',
    subtitle: '包含医疗费、后续治疗费、误工费、护理费、伤残赔偿金及车辆维修损失',
    unit: '元',
    quickAmounts: [
      { label: '2万', val: 20000 },
      { label: '5万', val: 50000 },
      { label: '10万', val: 100000 },
      { label: '20万', val: 200000 },
      { label: '35万', val: 350000 },
      { label: '50万', val: 500000 },
      { label: '80万', val: 800000 },
      { label: '150万+', val: 1500000 },
    ],
    sliderMin: 5000,
    sliderMax: 3000000,
    sliderStep: 5000,
  },
  marriage: {
    title: '夫妻共同财产 / 争议遗产的总估值大约是多少？',
    subtitle: '包含共同房产当前市价、车辆、存款、股票理财或老人遗产总额（法院按争议标的计算诉讼费）',
    unit: '元',
    hasNonPropertyOption: true,
    propertyLabel: '涉及房产/存款等财产分割',
    nonPropertyLabel: '纯离婚/只争抚养权，不分财产',
    quickAmounts: [
      { label: '30万', val: 300000 },
      { label: '80万', val: 800000 },
      { label: '150万', val: 1500000 },
      { label: '300万', val: 3000000 },
      { label: '500万', val: 5000000 },
      { label: '800万', val: 8000000 },
      { label: '1500万', val: 15000000 },
      { label: '3000万+', val: 30000000 },
    ],
    sliderMin: 50000,
    sliderMax: 30000000,
    sliderStep: 50000,
  },
  ip: {
    title: '你主张的侵权赔偿 / 经济损失金额是多少？',
    subtitle: '包含侵权获利、维权合理开支（公证费律师费）或法定索赔金额',
    unit: '元',
    quickAmounts: [
      { label: '3万', val: 30000 },
      { label: '5万', val: 50000 },
      { label: '10万', val: 100000 },
      { label: '20万', val: 200000 },
      { label: '50万', val: 500000 },
      { label: '100万', val: 1000000 },
      { label: '200万', val: 2000000 },
      { label: '500万+', val: 5000000 },
    ],
    sliderMin: 5000,
    sliderMax: 5000000,
    sliderStep: 5000,
  },
  company: {
    title: '涉及的股权价值 / 商事争议金额？',
    subtitle: '包含股权出资额、分红款、公司清算资产或合同损失',
    unit: '元',
    quickAmounts: [
      { label: '10万', val: 100000 },
      { label: '30万', val: 300000 },
      { label: '50万', val: 500000 },
      { label: '100万', val: 1000000 },
      { label: '300万', val: 3000000 },
      { label: '500万', val: 5000000 },
      { label: '1000万', val: 10000000 },
      { label: '3000万+', val: 30000000 },
    ],
    sliderMin: 20000,
    sliderMax: 20000000,
    sliderStep: 20000,
  },
  other: {
    title: '本次纠纷涉及的总金额 / 索赔数额是多少？',
    subtitle: '包含主张支付的款项、赔偿金及违约金',
    unit: '元',
    quickAmounts: [
      { label: '2万', val: 20000 },
      { label: '5万', val: 50000 },
      { label: '10万', val: 100000 },
      { label: '30万', val: 300000 },
      { label: '50万', val: 500000 },
      { label: '100万', val: 1000000 },
      { label: '300万', val: 3000000 },
      { label: '500万+', val: 5000000 },
    ],
    sliderMin: 5000,
    sliderMax: 5000000,
    sliderStep: 5000,
  },
};

// 根据不同纠纷类型，动态匹配针对性的证据材料选项
const EVIDENCE_MAP: Record<
  CaseCategory,
  {
    strong: { title: string; desc: string };
    medium: { title: string; desc: string };
    weak: { title: string; desc: string };
  }
> = {
  debt: {
    strong: {
      title: '借条原件 + 银行/微信转账流水',
      desc: '白纸黑字写明借款金额与归还时间，转账流水清晰',
    },
    medium: {
      title: '仅有微信转账或聊天催款记录',
      desc: '没打正规纸质借条，但微信聊天里对方承认借款事实',
    },
    weak: {
      title: '现金借出 / 仅有口头承诺',
      desc: '没有书面借条，转账记录也不全，需要律师调取证据',
    },
  },
  labor: {
    strong: {
      title: '劳动合同 + 考勤记录 + 工资流水 + 辞退通知',
      desc: '用工关系与欠薪/违法辞退证据链完整，仲裁支持率极高',
    },
    medium: {
      title: '有工牌/微信工作群/转账，无正式合同',
      desc: '未签订正规劳动合同，但能证明实际工作事实与工资发放',
    },
    weak: {
      title: '现金发薪 / 缺少上下班打卡凭证',
      desc: '缺少直接证明用工关系的材料，需律师申请调取社保记录',
    },
  },
  contract: {
    strong: {
      title: '买卖合同 + 送货签收单 + 双方对账单',
      desc: '合同双方盖章签字，货物签收与欠款金额双方均已确认',
    },
    medium: {
      title: '微信沟通订货 + 银行转账凭证',
      desc: '未签订正规盖章合同，但在微信上有明确订单与付款记录',
    },
    weak: {
      title: '口头约定 / 送货金额双方有争议',
      desc: '缺少收货人签字确认的签收单，货款数额存在分歧',
    },
  },
  real_estate: {
    strong: {
      title: '租房合同 + 押金收据 + 房屋交接视频',
      desc: '租期到期、押金金额明确，房屋完好交付证据充足',
    },
    medium: {
      title: '有微信转账押金记录 + 催退聊天记录',
      desc: '合同丢失或未盖章，但转账记录与催要押金记录明确',
    },
    weak: {
      title: '口头租房 / 房屋损坏责任有争议',
      desc: '无书面合同，退房时未留下房屋现状验收与交接凭证',
    },
  },
  tort: {
    strong: {
      title: '事故责任认定书 + 医药费发票 + 伤残鉴定',
      desc: '交警或警方责任认定明确，医疗费与误工费票据齐全',
    },
    medium: {
      title: '有事故认定书 + 部分医药费单据',
      desc: '责任清楚，但尚未做伤残等级鉴定或缺少部分误工证明',
    },
    weak: {
      title: '事故责任划分有争议 / 缺少诊断票据',
      desc: '责任归属不清或私下协商未果，缺少正规伤情诊断证明',
    },
  },
  marriage: {
    strong: {
      title: '房产证/行驶证 + 银行存款流水 + 协议/遗嘱',
      desc: '共同财产或遗产产权清晰明确，证据链完整无争议',
    },
    medium: {
      title: '知晓财产线索，但流水在对方掌控中',
      desc: '知晓对方开户行或房产，需律师协助申请法院调查令调取',
    },
    weak: {
      title: '对方隐匿转移财产 / 财产线索不明',
      desc: '对方名下资产隐蔽，需律师介入进行深度财产线索排查',
    },
  },
  ip: {
    strong: {
      title: '作品登记/商标证书 + 时间戳可信公证书',
      desc: '原创权属证明清晰，侵权网页/产品已被公证固定证据',
    },
    medium: {
      title: '有设计底稿与最早发布记录，尚未公证',
      desc: '能证明原创在先，但侵权网页尚未公证，容易被对方删除',
    },
    weak: {
      title: '权属证明不完善 / 侵权证据不充分',
      desc: '原创时间节点证据不足，需律师补充指导取证以防灭失',
    },
  },
  company: {
    strong: {
      title: '公司章程 + 股东出资凭证 + 股东会决议',
      desc: '股权结构清晰，出资与分红证据确凿',
    },
    medium: {
      title: '有合伙协议与转账流水，未办理工商变更',
      desc: '存在实际出资事实，但工商登记与实际持股不一致',
    },
    weak: {
      title: '口头入股协议 / 财务账目混乱',
      desc: '缺少正式股东协议，需律师申请查账审计',
    },
  },
  other: {
    strong: {
      title: '书面协议原件 + 完整付款与履约凭证',
      desc: '法律事实清楚，付款及违约证据链完整',
    },
    medium: {
      title: '微信聊天记录 + 部分银行转账凭证',
      desc: '有基础往来记录，但缺乏正规书面合同',
    },
    weak: {
      title: '主要靠口头沟通，缺乏直接书面凭证',
      desc: '需通过电话录音、发律师函等方式补充固定案件事实',
    },
  },
};

export const UserFriendlyConfigurator: React.FC<UserFriendlyConfiguratorProps> = ({
  input,
  onChange,
}) => {
  const currentClaimConfig = CLAIM_CONFIG_MAP[input.category] || CLAIM_CONFIG_MAP.debt;
  const currentEvidenceOptions = EVIDENCE_MAP[input.category] || EVIDENCE_MAP.debt;
  const currentCategory = USER_FRIENDLY_SCENARIOS.find((s) => s.id === input.category) || USER_FRIENDLY_SCENARIOS[0];

  return (
    <div className="space-y-4">
      {/* 问题 1：你遇到了什么事？ */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              你遇到了什么纠纷？
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">点击选择最贴近的场景</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {USER_FRIENDLY_SCENARIOS.map((sc) => {
            const isSelected = input.category === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  const newCategory = sc.id;
                  const newConfig = CLAIM_CONFIG_MAP[newCategory];
                  // If category changed, adjust default claim amount if previous was out of range
                  const defaultAmount = newConfig.quickAmounts[2]?.val || 100000;
                  onChange({
                    category: newCategory,
                    claimAmount: input.isPropertyCase ? defaultAmount : 0,
                  });
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex items-start space-x-3 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 text-blue-950 font-semibold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">{sc.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-bold truncate pr-5">{sc.title}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{sc.desc}</div>
                </div>
                {isSelected && (
                  <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 问题 2：对应纠纷的定制金额问法 */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {currentClaimConfig.title}
              </h3>
              <p className="text-[11px] text-slate-500">{currentClaimConfig.subtitle}</p>
            </div>
          </div>

          {/* 针对离婚/家事等支持纯非财产诉求的切换 */}
          {currentClaimConfig.hasNonPropertyOption && (
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => onChange({ isPropertyCase: true, claimAmount: 1500000 })}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  input.isPropertyCase
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {currentClaimConfig.propertyLabel || '分财产'}
              </button>
              <button
                type="button"
                onClick={() => onChange({ isPropertyCase: false, claimAmount: 0 })}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  !input.isPropertyCase
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {currentClaimConfig.nonPropertyLabel || '不分财产'}
              </button>
            </div>
          )}
        </div>

        {input.isPropertyCase ? (
          <>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-xs text-slate-500">当前选择金额：</span>
              <div className="text-right">
                <span className="text-lg sm:text-2xl font-black text-blue-600 tracking-tight">
                  ¥ {input.claimAmount.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 ml-1">元</span>
              </div>
            </div>

            {/* 动态快捷金额按钮 */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
              {currentClaimConfig.quickAmounts.map((q) => {
                const isSelected = input.claimAmount === q.val;
                return (
                  <button
                    key={q.val}
                    type="button"
                    onClick={() => onChange({ isPropertyCase: true, claimAmount: q.val })}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>

            {/* 自定义拖动与输入 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
              <div className="sm:col-span-2">
                <input
                  type="range"
                  min={currentClaimConfig.sliderMin}
                  max={currentClaimConfig.sliderMax}
                  step={currentClaimConfig.sliderStep}
                  value={input.claimAmount > currentClaimConfig.sliderMax ? currentClaimConfig.sliderMax : input.claimAmount}
                  onChange={(e) => onChange({ isPropertyCase: true, claimAmount: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-bold">¥</span>
                <input
                  type="number"
                  value={input.claimAmount || ''}
                  onChange={(e) => onChange({ isPropertyCase: true, claimAmount: Math.max(0, Number(e.target.value)) })}
                  placeholder="输入准确金额"
                  className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm font-bold bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800">当前选择：不涉及共同财产分割（纯人身关系/争抚养权诉讼）</span>
            <p className="text-[11px] text-slate-500">
              法院仅收取基础案件受理费（通常 150~300 元），律师按基础件计费。
            </p>
          </div>
        )}
      </section>

      {/* 问题 3：手头保存了哪些材料？（已根据上方的纠纷类型动态精准匹配！） */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              关于【{currentCategory.title}】，你手头保存了哪些材料？
            </h3>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold hidden sm:inline">
            已为您定制专属证据项
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* 证据充分 */}
          <button
            type="button"
            onClick={() => onChange({ evidenceLevel: 'strong' })}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
              input.evidenceLevel === 'strong'
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 text-emerald-950 font-semibold shadow-xs'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {input.evidenceLevel === 'strong' && (
              <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
            <div className="font-bold text-xs sm:text-sm text-slate-900 pr-4">
              {currentEvidenceOptions.strong.title}
            </div>
            <div className="mt-1">
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800">
                胜诉把握大 (~90%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              {currentEvidenceOptions.strong.desc}
            </p>
          </button>

          {/* 证据中等 */}
          <button
            type="button"
            onClick={() => onChange({ evidenceLevel: 'medium' })}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
              input.evidenceLevel === 'medium'
                ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 text-blue-950 font-semibold shadow-xs'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {input.evidenceLevel === 'medium' && (
              <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
            <div className="font-bold text-xs sm:text-sm text-slate-900 pr-4">
              {currentEvidenceOptions.medium.title}
            </div>
            <div className="mt-1">
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-blue-100 text-blue-800">
                胜诉率中等 (~65%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              {currentEvidenceOptions.medium.desc}
            </p>
          </button>

          {/* 证据较弱 */}
          <button
            type="button"
            onClick={() => onChange({ evidenceLevel: 'weak' })}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
              input.evidenceLevel === 'weak'
                ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20 text-amber-950 font-semibold shadow-xs'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {input.evidenceLevel === 'weak' && (
              <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
            <div className="font-bold text-xs sm:text-sm text-slate-900 pr-4">
              {currentEvidenceOptions.weak.title}
            </div>
            <div className="mt-1">
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-100 text-amber-800">
                需律师调查补充 (~40%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              {currentEvidenceOptions.weak.desc}
            </p>
          </button>
        </div>
      </section>

      {/* 问题 4：对方现在的经济状况怎么样？ */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              对方目前的经济状况怎么样？（打赢后能否拿到现钱）
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: 'high',
              title: '对方有资产有钱',
              desc: '名下有房产、汽车、正常领工资或公司正常开着',
              tag: '回款有保障',
              tagColor: 'bg-emerald-100 text-emerald-800',
            },
            {
              id: 'medium',
              title: '一般 / 不太清楚',
              desc: '在正常上班或做小买卖，需要法院查封银行卡与微信',
              tag: '需法院查控',
              tagColor: 'bg-blue-100 text-blue-800',
            },
            {
              id: 'low',
              title: '对方是老赖 / 跑路了',
              desc: '欠债累累、名下查不到房车、人也找不到（执行风险大）',
              tag: '执行不能风险高',
              tagColor: 'bg-rose-100 text-rose-800',
            },
          ].map((sol) => {
            const isSelected = input.solvencyLevel === sol.id;
            return (
              <button
                key={sol.id}
                type="button"
                onClick={() => onChange({ solvencyLevel: sol.id as SolvencyLevel })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 text-indigo-950 font-semibold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className="font-bold text-xs sm:text-sm">{sol.title}</div>
                <div className="mt-1">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${sol.tagColor}`}>
                    {sol.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{sol.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 问题 5：事情进展到哪一步 & 在哪个省打官司？ */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            5
          </span>
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            事情目前进展到哪一步？ & 去哪个省打官司？
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              目前处于什么阶段？
            </label>
            <select
              value={input.stage}
              onChange={(e) => onChange({ stage: e.target.value as LitigationStage })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="first_instance_summary">刚准备起诉 · 事实清楚快速审（诉讼费减半 · 3个月内）</option>
              <option value="first_instance_normal">刚准备起诉 · 案情复杂普通审（全额诉讼费 · 6个月内）</option>
              <option value="second_instance">一审判了我不服 · 准备上诉打二审（3个月内）</option>
              <option value="execution">官司打赢了对方赖账 · 申请法院强制执行（6个月内）</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              去哪个省市打官司？（通常是被告所在城市或合同签定地）
            </label>
            <select
              value={input.regionId}
              onChange={(e) => onChange({ regionId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  📍 {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 问题 6：两个省钱小开关 */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            6
          </span>
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            两个维权小开关（是否能让对方买单 / 自身误工）
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-100/70 transition-colors">
            <input
              type="checkbox"
              checked={input.hasContractFeeClause}
              onChange={(e) => onChange({ hasContractFeeClause: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-900">
                合同或借条里写过「谁违约谁掏律师费」
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                如果有写，法院判决胜诉后通常直接判令被告全额报销您的律师费！
              </p>
            </div>
          </label>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2">
            <div className="text-xs">
              <span className="font-bold text-slate-900">你平时大约月薪 (元)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                用于换算自己亲自打官司请假扣工资划不划算
              </p>
            </div>
            <div className="relative w-24 shrink-0">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 text-xs">¥</span>
              <input
                type="number"
                value={input.clientMonthlySalary || ''}
                onChange={(e) => onChange({ clientMonthlySalary: Math.max(0, Number(e.target.value)) })}
                placeholder="10000"
                className="w-full pl-6 pr-2 py-1 text-xs font-bold bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
