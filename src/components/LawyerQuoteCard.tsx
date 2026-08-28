import React, { useState } from 'react';
import type { FullCaseAnalysis } from '../types';
import { CASE_CATEGORIES } from '../data/caseTypes';
import { REGIONS } from '../data/regions';
import { Copy, Check, Send } from 'lucide-react';

interface LawyerQuoteCardProps {
  analysis: FullCaseAnalysis;
}

export const LawyerQuoteCard: React.FC<LawyerQuoteCardProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);
  const [lawyerName, setLawyerName] = useState('张律师团队');
  const [lawyerContact, setLawyerContact] = useState('138-XXXX-XXXX');
  const [customQuote, setCustomQuote] = useState(analysis.financial.lawyerFeeMedian);

  const categoryName =
    CASE_CATEGORIES.find((c) => c.id === analysis.input.category)?.name || '民商事争议';
  const regionName =
    REGIONS.find((r) => r.id === analysis.input.regionId)?.name || '标准管辖';

  const quoteText = `【诉讼成本与法律服务报价建议书】
--------------------------------
■ 案件类型：${categoryName}
■ 管辖地区：${regionName}
■ 争议标的：${analysis.input.isPropertyCase ? `¥${analysis.input.claimAmount.toLocaleString()} 元` : '非财产争议'}
■ 预估审理周期：${analysis.timeAndEffort.calendarMonthsMin} ~ ${analysis.timeAndEffort.calendarMonthsMax} 个月

【一、诉讼费用预算构成】
1. 法院受理费（预付）：约 ¥${analysis.financial.courtFeeDiscounted.toLocaleString()} 元（胜诉由败诉方全额退还）
2. 财产保全及担保费：约 ¥${(analysis.financial.preservationFee + analysis.financial.preservationInsuranceFee).toLocaleString()} 元（保全费胜诉后对方承担）
3. 律师代理服务费：建议方案 ¥${customQuote.toLocaleString()} 元
4. 律师费转嫁支持：${analysis.financial.canTransferLawyerFee ? '依法支持胜诉后由对方全额承担' : '常规各自承担'}

【二、律师团队服务交付承诺】
- 涵盖诉前证据链梳理、起诉状与保全立案、庭审质证辩论、执行回款辅导全流程 4 大阶段（合计约 ${analysis.workload.totalHours} 专业工时）。
- 当事人仅需配合必要签字材料（约 ${analysis.timeAndEffort.clientHoursWithLawyer} 小时），无需频繁请假跑法院。

--------------------------------
承办律师：${lawyerName}
咨询热线：${lawyerContact}
测算依据：全国律协及《诉讼费用交纳办法》法定收费标准`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-7 border border-indigo-700/50 shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-800 pb-4 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              律师端：标准化报价单与方案一键生成
            </h2>
            <p className="text-xs text-indigo-300/80">
              用于向客户清晰解释收费依据、展现工时清单，一键复制微信沟通格式
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? '已复制报价单文本' : '一键复制报价文本'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] text-indigo-300 mb-1">承办律师/团队名</label>
          <input
            type="text"
            value={lawyerName}
            onChange={(e) => setLawyerName(e.target.value)}
            className="w-full bg-indigo-950/60 border border-indigo-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="block text-[11px] text-indigo-300 mb-1">联系方式 / 电话</label>
          <input
            type="text"
            value={lawyerContact}
            onChange={(e) => setLawyerContact(e.target.value)}
            className="w-full bg-indigo-950/60 border border-indigo-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="block text-[11px] text-indigo-300 mb-1">本案建议报价金额 (元)</label>
          <input
            type="number"
            value={customQuote}
            onChange={(e) => setCustomQuote(Number(e.target.value))}
            className="w-full bg-indigo-950/60 border border-indigo-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-400 font-bold"
          />
        </div>
      </div>

      <div className="bg-slate-950/80 rounded-xl p-4 border border-indigo-900/60 font-mono text-[11px] text-indigo-100 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
        {quoteText}
      </div>
    </div>
  );
};
