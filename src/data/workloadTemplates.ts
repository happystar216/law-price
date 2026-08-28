import type { LawyerWorkloadBreakdown } from '../types';

export function getLawyerWorkloadTemplate(claimAmount: number): LawyerWorkloadBreakdown {
  const scale = claimAmount > 1000000 ? 1.3 : claimAmount > 300000 ? 1.1 : 1.0;
  const roundH = (h: number) => Math.round(h * scale * 10) / 10;

  const stages = [
    {
      stageId: 'pre_trial',
      stageTitle: '阶段一：诉前深度研判与方案制定',
      stageHours: roundH(10),
      items: [
        {
          id: 'w1',
          title: '原始证据深度梳理与证据链闭环构建',
          hours: roundH(3.5),
          description: '逐页审查合同、微信记录、银行流水、录音等，挑出反噬证据，形成完整的《证据清单与证明目的表》。',
          stageName: '诉前研判',
        },
        {
          id: 'w2',
          title: '管辖法院筛选与管辖利益最大化论证',
          hours: roundH(2),
          description: '分析被告住所地、合同履行地或侵权行为地法院，评估各地法官裁判尺度，规避地方保护。',
          stageName: '诉前研判',
        },
        {
          id: 'w3',
          title: '同类裁判文书检索与胜诉倾向分析',
          hours: roundH(2.5),
          description: '检索最高法及管辖地近3年同类生效判例 5~10 篇，提炼本案法官最关注的争议焦点与裁量标准。',
          stageName: '诉前研判',
        },
        {
          id: 'w4',
          title: '诉讼请求精准量化与利息/违约金精算',
          hours: roundH(2),
          description: '依法核算本金、LPR法定利息、违约金上限、保全费等明细，避免因计算错误多交诉讼费或少主张权益。',
          stageName: '诉前研判',
        },
      ],
    },
    {
      stageId: 'filing_preservation',
      stageTitle: '阶段二：文书起草、保全控财与立案',
      stageHours: roundH(8),
      items: [
        {
          id: 'w5',
          title: '起草标准化民事起诉状及诉讼保全申请书',
          hours: roundH(3),
          description: '紧扣法条与判例撰写起诉状，事实与理由逻辑严密，起草财产保全申请书及紧急情况说明。',
          stageName: '立案保全',
        },
        {
          id: 'w6',
          title: '财产保全对接（保函购买与法院查封协调）',
          hours: roundH(2.5),
          description: '对接保险公司出具诉讼保全责任保函，跟进立案庭与保全执行法官，第一时间查封对方账户/房产防转移。',
          stageName: '立案保全',
        },
        {
          id: 'w7',
          title: '法院立案系统网上申报与补正跟进',
          hours: roundH(2.5),
          description: '提交人民法院网上立案系统，应对法官形式审核补正要求，催促进度直到正式下达受理通知书。',
          stageName: '立案保全',
        },
      ],
    },
    {
      stageId: 'court_hearing',
      stageTitle: '阶段三：庭前攻防对抗、质证与出庭应战',
      stageHours: roundH(13),
      items: [
        {
          id: 'w8',
          title: '研究被告答辩意见与反驳证据材料',
          hours: roundH(3),
          description: '深度剖析对方可能提出的时效抗辩、管辖异议、免责事由，制定专项反驳策略。',
          stageName: '庭审质证',
        },
        {
          id: 'w9',
          title: '撰写庭前《质证意见书》与庭审问答预演',
          hours: roundH(3.5),
          description: '针对对方每份证据从“真实性、合法性、关联性”逐一击破，为当事人做庭前辅导及发问预演。',
          stageName: '庭审质证',
        },
        {
          id: 'w10',
          title: '正式出庭参加法庭调查与法庭辩论',
          hours: roundH(4),
          description: '律师现场出庭应诉（或线上庭审），现场抗辩、捕捉对方漏洞、有理有据回答法官发问。',
          stageName: '庭审质证',
        },
        {
          id: 'w11',
          title: '庭后提交《书面代理词》与调解撮合',
          hours: roundH(2.5),
          description: '根据庭审法官关注点连夜完善代理词提交合议庭；若对方有调解意愿，代表当事人争取最有利和解条款。',
          stageName: '庭审质证',
        },
      ],
    },
    {
      stageId: 'post_trial',
      stageTitle: '阶段四：判决生效解读、执行立案与回款辅导',
      stageHours: roundH(5),
      items: [
        {
          id: 'w12',
          title: '判决书裁判逻辑解读与上诉/答辩风险研判',
          hours: roundH(2),
          description: '收到判决后逐条分析裁判结果，评估上诉胜算或起草二审答辩状。',
          stageName: '执行回款',
        },
        {
          id: 'w13',
          title: '申请强制执行立案材料准备与网络总对总查控',
          hours: roundH(3),
          description: '判决生效后及时起草执行申请书，指导当事人对接法院执行局，申请限制高消费、纳入失信名单及财产拍卖。',
          stageName: '执行回款',
        },
      ],
    },
  ];

  const totalHours = stages.reduce((sum, stage) => sum + stage.stageHours, 0);

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    stages,
  };
}
