import React from 'react';
import type {
  CaseInputState,
  EvidenceLevel,
  FeeMode,
  LitigationStage,
  SolvencyLevel,
} from '../types';
import { CASE_CATEGORIES } from '../data/caseTypes';
import { REGIONS } from '../data/regions';
import {
  Check,
  Building,
  FileCheck2,
  MapPin,
  Scale,
} from 'lucide-react';

interface CaseConfiguratorProps {
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
  { label: '500万', val: 5000000 },
];

export const CaseConfigurator: React.FC<CaseConfiguratorProps> = ({ input, onChange }) => {
  return (
    <div className="space-y-4">
      {/* 1. 案件纠纷类型配置 */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">选择案件纠纷类型</h3>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => onChange({ isPropertyCase: true })}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
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
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                !input.isPropertyCase
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              非财产争议
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {CASE_CATEGORIES.map((cat) => {
            const isSelected = input.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange({ category: cat.id })}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 text-blue-950 font-semibold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className="text-xs font-bold truncate pr-3">{cat.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{cat.shortDesc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. 争议金额（标的额）配置 */}
      {input.isPropertyCase && (
        <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">设定争议标的金额</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 mr-1">当前金额:</span>
              <span className="text-lg sm:text-2xl font-black text-blue-600 tracking-tight">
                ¥ {input.claimAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">元</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {QUICK_AMOUNTS.map((q) => {
              const isSelected = input.claimAmount === q.val;
              return (
                <button
                  key={q.val}
                  type="button"
                  onClick={() => onChange({ claimAmount: q.val })}
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
                max="5000000"
                step="5000"
                value={input.claimAmount > 5000000 ? 5000000 : input.claimAmount}
                onChange={(e) => onChange({ claimAmount: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs">¥</span>
              <input
                type="number"
                value={input.claimAmount || ''}
                onChange={(e) => onChange({ claimAmount: Math.max(0, Number(e.target.value)) })}
                placeholder="输入具体金额"
                className="w-full pl-7 pr-3 py-2 text-xs sm:text-sm font-bold bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>
      )}

      {/* 3. 管辖地区与审理程序 */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">管辖地区与诉讼程序</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>管辖省市 (适用当地律协参考收费)</span>
            </label>
            <select
              value={input.regionId}
              onChange={(e) => onChange({ regionId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl p-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  📍 {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center space-x-1">
              <Scale className="w-3.5 h-3.5 text-indigo-500" />
              <span>诉讼程序阶段 (影响审限与诉讼费)</span>
            </label>
            <select
              value={input.stage}
              onChange={(e) => onChange({ stage: e.target.value as LitigationStage })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl p-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="first_instance_summary">一审（简易程序 / 诉讼费减半50% / 3个月内）</option>
              <option value="first_instance_normal">一审（普通程序 / 全额诉讼费 / 6个月内）</option>
              <option value="second_instance">二审程序（上诉终审 / 3个月内）</option>
              <option value="execution">单独申请强制执行程序（6个月内）</option>
            </select>
          </div>
        </div>
      </section>

      {/* 4. 律师计费方案选择 */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
            4
          </span>
          <h3 className="font-bold text-sm sm:text-base text-slate-900">律师计费方案</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: 'standard',
              name: '标准阶梯代理',
              tag: '稳健首选',
              desc: '前期固定区间，胜诉后法院退诉讼费，胜诉收益100%归当事人。',
            },
            {
              id: 'risk',
              name: '纯风险代理',
              tag: '前期0压力',
              desc: '前期仅收基础材料费，胜诉实际回款后按比例提成（最高30%）。',
            },
            {
              id: 'half_risk',
              name: '半风险组合',
              tag: '折中平衡',
              desc: '前期减半收取基础律师费，案件回款后再按低比例提成（约8%~15%）。',
            },
          ].map((mode) => {
            const isSelected = input.feeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onChange({ feeMode: mode.id as FeeMode })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 text-blue-950 font-semibold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs sm:text-sm">{mode.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-600 font-normal">
                    {mode.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. 胜诉率与回款条件微调 */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
            5
          </span>
          <h3 className="font-bold text-sm sm:text-base text-slate-900">案情胜诉与执行条件微调</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              <span>证据链完备度 (影响法律胜诉率)</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'strong', label: '确凿充分', rate: '~90%' },
                { id: 'medium', label: '存有瑕疵', rate: '~65%' },
                { id: 'weak', label: '缺少直证', rate: '~40%' },
              ].map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => onChange({ evidenceLevel: ev.id as EvidenceLevel })}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    input.evidenceLevel === ev.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="text-xs">{ev.label}</div>
                  <div className="text-[10px] text-slate-400">{ev.rate}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              <span>对方偿债能力 (影响执行回款率)</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'high', label: '资产明确', rate: '~90%' },
                { id: 'medium', label: '正常经营', rate: '~60%' },
                { id: 'low', label: '老赖失联', rate: '~20%' },
              ].map((sol) => (
                <button
                  key={sol.id}
                  type="button"
                  onClick={() => onChange({ solvencyLevel: sol.id as SolvencyLevel })}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    input.solvencyLevel === sol.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-bold ring-1 ring-indigo-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="text-xs">{sol.label}</div>
                  <div className="text-[10px] text-slate-400">{sol.rate}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. 特殊权益与个性化加配 */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
            6
          </span>
          <h3 className="font-bold text-sm sm:text-base text-slate-900">特殊权益与机会成本设置</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
            <input
              type="checkbox"
              checked={input.hasContractFeeClause}
              onChange={(e) => onChange({ hasContractFeeClause: e.target.checked })}
              className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-800">合同约定违约方承担律师费</span>
              <p className="text-[11px] text-slate-500 mt-0.5">胜诉后依法请求判令被告全额报销您的律师费</p>
            </div>
          </label>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2">
            <div className="text-xs">
              <span className="font-bold text-slate-800">您的月薪估算 (元)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">用于精确换算自己打官司的误工损失</p>
            </div>
            <div className="relative w-28 shrink-0">
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
