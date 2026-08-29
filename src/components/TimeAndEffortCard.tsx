import React from 'react';
import type { TimeAndEffortBreakdown } from '../types';
import {
  Clock,
  UserCheck,
  Building,
  Scale,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface TimeAndEffortCardProps {
  timeAndEffort: TimeAndEffortBreakdown;
}

export const TimeAndEffortCard: React.FC<TimeAndEffortCardProps> = ({ timeAndEffort }) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
      {/* 标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">我需要付出多少精力？（工时与出庭明细）</h2>
            <p className="text-xs text-slate-500">
              分清「自然流逝的审限等待周期」与「当事人自己真正消耗的精力、出庭与误工」
            </p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>客观排期周期：{timeAndEffort.calendarMonthsMin} ~ {timeAndEffort.calendarMonthsMax} 个月</span>
        </div>
      </div>

      {/* 3 大核心精力对比：去律所次数、出庭次数、消耗工时 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. 去律所次数 */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <Building className="w-4 h-4 text-blue-600" />
            <span>需要亲自去律所几次？</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {timeAndEffort.lawFirmVisitsWithLawyer} ~ 1 <span className="text-xs font-normal text-slate-500">次</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            支持全程<strong>微信/电子签委托</strong>，材料可拍照扫描或顺丰寄送，通常<strong>无需亲自跑律所</strong>。
          </p>
        </div>

        {/* 2. 亲自出庭次数 */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>需要亲自出庭/跑法院几次？</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tight">
            {timeAndEffort.courtAppearancesWithLawyer === 0 ? '0 次' : '1 次'}
            <span className="text-xs font-normal text-slate-500 ml-1">
              (自己打需 {timeAndEffort.courtAppearancesSelf} 次)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {timeAndEffort.courtAppearancesWithLawyer === 0
              ? '委托律师后，律师享有【特别授权】，全权代为出庭答辩，当事人无需请假出庭！'
              : '除离婚案法官必须核实夫妻感情外，其余日常民商事诉讼当事人无需亲自到场。'}
          </p>
        </div>

        {/* 3. 自身实际消耗工时与误工 */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
          <div className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>自身投入工时与误工折算</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">
            ~ {timeAndEffort.clientHoursWithLawyer} <span className="text-xs font-normal text-emerald-600">小时</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            仅需线上对诉状发材料，折算误工仅约 <strong>¥{timeAndEffort.clientLostWageWithLawyer.toLocaleString()}</strong>（自己打需耗时{timeAndEffort.clientHoursSelf}h，误工损失约¥{timeAndEffort.clientLostWageSelf.toLocaleString()}）。
          </p>
        </div>
      </div>

      {/* 委托律师 vs 自己打官司 真实场景对比表：移动端自适应分块 / 桌面端3列表格 */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
        <div className="hidden sm:grid bg-slate-900 text-white px-4 py-3 font-bold grid-cols-12">
          <div className="sm:col-span-4">维权环节与精力消耗项</div>
          <div className="sm:col-span-4 text-emerald-400">委托律师办理（省心托管）</div>
          <div className="sm:col-span-4 text-slate-300">自己亲自打官司（亲力亲为）</div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* 1. 证据整理与起诉状撰写 */}
          <div className="p-3.5 sm:py-3 sm:px-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-0 sm:items-center hover:bg-slate-50 transition-colors">
            <div className="sm:col-span-4 font-bold text-slate-800 text-xs sm:text-sm">
              1. 证据整理与起诉状撰写
            </div>
            <div className="sm:col-span-4 bg-emerald-50/80 sm:bg-transparent p-2.5 sm:p-0 rounded-xl text-emerald-800 sm:text-emerald-700 flex items-start sm:items-center space-x-1.5 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="sm:hidden font-bold block text-emerald-950 text-[11px]">委托律师办理：</span>
                <span>只需微信发转账记录/合同照片（耗时约30分钟）</span>
              </div>
            </div>
            <div className="sm:col-span-4 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl text-slate-600 flex items-start sm:items-center space-x-1.5 leading-relaxed">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="sm:hidden font-bold block text-slate-800 text-[11px]">自己打官司：</span>
                <span>需自行查法条、排版规范格式（耗时约15小时）</span>
              </div>
            </div>
          </div>

          {/* 2. 法院立案与财产保全冻结 */}
          <div className="p-3.5 sm:py-3 sm:px-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-0 sm:items-center hover:bg-slate-50 transition-colors">
            <div className="sm:col-span-4 font-bold text-slate-800 text-xs sm:text-sm">
              2. 法院立案与财产保全冻结
            </div>
            <div className="sm:col-span-4 bg-emerald-50/80 sm:bg-transparent p-2.5 sm:p-0 rounded-xl text-emerald-800 sm:text-emerald-700 flex items-start sm:items-center space-x-1.5 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="sm:hidden font-bold block text-emerald-950 text-[11px]">委托律师办理：</span>
                <span>律师线上绿色通道一键代办，跟进财产冻结</span>
              </div>
            </div>
            <div className="sm:col-span-4 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl text-slate-600 flex items-start sm:items-center space-x-1.5 leading-relaxed">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="sm:hidden font-bold block text-slate-800 text-[11px]">自己打官司：</span>
                <span>工作日请假去立案庭排队，格式不对多次跑腿补正</span>
              </div>
            </div>
          </div>

          {/* 3. 开庭答辩与法庭辩论 */}
          <div className="p-3.5 sm:py-3 sm:px-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-0 sm:items-center hover:bg-slate-50 transition-colors">
            <div className="sm:col-span-4 font-bold text-slate-800 text-xs sm:text-sm">
              3. 开庭答辩与法庭辩论
            </div>
            <div className="sm:col-span-4 bg-emerald-50/80 sm:bg-transparent p-2.5 sm:p-0 rounded-xl text-emerald-800 sm:text-emerald-700 flex items-start sm:items-center space-x-1.5 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="sm:hidden font-bold block text-emerald-950 text-[11px]">委托律师办理：</span>
                <span>律师全权出庭辩论质证，当事人 0 次到庭正常上班</span>
              </div>
            </div>
            <div className="sm:col-span-4 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl text-slate-600 flex items-start sm:items-center space-x-1.5 leading-relaxed">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="sm:hidden font-bold block text-slate-800 text-[11px]">自己打官司：</span>
                <span>必须请假亲自出庭，面对法官质询和对方抗辩易紧张</span>
              </div>
            </div>
          </div>

          {/* 4. 判决执行与催款跟进 */}
          <div className="p-3.5 sm:py-3 sm:px-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-0 sm:items-center hover:bg-slate-50 transition-colors">
            <div className="sm:col-span-4 font-bold text-slate-800 text-xs sm:text-sm">
              4. 判决执行与催款跟进
            </div>
            <div className="sm:col-span-4 bg-emerald-50/80 sm:bg-transparent p-2.5 sm:p-0 rounded-xl text-emerald-800 sm:text-emerald-700 flex items-start sm:items-center space-x-1.5 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="sm:hidden font-bold block text-emerald-950 text-[11px]">委托律师办理：</span>
                <span>律师对接执行法官，敦促全国网络总对总划扣银行卡</span>
              </div>
            </div>
            <div className="sm:col-span-4 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl text-slate-600 flex items-start sm:items-center space-x-1.5 leading-relaxed">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="sm:hidden font-bold block text-slate-800 text-[11px]">自己打官司：</span>
                <span>自己跑执行局立案，不知如何查控对方隐匿资产</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 时间轴客观排期科普 */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
        <div className="font-bold text-slate-800 flex items-center space-x-1.5">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          <span>客观等待时间轴（这是法院在走流程，无需每日奔波）：</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {timeAndEffort.timelineStages.map((stage, idx) => (
            <div key={stage.name} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="text-[10px] text-blue-600 font-bold">阶段 {idx + 1}（约{stage.durationDays}天）</div>
              <div className="font-bold text-slate-900 text-xs truncate">{stage.name}</div>
              <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{stage.courtAction}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
