import React, { useState } from 'react';
import type { FullCaseAnalysis } from '../types';
import { CASE_CATEGORIES } from '../data/caseTypes';
import { REGIONS } from '../data/regions';
import {
  X,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Lock,
  Send,
  Plane,
} from 'lucide-react';

interface MatchLawyerModalProps {
  analysis: FullCaseAnalysis;
  onClose: () => void;
}

export const MatchLawyerModal: React.FC<MatchLawyerModalProps> = ({ analysis, onClose }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isWeChatSame, setIsWeChatSame] = useState(true);
  const [selectedTag, setSelectedTag] = useState('想尽快立案保全查封财产');
  const [submitted, setSubmitted] = useState(false);

  const category = CASE_CATEGORIES.find((c) => c.id === analysis.input.category) || CASE_CATEGORIES[0];
  const region = REGIONS.find((r) => r.id === analysis.input.regionId) || REGIONS[0];
  const isCrossRegion = analysis.financial.isCrossRegion;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) {
      alert('请填写正确的11位手机号码，方便律师与您取得联系');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col animate-in slide-in-from-bottom-8 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-300">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                为您匹配【{region.name}】当地专业律师
              </h3>
              <p className="text-[11px] text-blue-200/80">
                {isCrossRegion
                  ? '直连起诉地同城律所 · 0差旅费 · 当地法院办案人脉更通畅'
                  : '根据您的案情与预算，精准对接 1~2 位擅长此类案件的资深律师'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {submitted ? (
            /* Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">需求已成功提交！</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  系统已为您对接 <strong>{region.name}起诉地</strong> 擅长 <strong>【{category.name}】</strong> 的本地执业律师。
                  {isCrossRegion && '（已享受平台直配 0 差旅费保障）'}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex items-center justify-between text-slate-500">
                  <span>联系电话：</span>
                  <span className="font-bold text-slate-800">{phone}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>响应时效：</span>
                  <span className="font-bold text-blue-600">预计 15 分钟内电话/微信联系</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>服务承诺：</span>
                  <span className="text-emerald-700 font-medium">免费初审案情 · 0差旅费 · 绝无骚扰</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all cursor-pointer"
              >
                我知道了
              </button>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 异地诉讼 0 差旅费特权横幅 */}
              {isCrossRegion && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center space-x-2">
                    <Plane className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">异地起诉专享：平台直连当地律师</span>
                      <p className="text-[11px] text-emerald-700">
                        免去跨省请律师往返高铁机票与出差补贴（立省约 ¥{analysis.financial.travelCostSaved.toLocaleString()} 元）
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold shrink-0">
                    差旅 ¥0
                  </span>
                </div>
              )}

              {/* Current Case Snapshot */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 text-xs space-y-1.5">
                <div className="font-bold text-blue-900 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>您测算的案情档案（已自动同步给当地律师）：</span>
                  </span>
                  <span className="text-[10px] bg-blue-200/60 text-blue-800 px-1.5 py-0.2 rounded font-medium">
                    {region.shortName}起诉地
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 pt-0.5">
                  <div>· 案件纠纷：<strong>{category.name}</strong></div>
                  <div>· 涉及金额：<strong>¥{analysis.input.claimAmount.toLocaleString()} 元</strong></div>
                  <div>· 律师梯队：<strong>{analysis.input.lawyerTier === 'economic' ? '⚡ 经济实惠型' : analysis.input.lawyerTier === 'elite' ? '👑 红圈大所合伙人' : '⭐ 资深专案型'}</strong></div>
                  <div>· 预估律师费：<strong>¥{analysis.financial.lawyerFeeMin.toLocaleString()} ~ {analysis.financial.lawyerFeeMax.toLocaleString()}</strong></div>
                </div>
              </div>

              {/* Form Input: Phone Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  您的手机号码 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-bold">
                    +86
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入11位手机号码，用于接收律师方案"
                    className="w-full pl-12 pr-3 py-2.5 text-xs sm:text-sm font-bold bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Form Input: Name & WeChat */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">您的称呼 (选填)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如：张先生 / 李女士"
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center space-x-2 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isWeChatSame}
                      onChange={(e) => setIsWeChatSame(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-medium">微信同手机号</span>
                  </label>
                </div>
              </div>

              {/* Quick Intention Tags */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">您最关心的诉求：</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '想尽快立案保全查封财产',
                    '想要当地律师直办省差旅',
                    '想先发律师函协商催收',
                    '想了解能否纯风险代理',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`p-2 rounded-xl text-left text-[11px] font-medium border transition-all cursor-pointer ${
                        selectedTag === tag
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>立即免费匹配【{region.name}】专业律师 · 享 0 差旅特权</span>
              </button>

              {/* Privacy and Trust Badge */}
              <div className="flex items-center justify-center space-x-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>隐私严格加密保护</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>执业律师实名认证</span>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
