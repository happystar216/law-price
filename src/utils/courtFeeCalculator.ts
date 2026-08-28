import type { CaseCategory } from '../types';

/**
 * 依据《诉讼费用交纳办法》第十三条计算民事诉讼受理费（财产案件）
 */
export function calculateCivilCourtFee(amount: number): number {
  if (amount <= 0) return 50;
  if (amount <= 10000) return 50;

  let fee = 50;

  if (amount > 10000) {
    const tier1 = Math.min(amount, 100000) - 10000;
    fee += tier1 * 0.025;
  }
  if (amount > 100000) {
    const tier2 = Math.min(amount, 200000) - 100000;
    fee += tier2 * 0.02;
  }
  if (amount > 200000) {
    const tier3 = Math.min(amount, 500000) - 200000;
    fee += tier3 * 0.015;
  }
  if (amount > 500000) {
    const tier4 = Math.min(amount, 1000000) - 500000;
    fee += tier4 * 0.01;
  }
  if (amount > 1000000) {
    const tier5 = Math.min(amount, 2000000) - 1000000;
    fee += tier5 * 0.009;
  }
  if (amount > 2000000) {
    const tier6 = Math.min(amount, 5000000) - 2000000;
    fee += tier6 * 0.008;
  }
  if (amount > 5000000) {
    const tier7 = Math.min(amount, 10000000) - 5000000;
    fee += tier7 * 0.007;
  }
  if (amount > 10000000) {
    const tier8 = Math.min(amount, 20000000) - 10000000;
    fee += tier8 * 0.006;
  }
  if (amount > 20000000) {
    const tier9 = amount - 20000000;
    fee += tier9 * 0.005;
  }

  return Math.round(fee);
}

/**
 * 依据《诉讼费用交纳办法》第十四条计算财产保全费
 * 最高封顶 5000 元
 */
export function calculatePreservationFee(amount: number): number {
  if (amount <= 0) return 0;
  if (amount <= 1000) return 30;

  let fee = 30;
  if (amount > 1000) {
    const tier1 = Math.min(amount, 100000) - 1000;
    fee += tier1 * 0.01;
  }
  if (amount > 100000) {
    const tier2 = amount - 100000;
    fee += tier2 * 0.005;
  }

  return Math.min(Math.round(fee), 5000);
}

/**
 * 依据《诉讼费用交纳办法》第十四条计算申请强制执行费
 * 执行费由被执行人承担，在执行款项中直接扣付
 */
export function calculateExecutionFee(amount: number): number {
  if (amount <= 0) return 50;
  if (amount <= 10000) return 50;

  let fee = 50;
  if (amount > 10000) {
    const t1 = Math.min(amount, 500000) - 10000;
    fee += t1 * 0.015;
  }
  if (amount > 500000) {
    const t2 = Math.min(amount, 5000000) - 500000;
    fee += t2 * 0.01;
  }
  if (amount > 5000000) {
    const t3 = Math.min(amount, 10000000) - 5000000;
    fee += t3 * 0.005;
  }
  if (amount > 10000000) {
    const t4 = amount - 10000000;
    fee += t4 * 0.001;
  }

  return Math.round(fee);
}

/**
 * 非财产案件标准诉讼费
 */
export function getNonPropertyCourtFee(category: CaseCategory): number {
  switch (category) {
    case 'marriage':
      return 300; // 离婚案件基准300元
    case 'labor':
      return 10;  // 劳动争议一审10元（仲裁免费）
    case 'tort':
      return 300; // 人身/名誉侵权基准
    case 'ip':
      return 500; // 知识产权基准500-1000元
    default:
      return 100;
  }
}
