import React from 'react';
import type {
  CaseInputState,
  EvidenceLevel,
  FeeMode,
  LitigationStage,
  SolvencyLevel,
} from '../types';
import { CASE_CATEGORIES } from '../data/caseTypes';
import {
  Coins,
  Building,
  FileCheck2,
  Sparkles,
  Sliders,
} from 'lucide-react';

interface CaseInputSectionProps {
  input: CaseInputState;
  onChange: (updates: Partial<CaseInputState>) => void;
}

const QUICK_AMOUNTS = [
  { label: '3万', val: 30000 },
  { label: '5万', val: 50000 },
  { label: '10万', val: 100000 },
  { label: '30万', val: 300000 },
  { label: '50万', val: 500000 },
  { label: '100万', val: 1000000 },
  { label: '300万', val: 3000000 },
  { label: '1000万', val: 10000000 },
];

export const CaseInputSection: React.FC<CaseInputSectionProps> = ({ input, onChange }) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">案情与诉讼参数输入</h2>
            <p className="text-xs text-slate-500">参数越精确，成本测算与ROI决策模型越贴近实际</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => onChange({ isPropertyCase: true })}
            className={`px-3 py-1 rounded-lg transition-all ${
              input.isPropertyCase
                ? 'bg-white text-blue-600 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            财产纠纷
          </button>
          <button
            type="button"
            onClick={() => onChange({ isPropertyCase: false, claimAmount: 0 })}
            className={`px-3 py-1 rounded-lg transition-all ${
              !input.isPropertyCase
                ? 'bg-white text-blue-600 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            非财产争议
          </button>
        </div>
      </div>

      {/* 1. 纠纷类型选择 */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          1. 纠纷案件类型
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {CASE_CATEGORIES.map((cat) => {
            const isSelected = input.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange({ category: cat.id })}
                className={`text-left p-3 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-medium truncate">{cat.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{cat.shortDesc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 争议标的金额 (财产件) */}
      {input.isPropertyCase ? (
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>2. 诉讼请求争议金额（标的额）</span>
            </label>
            <span className="text-lg sm:text-xl font-extrabold text-blue-600 tracking-tight">
              ¥ {input.claimAmount.toLocaleString()} 元
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q.val}
                type="button"
                onClick={() => onChange({ claimAmount: q.val })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  input.claimAmount === q.val
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="sm:col-span-2 flex items-center">
              <input
                type="range"
                min="5000"
                max="5000000"
                step="5000"
                value={input.claimAmount > 5000000 ? 5000000 : input.claimAmount}
                onChange={(e) => onChange({ claimAmount: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                ¥
              </div>
              <input
                type="number"
                value={input.claimAmount || ''}
                onChange={(e) => onChange({ claimAmount: Math.max(0, Number(e.target.value)) })}
                placeholder="自定义金额"
                className="w-full pl-7 pr-3 py-1.5 text-xs sm:text-sm font-semibold bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">当前为非财产争议模式：</span>
            <span>如纯抚养权变更、名誉权侵权恢复名誉、无金额劳动确认等，按件统一计费。</span>
          </div>
        </div>
      )}

      {/* 3. 诉讼程序 & 计费偏好 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            3. 诉讼审理程序
          </label>
          <select
            value={input.stage}
            onChange={(e) => onChange({ stage: e.target.value as LitigationStage })}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="first_instance_summary">一审（简易程序 / 诉讼费减半 / 3个月内）</option>
            <option value="first_instance_normal">一审（普通程序 / 全额诉讼费 / 6个月内）</option>
            <option value="second_instance">二审程序（上诉终审 / 3个月内）</option>
            <option value="execution">单独申请强制执行程序（6个月内）</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            4. 偏好律师收费模式
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'standard', name: '标准阶梯', desc: '前期固定' },
              { id: 'risk', name: '纯风险代理', desc: '回款提成' },
              { id: 'half_risk', name: '半风险', desc: '基础+提成' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onChange({ feeMode: m.id as FeeMode })}
                className={`p-2 rounded-xl border text-center text-xs transition-all ${
                  input.feeMode === m.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-medium">{m.name}</div>
                <div className="text-[10px] text-slate-400">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 关键定性与胜诉回款条件 */}
      <div className="border-t border-slate-100 pt-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              <span>证据链完备程度 (影响胜诉率)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'strong', label: '充分确凿', sub: '借条/原件齐全' },
                { id: 'medium', label: '部分瑕疵', sub: '需补充补强' },
                { id: 'weak', label: '主要欠缺', sub: '缺直接证据' },
              ].map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => onChange({ evidenceLevel: ev.id as EvidenceLevel })}
                  className={`p-2 rounded-lg border text-xs text-center transition-all ${
                    input.evidenceLevel === ev.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div>{ev.label}</div>
                  <div className="text-[10px] text-slate-400">{ev.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span>对方财产与偿还能力 (影响回款率)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'high', label: '资产明确', sub: '有房/车/流水' },
                { id: 'medium', label: '正常经营', sub: '需法院查控' },
                { id: 'low', label: '老赖/失联', sub: '执行不能风险' },
              ].map((sol) => (
                <button
                  key={sol.id}
                  type="button"
                  onClick={() => onChange({ solvencyLevel: sol.id as SolvencyLevel })}
                  className={`p-2 rounded-lg border text-xs text-center transition-all ${
                    input.solvencyLevel === sol.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-semibold ring-1 ring-indigo-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div>{sol.label}</div>
                  <div className="text-[10px] text-slate-400">{sol.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={input.hasContractFeeClause}
              onChange={(e) => onChange({ hasContractFeeClause: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-800">合同约定违约方承担律师费</span>
              <p className="text-[11px] text-slate-500">胜诉后可依法向法院请求判令对方报销您的律师费</p>
            </div>
          </label>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600 font-medium shrink-0">您的月薪预估:</span>
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 text-xs">¥</span>
              <input
                type="number"
                value={input.clientMonthlySalary || ''}
                onChange={(e) => onChange({ clientMonthlySalary: Math.max(0, Number(e.target.value)) })}
                placeholder="10000"
                className="w-full pl-6 pr-2.5 py-1 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-[11px] text-slate-400 shrink-0">用于计算自身误工成本</span>
          </div>
        </div>
      </div>
    </div>
  );
};
