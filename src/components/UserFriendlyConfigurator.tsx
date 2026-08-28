import React from 'react';
import type {
  CaseInputState,
  EvidenceLevel,
  LitigationStage,
  SolvencyLevel,
} from '../types';
import { REGIONS } from '../data/regions';
import { Check } from 'lucide-react';

interface UserFriendlyConfiguratorProps {
  input: CaseInputState;
  onChange: (updates: Partial<CaseInputState>) => void;
}

const USER_FRIENDLY_SCENARIOS = [
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

const USER_AMOUNTS = [
  { label: '2万以内', val: 20000 },
  { label: '5万', val: 50000 },
  { label: '10万', val: 100000 },
  { label: '30万', val: 300000 },
  { label: '50万', val: 500000 },
  { label: '100万', val: 1000000 },
  { label: '300万', val: 3000000 },
  { label: '500万+', val: 5000000 },
];

export const UserFriendlyConfigurator: React.FC<UserFriendlyConfiguratorProps> = ({
  input,
  onChange,
}) => {
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
                onClick={() => onChange({ category: sc.id as any })}
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

      {/* 问题 2：你想追回多少钱？ */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              你想向对方要回多少钱？ / 涉及多少金额？
            </h3>
          </div>
          <div className="text-right">
            <span className="text-lg sm:text-2xl font-black text-blue-600 tracking-tight">
              ¥ {input.claimAmount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 ml-1">元</span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
          {USER_AMOUNTS.map((q) => {
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
          <div className="sm:col-span-2">
            <input
              type="range"
              min="5000"
              max="3000000"
              step="5000"
              value={input.claimAmount > 3000000 ? 3000000 : input.claimAmount}
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
      </section>

      {/* 问题 3：手头有哪些证据凭证？ */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              你手头保存了哪些凭据材料？（直接决定胜诉把握）
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: 'strong',
              title: '证据很全，白纸黑字',
              desc: '有借条/合同/签收单原件 + 银行转账记录，非常清楚',
              tag: '胜诉把握大',
              tagColor: 'bg-emerald-100 text-emerald-800',
            },
            {
              id: 'medium',
              title: '证据一般，稍有欠缺',
              desc: '只有微信聊天截图或部分转账，没有正式盖章/签字的协议',
              tag: '需要补充质证',
              tagColor: 'bg-blue-100 text-blue-800',
            },
            {
              id: 'weak',
              title: '主要靠口头，凭证很少',
              desc: '主要通过口头约定或现金交易，找不到直接的书面记录',
              tag: '需调查取证',
              tagColor: 'bg-amber-100 text-amber-800',
            },
          ].map((ev) => {
            const isSelected = input.evidenceLevel === ev.id;
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => onChange({ evidenceLevel: ev.id as EvidenceLevel })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 text-emerald-950 font-semibold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs sm:text-sm">{ev.title}</span>
                </div>
                <div className="mt-1">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${ev.tagColor}`}>
                    {ev.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{ev.desc}</p>
              </button>
            );
          })}
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
