import type {
  CaseCategory,
  EvidenceLevel,
  LawyerWorkloadBreakdown,
  LitigationStage,
  WorkloadStage,
} from '../types';

export function getLawyerWorkloadTemplate(
  claimAmount: number,
  category: CaseCategory = 'debt',
  stage: LitigationStage = 'first_instance_summary',
  evidenceLevel: EvidenceLevel = 'strong'
): LawyerWorkloadBreakdown {
  // 标的规模调节系数
  const scale =
    claimAmount > 5000000
      ? 1.45
      : claimAmount > 1000000
      ? 1.25
      : claimAmount > 300000
      ? 1.1
      : claimAmount > 50000
      ? 1.0
      : 0.85;

  // 证据弱时需增加调查取证工时
  const evidenceMultiplier = evidenceLevel === 'weak' ? 1.3 : evidenceLevel === 'medium' ? 1.1 : 1.0;
  const roundH = (h: number) => Math.round(h * scale * evidenceMultiplier * 10) / 10;

  let stages: WorkloadStage[] = [];

  if (stage === 'execution') {
    // 强制执行专项交付工时
    stages = [
      {
        stageId: 'exec_prep',
        stageTitle: '阶段一：生效判决核验与执行立案申报',
        stageHours: roundH(6),
        items: [
          {
            id: 'e1',
            title: '起草《强制执行申请书》与加倍支付迟延履行利息精算',
            hours: roundH(2.5),
            description: '依法精确核算判决本金、逾期利息及法定的日万分之一点七五迟延履行利息。',
            stageName: '执行立案',
          },
          {
            id: 'e2',
            title: '法院执行局立案对接与执行案号催办下发',
            hours: roundH(1.5),
            description: '提交全国法院执行案件流程信息管理系统，应对执行员立案审查与案卷流转。',
            stageName: '执行立案',
          },
          {
            id: 'e3',
            title: '被执行人财产线索梳理与调查令申请',
            hours: roundH(2),
            description: '整理对方开户行、车辆车牌、不动产线索，向执行法官申请律师调查令。',
            stageName: '执行立案',
          },
        ],
      },
      {
        stageId: 'exec_search',
        stageTitle: '阶段二：法院“总对总”网络查控与多维财产冻结',
        stageHours: roundH(8),
        items: [
          {
            id: 'e4',
            title: '敦促执行法官启动全国网络总对总查控系统',
            hours: roundH(2.5),
            description: '跟进全国各大商业银行、微信支付、支付宝、证券理财资金的秒级线上冻结。',
            stageName: '财产查控',
          },
          {
            id: 'e5',
            title: '线下不动产登记中心与车管所查封接洽',
            hours: roundH(3),
            description: '协助执行法官向不动产登记局下达协助执行通知书，查封名下房产并轮候查封。',
            stageName: '财产查控',
          },
          {
            id: 'e6',
            title: '被执行人隐匿/转移财产痕迹倒查',
            hours: roundH(2.5),
            description: '调取被执行人近一年大额银行流水，排查是否存在恶意无偿转让财产或假离婚转移迹象。',
            stageName: '财产查控',
          },
        ],
      },
      {
        stageId: 'exec_pressure',
        stageTitle: '阶段三：惩戒施压（限制高消费、纳入失信名单与司法拘留）',
        stageHours: roundH(7),
        items: [
          {
            id: 'e7',
            title: '申请限制高消费令（限高）与限制出境',
            hours: roundH(2),
            description: '依法限制被执行人坐高铁飞机、住星级酒店、子女就读高收费私立学校。',
            stageName: '执行施压',
          },
          {
            id: 'e8',
            title: '申请纳入最高人民法院失信被执行人黑名单（老赖名单）',
            hours: roundH(2),
            description: '向央行征信系统推送失信记录，限制其招投标、政府采购、银行贷款与企业任职。',
            stageName: '执行施压',
          },
          {
            id: 'e9',
            title: '执行谈话与和解方案拟定谈判',
            hours: roundH(3),
            description: '陪同执行法官约谈被执行人，施加司法拘留或拒执罪刑事自诉威慑，逼其还款。',
            stageName: '执行施压',
          },
        ],
      },
      {
        stageId: 'exec_recovery',
        stageTitle: '阶段四：查封资产司法拍卖与执行回款到账划扣',
        stageHours: roundH(5),
        items: [
          {
            id: 'e10',
            title: '司法网络拍卖评估对接（阿里/京东司法拍卖）',
            hours: roundH(2.5),
            description: '跟进查封房产或车辆的第三方评估作价、定向网络拍卖排期与流拍变卖程序。',
            stageName: '资产变现',
          },
          {
            id: 'e11',
            title: '法院执行款专用账户发还划扣与结案归档',
            hours: roundH(2.5),
            description: '办理执行款发还手续，款项直接安全打入当事人银行卡，核销结案。',
            stageName: '资产变现',
          },
        ],
      },
    ];
  } else if (stage === 'second_instance') {
    // 二审上诉专项交付工时
    stages = [
      {
        stageId: 'appeal_prep',
        stageTitle: '阶段一：一审判决透视与上诉状深度论证',
        stageHours: roundH(8),
        items: [
          {
            id: 'a1',
            title: '一审判决书裁判漏洞、事实认定错误与法律适用偏差诊断',
            hours: roundH(3.5),
            description: '逐字逐句复盘一审庭审笔录，找出法官在事实认定、举证责任分配或法条适用上的核心瑕疵。',
            stageName: '上诉论证',
          },
          {
            id: 'a2',
            title: '起草《民事上诉状》并在15天法定期限内向上级中院申报',
            hours: roundH(2.5),
            description: '紧扣改判请求撰写严密上诉状，精准锚定中级法院二审审查范围与改判要点。',
            stageName: '上诉论证',
          },
          {
            id: 'a3',
            title: '新证据（二审新发现材料）公证固化与补充提交',
            hours: roundH(2),
            description: '针对一审未被采信的关键事实，调取补充新证据并出具《二审新证据举证说明》。',
            stageName: '上诉论证',
          },
        ],
      },
      {
        stageId: 'appeal_hearing',
        stageTitle: '阶段二：中级法院二审开庭审理与法庭辩论应战',
        stageHours: roundH(12),
        items: [
          {
            id: 'a4',
            title: '研究被上诉人答辩状并制定二审当庭突击反驳策略',
            hours: roundH(3),
            description: '预判对方二审辩解理由，撰写针对性反驳提纲与中院主审法官焦点问答清单。',
            stageName: '二审开庭',
          },
          {
            id: 'a5',
            title: '中级人民法院出庭参加二审法庭调查与辩论',
            hours: roundH(4.5),
            description: '律师出庭（或线上二审庭审），围绕原审错误进行法理辩论，主张撤销原判直接改判。',
            stageName: '二审开庭',
          },
          {
            id: 'a6',
            title: '庭后提交《二审补充代理意见》与合议庭沟通报告',
            hours: roundH(2.5),
            description: '根据中院法官庭审关注点，提交权威判例检索报告，力争发回重审或直接改判。',
            stageName: '二审开庭',
          },
          {
            id: 'a7',
            title: '二审法官主持下的调解方案测算与谈判',
            hours: roundH(2),
            description: '若二审法官组织和解，协助当事人争取最优调解赔付方案并签署中院终审调解书。',
            stageName: '二审开庭',
          },
        ],
      },
      {
        stageId: 'appeal_result',
        stageTitle: '阶段三：终审判决生效解读与执行衔接',
        stageHours: roundH(4),
        items: [
          {
            id: 'a8',
            title: '二审终审判决书解读与法律效力确认',
            hours: roundH(1.5),
            description: '向当事人详尽解读终审判决认定，终审判决自送达即发生法律效力。',
            stageName: '终审结案',
          },
          {
            id: 'a9',
            title: '一审法院退还多缴诉讼费及胜诉款催收对接',
            hours: roundH(2.5),
            description: '协助办理诉讼费退费手续，若对方仍未履行，无缝衔接启动一审法院强制执行程序。',
            stageName: '终审结案',
          },
        ],
      },
    ];
  } else {
    // 一审（简易程序 / 普通程序）标准全流程交付工时
    const isNormal = stage === 'first_instance_normal';
    const trialHours = isNormal ? roundH(14) : roundH(10);

    stages = [
      {
        stageId: 'pre_trial',
        stageTitle: '阶段一：诉前深度研判与方案制定',
        stageHours: roundH(10),
        items: [
          {
            id: 'w1',
            title:
              category === 'ip'
                ? '侵权比对深度分析与原创权属链闭环构建'
                : category === 'marriage'
                ? '夫妻共同财产线索全景穿透与争端梳理'
                : '原始证据深度梳理与证据清单闭环构建',
            hours: roundH(3.5),
            description:
              evidenceLevel === 'weak'
                ? '针对现有较弱证据逐一筛查，设计录音取证话术与调查令申请方案，补齐直接证据链。'
                : '逐页审查合同、转账凭证、聊天记录与单据，剔除不利证据，形成法官采信度极高的证据目录。',
            stageName: '诉前研判',
          },
          {
            id: 'w2',
            title: '管辖法院筛选与最优诉讼地点论证',
            hours: roundH(2),
            description: '比对家门口法院与对方所在地法院的裁判尺度与查封便利度，锁定胜诉率最高的法院。',
            stageName: '诉前研判',
          },
          {
            id: 'w3',
            title: '同类裁判文书大数据检索与法官裁量倾向研判',
            hours: roundH(2.5),
            description: '检索管辖法院近3年同类纠纷生效判例，提炼法官最关注的核心审理要点。',
            stageName: '诉前研判',
          },
          {
            id: 'w4',
            title: '诉讼请求精细量化与利息/违约金法定精算',
            hours: roundH(2),
            description: '精准核算本金、LPR法定利息、违约金上限与维权合理开支，避免多交诉讼费或少算损失。',
            stageName: '诉前研判',
          },
        ],
      },
      {
        stageId: 'filing_preservation',
        stageTitle: '阶段二：文书起草、财产保全查封与法院立案',
        stageHours: roundH(8),
        items: [
          {
            id: 'w5',
            title: '起草标准化民事起诉状及诉讼保全申请书',
            hours: roundH(3),
            description: '紧扣民法典法条与证据撰写起诉状，事实逻辑清晰严密，起草财产保全查封申请书。',
            stageName: '立案保全',
          },
          {
            id: 'w6',
            title: '财产保全对接（保函购买与法院冻结协调）',
            hours: roundH(2.5),
            description: '对接保险公司出具低成本保全保函，跟进立案庭极速下发保全裁定，第一时间冻结对方账户。',
            stageName: '立案保全',
          },
          {
            id: 'w7',
            title: '法院立案系统网上申报与补正跟进',
            hours: roundH(2.5),
            description: '通过人民法院在线服务系统提交立案，应对法官形式审核补正，直至正式受理排期。',
            stageName: '立案保全',
          },
        ],
      },
      {
        stageId: 'court_hearing',
        stageTitle: isNormal ? '阶段三：庭前对抗、质证、鉴定对接与正式出庭（普通程序）' : '阶段三：庭前对抗、质证与正式出庭（简易程序）',
        stageHours: trialHours,
        items: [
          {
            id: 'w8',
            title: '深度剖析被告答辩意见与反驳证据挖掘',
            hours: roundH(3),
            description: '针对对方可能提出的诉讼时效抗辩、管辖异议、免责借口，制定逐条反驳方案。',
            stageName: '庭审质证',
          },
          {
            id: 'w9',
            title: '撰写庭前《质证意见书》与庭审问答预演',
            hours: roundH(3.5),
            description: '针对对方每份证据从三性（真实性、合法性、关联性）精准反驳，协助当事人做好预演。',
            stageName: '庭审质证',
          },
          {
            id: 'w10',
            title: '正式出庭参加法庭调查、举证与辩论',
            hours: isNormal ? roundH(5) : roundH(3.5),
            description: '律师全权现场出庭（或在线庭审），有理有据回答法官发问，免去当事人到庭请假奔波。',
            stageName: '庭审质证',
          },
          {
            id: 'w11',
            title: '庭后提交《书面代理词》与调解谈判撮合',
            hours: roundH(2.5),
            description: '根据法官庭审关注焦点连夜撰写补充代理词；若对方提出和解，为当事人争取最大现金赔偿。',
            stageName: '庭审质证',
          },
        ],
      },
      {
        stageId: 'post_trial',
        stageTitle: '阶段四：判决生效解读、退费与执行衔接',
        stageHours: roundH(5),
        items: [
          {
            id: 'w12',
            title: '判决书裁判逻辑逐项解读与上诉风险评估',
            hours: roundH(2),
            description: '收到判决后逐条向当事人分析认定结果，防范对方恶意上诉拖延时间。',
            stageName: '执行衔接',
          },
          {
            id: 'w13',
            title: '判决生效后申请强制执行材料准备与查控对接',
            hours: roundH(3),
            description: '履行期届满对方未支付的，无缝起草执行申请书并对接法院执行局查封其银行卡与房产。',
            stageName: '执行衔接',
          },
        ],
      },
    ];
  }

  const totalHours = stages.reduce((sum, stage) => sum + stage.stageHours, 0);

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    stages,
  };
}
