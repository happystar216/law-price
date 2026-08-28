import React from 'react';
import type { TimeAndEffortBreakdown } from '../types';
import {
  Clock,
  Calendar,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';

interface TimeAndEffortCardProps {
  timeAndEffort: TimeAndEffortBreakdown;
}

export const TimeAndEffortCard: React.FC<TimeAndEffortCardProps> = ({ timeAndEffort }) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">双维度时间与精力分析</h2>
            <p className="text-xs text-slate-500">
              区分「案件流转的客观自然等待」与「当事人自身付出的精力与工时」
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>预估总审限：{timeAndEffort.calendarMonthsMin} ~ {timeAndEffort.calendarMonthsMax} 个月</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            当事人自身精力消耗与机会成本对比
          </span>
          <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>委托律师可减少约 94% 精力损耗</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 border-2 border-emerald-400/80 bg-gradient-to-b from-emerald-50/50 to-white relative shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-500 text-white rounded-lg">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 text-sm">委托律师代理（省心省力）</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                推荐方案
              </span>
            </div>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-emerald-700">{timeAndEffort.clientHoursWithLawyer}</span>
              <span className="text-xs font-semibold text-slate-600">小时（当事人实际耗费）</span>
            </div>

            <div className="mt-2 text-xs text-slate-600 space-y-1.5 border-t border-emerald-100 pt-3">
              <div className="flex items-center space-x-1.5 text-emerald-900 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>仅需配合梳理基础事实材料（约2小时）</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-900 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>线上签署起诉状与委托手续（约0.5小时）</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-900 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>无需请假跑立案庭，平时正常上班不耽误</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-emerald-100/60 rounded-xl text-[11px] text-emerald-900 font-medium flex items-center justify-between">
              <span>当事人自身误工损失：</span>
              <span className="font-bold">仅约 ¥{timeAndEffort.clientLostWageWithLawyer.toLocaleString()} 元</span>
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-slate-200 bg-slate-50/70 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-slate-400 text-white rounded-lg">
                  <UserX className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 text-sm">本人亲自应诉（亲力亲为）</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                高精力损耗
              </span>
            </div>

            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-700">{timeAndEffort.clientHoursSelf}</span>
              <span className="text-xs font-semibold text-slate-600">小时（当事人实际耗费）</span>
            </div>

            <div className="mt-2 text-xs text-slate-600 space-y-1.5 border-t border-slate-200 pt-3">
              <div className="flex items-center space-x-1.5 text-slate-700">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>自学民诉法与证据规则（需15~20小时）</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-700">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>多次请假跑立案庭补正、开庭质证辩论</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-700">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>极易因程序不当或举证逾期承担败诉风险</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-slate-200/70 rounded-xl text-[11px] text-slate-700 font-medium flex items-center justify-between">
              <span>折算请假误工机会成本：</span>
              <span className="font-bold text-rose-600">高至 ¥{timeAndEffort.clientLostWageSelf.toLocaleString()} 元</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            司法程序客观流转时间线（日历流逝 ≠ 个人持续消耗）
          </span>
          <span className="text-xs text-slate-400">95% 时间由法院与法官推进</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {timeAndEffort.timelineStages.map((stage, idx) => (
            <div key={stage.name} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  ~{stage.durationDays} 天
                </span>
              </div>
              <div className="font-bold text-xs text-slate-800">{stage.name}</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{stage.description}</p>
              <div className="text-[10px] bg-white p-2 rounded-lg border border-slate-100 text-slate-600">
                <span className="font-semibold text-blue-700">法院动作: </span>
                {stage.courtAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
