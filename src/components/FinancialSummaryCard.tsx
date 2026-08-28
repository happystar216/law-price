import React from 'react';
import type { FinancialBreakdown } from '../types';
import {
  Wallet,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
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
            <h2 className="text-base sm:text-lg font-bold text-slate-900">打官司到底要花多少钱？（金钱总账本）</h2>
            <p className="text-xs text-slate-500">分清「起步先垫付多少」与「打赢官司后实际净掏了多少」</p>
          </div>
        </div>

        {/* 对方是否报销律师费标签 */}
        {financial.canTransferLawyerFee ? (
          <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>✨ 胜诉后依法由对方全额报销律师费</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>常规纠纷：律师费各自承担</span>
          </div>
        )}
      </div>

      {/* 两大核心金钱对比：起步先垫 vs 赢了之后实际花销 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. 起步先垫多少 */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 relative overflow-hidden shadow-md">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>① 刚开始起诉要准备（前期先垫付）</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 font-bold">赢了会退还</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            ¥ {financial.upfrontCostMin.toLocaleString()} ~ {financial.upfrontCostMax.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            包含：先交给法院的诉讼费（¥{financial.courtFeeDiscounted.toLocaleString()}）+ 律师代理费 + 冻结对方账户的保全费。<strong>打赢官司后，法院会强制要求对方全额退还诉讼费！</strong>
          </p>
        </div>

        {/* 2. 打赢官司后实际花销 */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl p-5 relative overflow-hidden shadow-md">
          <div className="text-xs text-emerald-300 font-medium flex items-center justify-between">
            <span>② 打赢官司后你实际花的钱（最终净支出）</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-semibold">退费后真正掏的</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-2 tracking-tight">
            ¥ {financial.finalNetCostMin.toLocaleString()} ~ {financial.finalNetCostMax.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-100/80 mt-2 leading-relaxed">
            {financial.canTransferLawyerFee
              ? '🎉 太划算了！因为有违约条款或法定支持，诉讼费和律师费全部由对方买单，您基本不用掏钱！'
              : '诉讼费已经全额退回您的账户，您最终真正付出的主要就是请律师的专业服务费。'}
          </p>
        </div>
      </div>

      {/* 常见疑问解释小贴士 */}
      <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/80 text-xs space-y-1.5 text-slate-700">
        <div className="font-bold text-blue-900 flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>通俗解答：为什么打赢了还会显示有费用？</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-600">
          打官司中，<strong>法院收的诉讼费（案件受理费、保全费）只要你打赢了，法律规定必须由输了的被告全额退给你</strong>。
          但<strong>律师费</strong>除非合同专门约定了“违约方掏律师费”或者知识产权侵权等法定情形，否则通常是自己请律师自己付费。所以退费之后，你真正掏出去的钱就是律师费。
        </p>
      </div>

      {/* 费用明细表格 */}
      <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
        <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-700 grid grid-cols-12 border-b border-slate-200">
          <div className="col-span-4 sm:col-span-3">各项费用名目</div>
          <div className="col-span-4 sm:col-span-3">大约多少钱</div>
          <div className="col-span-4 sm:col-span-3">最后谁来掏这笔钱？</div>
          <div className="hidden sm:block sm:col-span-3 text-right">法律依据</div>
        </div>

        <div className="divide-y divide-slate-100">
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
              打赢由对方全额退还
            </div>
            <div className="hidden sm:block sm:col-span-3 text-right text-slate-400 text-[11px]">
              《诉讼费用交纳办法》第13条
            </div>
          </div>

          {/* 律师费 */}
          <div className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-50/60 transition-colors">
            <div className="col-span-4 sm:col-span-3 font-semibold text-slate-800">
              律师代理服务费
            </div>
            <div className="col-span-4 sm:col-span-3 font-bold text-slate-900">
              ¥ {financial.lawyerFeeMin.toLocaleString()} ~ {financial.lawyerFeeMax.toLocaleString()}
              <div className="text-[10px] text-slate-400 font-normal">
                当地参考均价: ¥{financial.lawyerFeeMedian.toLocaleString()}
              </div>
            </div>
            <div className="col-span-4 sm:col-span-3">
              {financial.canTransferLawyerFee ? (
                <span className="text-emerald-700 font-bold">依法可要求对方报销</span>
              ) : (
                <span className="text-slate-600">自己支付给律师</span>
              )}
            </div>
            <div className="hidden sm:block sm:col-span-3 text-right text-slate-400 text-[11px]">
              省律协指导标准与市场化协商
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
              打赢由对方全额退还
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

      {/* 律师费转嫁支持说明 */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">律师费能否让对方掏的法律依据：</span>
          <span className="text-slate-600 ml-1">{financial.lawyerFeeTransferReason}</span>
        </div>
      </div>
    </div>
  );
};
