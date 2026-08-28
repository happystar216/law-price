import React from 'react';
import type { FinancialBreakdown } from '../types';
import {
  Wallet,
  Sparkles,
  Info,
  CheckCircle2,
  Plane,
} from 'lucide-react';

interface FinancialSummaryCardProps {
  financial: FinancialBreakdown;
  claimAmount?: number;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ financial }) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
      {/* 标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">打官司预计总花费明细</h2>
            <p className="text-xs text-slate-500">透明列出各项费用开支、异地差旅与承担规则</p>
          </div>
        </div>

        {financial.canTransferLawyerFee ? (
          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>✨ 胜诉后依法由对方全额报销律师费</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>常规纠纷：诉讼费对方退还 · 仅律师费</span>
          </div>
        )}
      </div>

      {/* 单一清晰的核心价格大卡片 */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
        
        <div className="text-xs text-slate-300 font-medium flex items-center justify-between">
          <span>本案维权预计总花费</span>
          {financial.canTransferLawyerFee ? (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
              对方全额买单
            </span>
          ) : (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-400/30">
              诉讼费打赢对方返还 · 仅律师费
            </span>
          )}
        </div>

        <div className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
          {financial.canTransferLawyerFee ? (
            <span className="text-emerald-300 font-black">¥ 0 元</span>
          ) : (
            <>
              ¥ {financial.finalNetCostMin.toLocaleString()} ~ {financial.finalNetCostMax.toLocaleString()}{' '}
              <span className="text-sm font-normal text-slate-300">元</span>
            </>
          )}
        </div>

        <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
          {financial.canTransferLawyerFee
            ? '🎉 本案符合律师费转嫁规则，判决胜诉后法院责令对方全额赔偿您的律师费与诉讼费，您最终实际支出为 0 元！'
            : '打赢官司后，法院收取的案件受理费由输了的被告全额退还给您；您最终真正支出的费用主要为请律师的专业服务费。'}
        </p>

        {/* 异地省差旅费标签 */}
        {financial.isCrossRegion && (
          <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-amber-300 font-bold flex items-center space-x-1">
              <Plane className="w-3.5 h-3.5" />
              <span>异地诉讼差旅费省钱特权：</span>
            </span>
            <span className="text-emerald-300 font-black">
              平台直配起诉地同城律师 · 差旅费 ¥0 (立省约 ¥{financial.travelCostSaved.toLocaleString()})
            </span>
          </div>
        )}
      </div>

      {/* 费用明细表格 */}
      <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
        <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-700 grid grid-cols-12 border-b border-slate-200">
          <div className="col-span-4 sm:col-span-3">各项费用名目</div>
          <div className="col-span-4 sm:col-span-3">金额参考</div>
          <div className="col-span-4 sm:col-span-3">承担归属规则</div>
          <div className="hidden sm:block sm:col-span-3 text-right">法律与行业依据</div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* 律师费 */}
          <div className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-50/60 transition-colors">
            <div className="col-span-4 sm:col-span-3 font-semibold text-slate-800">
              律师代理服务费
            </div>
            <div className="col-span-4 sm:col-span-3 font-bold text-slate-900">
              ¥ {financial.lawyerFeeMin.toLocaleString()} ~ {financial.lawyerFeeMax.toLocaleString()}
              <div className="text-[10px] text-slate-400 font-normal">
                起诉地参考均价: ¥{financial.lawyerFeeMedian.toLocaleString()}
              </div>
            </div>
            <div className="col-span-4 sm:col-span-3">
              {financial.canTransferLawyerFee ? (
                <span className="text-emerald-700 font-bold">依法可要求对方全额报销</span>
              ) : (
                <span className="text-slate-600">委托人自行支付</span>
              )}
            </div>
            <div className="hidden sm:block sm:col-span-3 text-right text-slate-400 text-[11px]">
              起诉地省律协指导标准
            </div>
          </div>

          {/* 异地办案差旅费对比（核心机会点） */}
          {financial.isCrossRegion && (
            <div className="px-4 py-3 grid grid-cols-12 items-center bg-emerald-50/50 hover:bg-emerald-50/80 transition-colors border-l-2 border-emerald-500">
              <div className="col-span-4 sm:col-span-3 font-bold text-emerald-950 flex items-center space-x-1">
                <Plane className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>异地出庭办案差旅费</span>
              </div>
              <div className="col-span-4 sm:col-span-3">
                <div className="text-emerald-700 font-black text-xs">
                  ✨ 平台直配: ¥0 元
                </div>
                <div className="text-[10px] text-slate-400 line-through">
                  传统本地律师: ¥{financial.traditionalTravelCostMin.toLocaleString()}~{financial.traditionalTravelCostMax.toLocaleString()}
                </div>
              </div>
              <div className="col-span-4 sm:col-span-3 text-emerald-700 font-bold">
                平台直配当地律师 · 零差旅
              </div>
              <div className="hidden sm:block sm:col-span-3 text-right text-emerald-600 text-[11px] font-bold">
                立省约 ¥{financial.travelCostSaved.toLocaleString()} 差旅费
              </div>
            </div>
          )}

          {/* 法院诉讼费 */}
          <div className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-50/60 transition-colors">
            <div className="col-span-4 sm:col-span-3 font-semibold text-slate-800 flex items-center space-x-1">
              <span>法院案件受理费</span>
              {financial.isSummaryDiscount && (
                <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-normal">
                  快速审减半
                </span>
              )}
            </div>
            <div className="col-span-4 sm:col-span-3 font-bold text-blue-600">
              ¥ {financial.courtFeeDiscounted.toLocaleString()}{' '}
              {financial.isSummaryDiscount && (
                <span className="text-[10px] text-slate-400 line-through">
                  ¥{financial.courtFee.toLocaleString()}
                </span>
              )}
            </div>
            <div className="col-span-4 sm:col-span-3 text-emerald-700 font-bold">
              打赢由对方全额承担
            </div>
            <div className="hidden sm:block sm:col-span-3 text-right text-slate-400 text-[11px]">
              《诉讼费用交纳办法》第13条
            </div>
          </div>

          {/* 财产保全费 */}
          <div className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-50/60 transition-colors">
            <div className="col-span-4 sm:col-span-3 font-semibold text-slate-800">
              财产保全费 (冻结对方资产)
            </div>
            <div className="col-span-4 sm:col-span-3 font-bold text-slate-900">
              ¥ {(financial.preservationFee + financial.preservationInsuranceFee).toLocaleString()}
              <div className="text-[10px] text-slate-400 font-normal">
                保全费 ¥{financial.preservationFee.toLocaleString()} + 保险费 ¥{financial.preservationInsuranceFee.toLocaleString()}
              </div>
            </div>
            <div className="col-span-4 sm:col-span-3 text-emerald-700 font-bold">
              打赢由对方全额承担
            </div>
            <div className="hidden sm:block sm:col-span-3 text-right text-slate-400 text-[11px]">
              最高5000元封顶
            </div>
          </div>

          {/* 强制执行费 */}
          <div className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-50/60 transition-colors">
            <div className="col-span-4 sm:col-span-3 font-semibold text-slate-800">
              申请法院强制执行费
            </div>
            <div className="col-span-4 sm:col-span-3 font-bold text-slate-900">
              ¥ {financial.executionFee.toLocaleString()}
            </div>
            <div className="col-span-4 sm:col-span-3 text-blue-700 font-bold">
              前期不用交 (从追回钱里扣)
            </div>
            <div className="hidden sm:block sm:col-span-3 text-right text-slate-400 text-[11px]">
              由被执行人承担
            </div>
          </div>
        </div>
      </div>

      {/* 律师费转嫁说明 */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">关于律师费能否让对方掏的依据：</span>
          <span className="text-slate-600 ml-1">{financial.lawyerFeeTransferReason}</span>
        </div>
      </div>
    </div>
  );
};
