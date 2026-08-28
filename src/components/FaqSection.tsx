import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: '1. 诉讼费和保全费最后真的能让对方全额承担吗？',
    a: '是的！依据《诉讼费用交纳办法》第二十九条规定：“诉讼费用由败诉方负担，胜诉方自愿承担的除外。部分胜诉、部分败诉的，人民法院根据案件的具体情况决定各方当事人负担的诉讼费用数额。”因此，只要判决全部胜诉，您前期向法院预交的案件受理费与财产保全费，法院将在生效判决中责令被告支付返还。',
  },
  {
    q: '2. 律师费在什么情况下可以依法要求对方赔偿？',
    a: '在我国民事诉讼中，律师费原则上“各自承担”，但以下情况法院通常支持由败诉方全额或合理承担：① 合同有明确约定（如借条、购销合同写明“违约方承担守约方维权律师费”）；② 知识产权侵权纠纷（著作权、商标、专利法均规定赔偿包含维权合理开支）；③ 交通事故与人身侵权纠纷（部分省市支持作为侵权直接损失）；④ 恶意诉讼或滥用诉讼权利的侵权赔偿；⑤ 债权人撤销权诉讼与股东代表诉讼等法定情形。',
  },
  {
    q: '3. 为什么系统要特别强调“自然流逝周期”和“个人投入时间”不是一回事？',
    a: '很多当事人误以为“打官司要6个月”意味着自己要被官司折磨6个月。实际上，6个月是法院排期、文书送达、等待合议庭审理的客观日历时间。如果您委托了专业律师，您实际只需在诉前配合提供材料、线上签字，总耗时仅约 3~5 小时，其余 95% 的时间您可以安心正常工作生活，无需频繁跑法院。',
  },
  {
    q: '4. 什么是“风险代理”？适合什么样的案件？',
    a: '风险代理是指律师在前期不收取或仅收取少额基础费用，等案件胜诉并实际回款到账后，按回款金额的一定比例（如 15%~25%）提取律师费。司法部规定风险代理最高不得超过争议金额的 30%。特别适合标的额较大、对方有财产但当事人前期资金紧张的借贷、货款催收类案件。需要注意：婚姻家事纠纷、劳动争议、刑事案件依法禁止纯风险代理。',
  },
  {
    q: '5. 打赢了官司对方没钱（执行不能）怎么办？',
    a: '“胜诉”只代表法院确认了您的合法权利，但“回款”取决于对方名下是否有财产。为了防范“赢了官司拿不到钱”的风险，最重要的法律手段是【诉前/诉中财产保全】——在立案的第一时间申请法院冻结对方的银行账户、微信支付宝、查封名下房产或车辆，让对方无法转移隐匿财产。',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div id="faq-section" className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">诉讼维权高频核心问答 (FAQ)</h2>
          <p className="text-xs text-slate-500">帮您看清诉讼中的法律常识与避坑指南</p>
        </div>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 bg-slate-50/70 hover:bg-slate-100/70 text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="font-bold text-xs sm:text-sm text-slate-800 pr-3">{faq.q}</span>
                <span className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
