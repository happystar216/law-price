import type { RegionConfig } from '../types';

// 标准省级行政区统一定价配置（按一类/二类/三类地区经济水平梯度配置）
const TIER_1 = {
  minCaseFee: 5000,
  tiers: [
    { min: 0, max: 100000, rate: 0.085 },
    { min: 100000, max: 500000, rate: 0.068 },
    { min: 500000, max: 1000000, rate: 0.055 },
    { min: 1000000, max: 5000000, rate: 0.042 },
    { min: 5000000, max: 10000000, rate: 0.028 },
    { min: 10000000, max: 50000000, rate: 0.018 },
    { min: 50000000, max: Infinity, rate: 0.009 },
  ],
  hourlyRateRange: [800, 4500] as [number, number],
  riskFeeCap: 0.30,
};

const TIER_2 = {
  minCaseFee: 3500,
  tiers: [
    { min: 0, max: 100000, rate: 0.075 },
    { min: 100000, max: 500000, rate: 0.06 },
    { min: 500000, max: 1000000, rate: 0.048 },
    { min: 1000000, max: 5000000, rate: 0.038 },
    { min: 5000000, max: 10000000, rate: 0.024 },
    { min: 10000000, max: 50000000, rate: 0.014 },
    { min: 50000000, max: Infinity, rate: 0.007 },
  ],
  hourlyRateRange: [600, 3000] as [number, number],
  riskFeeCap: 0.30,
};

const TIER_3 = {
  minCaseFee: 2800,
  tiers: [
    { min: 0, max: 100000, rate: 0.065 },
    { min: 100000, max: 500000, rate: 0.05 },
    { min: 500000, max: 1000000, rate: 0.04 },
    { min: 1000000, max: 5000000, rate: 0.03 },
    { min: 5000000, max: 10000000, rate: 0.018 },
    { min: 10000000, max: 50000000, rate: 0.01 },
    { min: 50000000, max: Infinity, rate: 0.005 },
  ],
  hourlyRateRange: [400, 2200] as [number, number],
  riskFeeCap: 0.30,
};

export const REGIONS: RegionConfig[] = [
  // 直辖市
  { id: 'bj', name: '北京市', shortName: '北京', ...TIER_1, minCaseFee: 6000 },
  { id: 'sh', name: '上海市', shortName: '上海', ...TIER_1, minCaseFee: 5000 },
  { id: 'tj', name: '天津市', shortName: '天津', ...TIER_2 },
  { id: 'cq', name: '重庆市', shortName: '重庆', ...TIER_2 },

  // 华东地区
  { id: 'gd', name: '广东省', shortName: '广东', ...TIER_1, minCaseFee: 4500 },
  { id: 'zj', name: '浙江省', shortName: '浙江', ...TIER_1, minCaseFee: 4000 },
  { id: 'js', name: '江苏省', shortName: '江苏', ...TIER_1, minCaseFee: 4000 },
  { id: 'sd', name: '山东省', shortName: '山东', ...TIER_2 },
  { id: 'fj', name: '福建省', shortName: '福建', ...TIER_2 },
  { id: 'ah', name: '安徽省', shortName: '安徽', ...TIER_3 },
  { id: 'jx', name: '江西省', shortName: '江西', ...TIER_3 },

  // 华北及东北地区
  { id: 'hb', name: '河北省', shortName: '河北', ...TIER_3 },
  { id: 'sx', name: '山西省', shortName: '山西', ...TIER_3 },
  { id: 'nmg', name: '内蒙古自治区', shortName: '内蒙古', ...TIER_3 },
  { id: 'ln', name: '辽宁省', shortName: '辽宁', ...TIER_3 },
  { id: 'jl', name: '吉林省', shortName: '吉林', ...TIER_3 },
  { id: 'hlj', name: '黑龙江省', shortName: '黑龙江', ...TIER_3 },

  // 华中地区
  { id: 'henan', name: '河南省', shortName: '河南', ...TIER_3 },
  { id: 'hubei', name: '湖北省', shortName: '湖北', ...TIER_2 },
  { id: 'hunan', name: '湖南省', shortName: '湖南', ...TIER_2 },

  // 华南及西南地区
  { id: 'gx', name: '广西壮族自治区', shortName: '广西', ...TIER_3 },
  { id: 'hainan', name: '海南省', shortName: '海南', ...TIER_2 },
  { id: 'sc', name: '四川省', shortName: '四川', ...TIER_2, minCaseFee: 3000 },
  { id: 'gz', name: '贵州省', shortName: '贵州', ...TIER_3 },
  { id: 'yn', name: '云南省', shortName: '云南', ...TIER_3 },
  { id: 'xz', name: '西藏自治区', shortName: '西藏', ...TIER_3 },

  // 西北地区
  { id: 'shaanxi', name: '陕西省', shortName: '陕西', ...TIER_2 },
  { id: 'gs', name: '甘肃省', shortName: '甘肃', ...TIER_3 },
  { id: 'qh', name: '青海省', shortName: '青海', ...TIER_3 },
  { id: 'nx', name: '宁夏回族自治区', shortName: '宁夏', ...TIER_3 },
  { id: 'xj', name: '新疆维吾尔自治区', shortName: '新疆', ...TIER_3 },
];
