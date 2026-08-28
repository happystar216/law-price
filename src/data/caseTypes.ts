import type { CaseCategory } from '../types';

export interface CaseCategoryMeta {
  id: CaseCategory;
  name: string;
  shortDesc: string;
  defaultProperty: boolean;
  typicalMinAmount: number;
  statutoryFeeTransfer: boolean;
  statutoryTransferReason?: string;
  evidenceTips: string[];
}

export const CASE_CATEGORIES: CaseCategoryMeta[] = [
  {
    id: 'debt',
    name: '民间借贷 / 借款欠款',
    shortDesc: '个人借款、欠条逾期、高利息争议等',
    defaultProperty: true,
    typicalMinAmount: 50000,
    statutoryFeeTransfer: false,
    statutoryTransferReason: '民间借贷通常若借条/合同中明确约定“借款人违约需承担出借人维权律师费”，法院100%予以支持。',
    evidenceTips: ['借条/借款合同原件', '银行转账流水凭证', '催款聊天记录/录音', '利息支付记录'],
  },
  {
    id: 'contract',
    name: '买卖 / 合同违约索赔',
    shortDesc: '货款拖欠、买卖违约、服务合同违约等',
    defaultProperty: true,
    typicalMinAmount: 100000,
    statutoryFeeTransfer: false,
    statutoryTransferReason: '依据《民法典》违约损失赔偿原则，若合同明确约定了“守约方维权合理的律师费由违约方承担”，法院基本全额支持。',
    evidenceTips: ['书面合同与补充协议', '发货单/收货对账单/验收单', '发票及付款凭证', '违约通知与催收函件'],
  },
  {
    id: 'labor',
    name: '劳动争议 / 辞退赔偿',
    shortDesc: '违法辞退2N赔偿、未签合同双倍工资、加班费拖欠',
    defaultProperty: true,
    typicalMinAmount: 30000,
    statutoryFeeTransfer: true,
    statutoryTransferReason: '在深圳等部分特定先行示范区，劳动者胜诉可依法申请用人单位承担最高不超过5000元的律师代理费；其他地区通常按劳动仲裁调解处理。',
    evidenceTips: ['劳动合同/离职证明', '工资条与银行代发流水', '考勤打卡记录', '辞退通知书/微信沟通记录'],
  },
  {
    id: 'marriage',
    name: '婚姻家事 / 财产分割 / 继承',
    shortDesc: '离婚析产、抚养权、遗产继承分配纠纷',
    defaultProperty: true,
    typicalMinAmount: 500000,
    statutoryFeeTransfer: false,
    statutoryTransferReason: '家事纠纷一般各自承担律师费，但涉及隐匿、转移夫妻共同财产的，可依法请求少分或不分。',
    evidenceTips: ['结婚证/户口簿/亲属证明', '不动产权证/房产查册', '银行账户资产流水', '共同债务及投资证明'],
  },
  {
    id: 'tort',
    name: '侵权纠纷 / 交通事故 / 人身损害',
    shortDesc: '交通事故赔偿、人身损害赔偿、名誉侵权',
    defaultProperty: true,
    typicalMinAmount: 80000,
    statutoryFeeTransfer: true,
    statutoryTransferReason: '交通事故及人身侵权纠纷中，部分地区司法实践支持受害人将合理的律师费作为直接维权损失由侵权人赔偿。',
    evidenceTips: ['交警事故责任认定书', '医院门诊/住院病历及费用发票', '伤残鉴定意见书', '误工证明与收入凭证'],
  },
  {
    id: 'ip',
    name: '知识产权 / 商标专利著作权侵权',
    shortDesc: '字体/图片侵权、商标抢注侵权、软件著作权',
    defaultProperty: true,
    typicalMinAmount: 60000,
    statutoryFeeTransfer: true,
    statutoryTransferReason: '《著作权法》《商标法》《专利法》均明确规定：侵权赔偿数额应当包括权利人为制止侵权行为所支付的合理开支（包含合理律师费）。',
    evidenceTips: ['权属证书（软著/商标证等）', '公证处侵权取证保全书', '侵权链接及销售流水截图', '律师费及维权开支发票'],
  },
  {
    id: 'real_estate',
    name: '房屋买卖 / 租赁纠纷 / 物业纠纷',
    shortDesc: '房东不退押金、违约退房、逾期交房办证',
    defaultProperty: true,
    typicalMinAmount: 120000,
    statutoryFeeTransfer: false,
    statutoryTransferReason: '中介三方合同或租赁合同通常均载有“违约方承担守约方律师费”之约定条款。',
    evidenceTips: ['房屋买卖/租赁合同原件', '押金及租金收据/转账记录', '交接清单与现场视频照片', '催告退款记录'],
  },
  {
    id: 'company',
    name: '公司股权 / 商事纠纷 / 股东权益',
    shortDesc: '股东知情权、股权转让、代持纠纷、破产清算',
    defaultProperty: true,
    typicalMinAmount: 1000000,
    statutoryFeeTransfer: false,
    statutoryTransferReason: '股东代表诉讼中，胜诉股东请求公司补偿合理的律师费等诉讼费用的，人民法院依法予以支持。',
    evidenceTips: ['公司章程与股东会决议', '股权转让协议及打款证明', '工商调档档案', '财务审计报告'],
  },
  {
    id: 'other',
    name: '其他民商事争议',
    shortDesc: '一般财产或权利纠纷',
    defaultProperty: true,
    typicalMinAmount: 50000,
    statutoryFeeTransfer: false,
    evidenceTips: ['身份证明材料', '事实依据直接书证', '经济往来账目记录'],
  },
];
