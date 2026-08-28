import React from 'react';
import type { FullCaseAnalysis } from '../types';
import { CASE_CATEGORIES } from '../data/caseTypes';
import { REGIONS } from '../data/regions';
import { X, Printer, Scale } from 'lucide-react';

interface ReportModalProps {
  analysis: FullCaseAnalysis;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ analysis, onClose }) => {
  const category = CASE_CATEGORIES.find((c) => c.id === analysis.input.category) || CASE_CATEGORIES[0];
  const region = REGIONS.find((r) => r.id === analysis.input.regionId) || REGIONS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm sm:text-base">诉讼全景决策与维权成本评估报告 (预览)</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>打印 / 导出 PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 text-slate-900 bg-white" id="report-content">
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                LAWPRICE LITIGATION DECISION REPORT
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                诉讼全景决策与维权成本评估报告
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                生成时间：{analysis.generatedAt} | 测算依据：全国律协指导规范与《诉讼费用交纳办法》
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-400">综合决策指数</div>
              <div className="text-2xl font-black text-blue-600">{analysis.roi.roiScore} / 100</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-2">
              一、 案件基础参数与背景
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs border border-slate-200">
              <div>
                <span className="text-slate-400 block">案件性质</span>
                <span className="font-bold text-slate-800">{category.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">管辖地区</span>
                <span className="font-bold text-slate-800">{region.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">涉案标的额</span>
                <span className="font-bold text-blue-600">
                  {analysis.input.isPropertyCase ? `¥${analysis.input.claimAmount.toLocaleString()} 元` : '非财产争议'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">诉讼阶段</span>
                <span className="font-bold text-slate-800">
                  {analysis.input.stage.includes('summary') ? '一审（简易程序）' : '一审（普通程序）'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-2">
              二、 诉讼全周期费用构成清单
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-700">
                  <th className="p-2.5 border border-slate-200">费用类别</th>
                  <th className="p-2.5 border border-slate-200">测算金额区间</th>
                  <th className="p-2.5 border border-slate-200">承担规则</th>
                  <th className="p-2.5 border border-slate-200">法定/政策依据</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 border border-slate-200 font-medium">法院案件受理费</td>
                  <td className="p-2.5 border border-slate-200 font-bold text-blue-600">
                    ¥{analysis.financial.courtFeeDiscounted.toLocaleString()}
                  </td>
                  <td className="p-2.5 border border-slate-200 text-emerald-700">胜诉由败诉方全额承担</td>
                  <td className="p-2.5 border border-slate-200 text-slate-500">《诉讼费用交纳办法》第13条</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 font-medium">律师代理服务费</td>
                  <td className="p-2.5 border border-slate-200 font-bold">
                    ¥{analysis.financial.lawyerFeeMin.toLocaleString()} ~ ¥{analysis.financial.lawyerFeeMax.toLocaleString()}
                  </td>
                  <td className="p-2.5 border border-slate-200">
                    {analysis.financial.canTransferLawyerFee ? (
                      <span className="text-emerald-700 font-bold">依法可请求对方赔付</span>
                    ) : (
                      '委托人自行承担'
                    )}
                  </td>
                  <td className="p-2.5 border border-slate-200 text-slate-500">各省律协指导标准与市场调节</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 font-medium">财产保全与保函</td>
                  <td className="p-2.5 border border-slate-200 font-bold">
                    ¥{(analysis.financial.preservationFee + analysis.financial.preservationInsuranceFee).toLocaleString()}
                  </td>
                  <td className="p-2.5 border border-slate-200 text-emerald-700">保全费由败诉方承担</td>
                  <td className="p-2.5 border border-slate-200 text-slate-500">最高封顶5000元 + 责任险</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 font-medium">申请执行费</td>
                  <td className="p-2.5 border border-slate-200 font-bold">
                    ¥{analysis.financial.executionFee.toLocaleString()}
                  </td>
                  <td className="p-2.5 border border-slate-200 text-blue-700">前期免交，执行款中扣除</td>
                  <td className="p-2.5 border border-slate-200 text-slate-500">《交纳办法》第14条</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2.5 border border-slate-200">前期启动垫付合计</td>
                  <td className="p-2.5 border border-slate-200 text-slate-900" colSpan={3}>
                    ¥{analysis.financial.upfrontCostMin.toLocaleString()} ~ ¥{analysis.financial.upfrontCostMax.toLocaleString()} 元
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-2">
              三、 诉讼周期与当事人精力消耗
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">客观自然流逝审限</span>
                <p className="text-slate-600">
                  一审法定/平均流转耗时：<strong>{analysis.timeAndEffort.calendarMonthsMin} ~ {analysis.timeAndEffort.calendarMonthsMax} 个月</strong>。90% 以上时间为法院送达与排期，无需日常奔波。
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 block">当事人自身精力工时</span>
                <p className="text-emerald-900">
                  委托律师仅需配合约 <strong>{analysis.timeAndEffort.clientHoursWithLawyer} 小时</strong>（自学亲力亲为需耗费约 {analysis.timeAndEffort.clientHoursSelf} 小时），节省大量误工与试错成本。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-blue-600 pl-2">
              四、 律师专业交付动作（合计约 {analysis.workload.totalHours} 专业工时）
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {analysis.workload.stages.map((stage) => (
                <div key={stage.stageId} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1 flex justify-between">
                    <span>{stage.stageTitle}</span>
                    <span className="text-blue-600">{stage.stageHours}h</span>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                    {stage.items.slice(0, 2).map((it) => (
                      <li key={it.id}>{it.title}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t-2 border-slate-900 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              五、 最终维权决策评估意见
            </h3>
            <div className="p-4 rounded-xl bg-slate-100 text-xs space-y-2">
              <div className="font-bold text-sm text-slate-900">
                结论：{analysis.roi.recommendationTitle}
              </div>
              <ul className="space-y-1 text-slate-700">
                {analysis.roi.recommendationDetails.map((det, i) => (
                  <li key={i}>• {det.replace(/\*\*/g, '')}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-4 leading-relaxed">
            * 声明：本评估报告基于司法统计模型与现行收费指导标准生成，仅供当事人维权决策及预算参考，不构成律师对案件结果的保胜承诺。实际费用与审理周期以法院裁决及生效法律服务委托合同为准。
          </div>
        </div>
      </div>
    </div>
  );
};
