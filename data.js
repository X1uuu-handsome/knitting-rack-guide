export const dimensions = Object.freeze({
  mainRod: 1050,
  topBars: [1000, 790],
  basket: [300, 300, 150],
  baseFrontBack: 300,
  baseCenter: 300,
  baseSide: 246,
  shaftDiameter: 10,
  ipadTopMax: 635,
  ipadTopCeiling: 640,
  ipadGapMin: 150,
  barGapMin: 200,
  yarnGuides: {
    count: 3, innerDiameter: 90, groupHeightMin: 300,
    groupHeightMax: 350, preferredSameLevel: true,
    maxVerticalOffset: 20, layout: 'three-directions'
  }
});

export const display = Object.freeze({
  mainRod: `${dimensions.mainRod/10}cm`,
  topBars: dimensions.topBars.map(mm=>`${mm/10}cm`),
  basket: `${dimensions.basket[0]/10}×${dimensions.basket[1]/10}×${dimensions.basket[2]/10}cm`,
  guide: `内径${dimensions.yarnGuides.innerDiameter}mm（${dimensions.yarnGuides.innerDiameter/10}cm）`,
  guideGroup: `${dimensions.yarnGuides.groupHeightMin/10}～${dimensions.yarnGuides.groupHeightMax/10}cm`,
  ipadTop: `${dimensions.ipadTopMax/10}cm`,
  ipadCeiling: `${dimensions.ipadTopCeiling/10}cm`,
  barGap: `${dimensions.barGapMin/10}cm`,
  ipadGap: `${dimensions.ipadGapMin/10}cm`
});

export const pendingDetails = {
  padStack: { status: 'pending_real_part', label: '硅胶垫与固定环的最终上下顺序', reason: '取决于篮底网孔与到货夹具的形状。' },
  ipadMount: { status: 'pending_real_part', label: 'iPad 支架的具体连接方式', reason: '需看支架实物夹具，不能预设螺丝位置。' },
  wrenchSize: { status: 'pending_real_part', label: '内六角扳手规格', reason: '按夹具到货螺丝确认。' }
};

export const partGroups = [
  { title: '光轴｜304 不锈钢实心，Φ10mm', items: [
    ['A1','主立杆','1050mm',1],['A2','上横杆','300mm',1],['A3','下横杆','300mm',1],
    ['B1','前横梁','300mm',1],['B2','后横梁','300mm',1],['B3','中央底梁','300mm',1],
    ['B4','左侧梁','246mm',1],['B5','右侧梁','246mm',1]
  ]},
  { title: '底盘连接件', items: [
    ['C','10×10mm 十字夹','轮子4、中央梁2、主杆1、上横杆2',9],
    ['D','10×10mm T型夹','底盘四角',4]
  ]},
  { title: '轮子', items: [
    ['E','带刹车万向轮','约1寸，螺杆 M6×15mm',4],
    ['F','加长圆螺母','M6×Φ10×16mm',4]
  ]},
  { title: '篮子与主杆附件', items: [
    ['O','不锈钢网篮','300×300×150mm',1],
    ['G','内径10mm分离式固定环','篮子/主杆限位',1],
    ['H1','硅胶垫','内径10/外径20/厚10mm',2],
    ['H2','硅胶垫','内径10/外径20/厚3mm',1],
    ['N','10mm光轴端帽','检查所有外露末端', '5～6']
  ]},
  { title: '导线环', items: [
    ['I','独立导线环',`${display.guide}，${dimensions.yarnGuides.count}个组成同高分向环组`,dimensions.yarnGuides.count]
  ]},
  { title: '平板', items: [
    ['J','iPad 平板支架','短臂，具体连接待实物确认',1]
  ]},
  { title: '笔筒', items: [
    ['K','金属网格笔筒','普通网格款',1],
    ['L','黑色尼龙扎带','笔筒至少2根，备数根','若干'],
    ['M','自粘硅胶防滑条','笔筒接触面用','1段']
  ]},
  { title: '工具', items: [
    ['T1','卷尺或直尺','测量高度与净距离',1],
    ['T2','内六角扳手','具体规格待夹具实物确认',1],
    ['T3','剪钳或剪刀','裁去扎带多余尾部',1]
  ]}
].map(group => ({...group, items: group.items.map(([id,name,spec,qty]) => ({id,name,spec,qty}))}));

// 每一页只保留当下操作。更多背景信息放在零件说明和结构页。
export const steps = [
  { title:'先清点零件', phase:'认识零件', parts:'全部零件清单、卷尺', diagram:'inventory', torque:'none', actions:[
    '按编号把光轴、夹具、轮子和附件分开放在桌上。',
    '特别数清：十字夹 C 有9个，T型夹 D 有4个；它们用途不同。',
    '到“零件”页逐项勾选已收到的东西。'
  ], checks:['1050mm主杆只有1根；300mm杆有5根；246mm杆有2根。',`轮子4个、圆螺母4个、${display.guide}导线环${dimensions.yarnGuides.count}个。`] },
  { title:'先接好4个轮子', phase:'轮子准备', parts:'轮子 E ×4、圆螺母 F ×4', diagram:'wheel', torque:'tight', actions:[
    '拿一个轮子，让 M6×15mm 螺杆朝上。',
    '把螺杆拧入圆螺母的 M6 内螺纹；重复4次。',
    '后面要插进十字夹的是圆螺母的 Φ10 外圆柱，不是细螺杆。'
  ], checks:['4个轮子各有1个圆螺母。','手握轮子轻转，圆螺母不会轻易脱开。'] },
  { title:'在前横梁上排好夹具', phase:'组装横梁', parts:'前横梁 B1、T型夹 D ×2、十字夹 C ×3', diagram:'front', torque:'light', actions:[
    '拿 B1 平放，贴一张“前”纸条。',
    '从左到右依次套：轮子十字夹、左角T型夹、中央底梁十字夹、右角T型夹、轮子十字夹。',
    '让两个轮子夹的空孔朝地面；中央夹的空孔朝后方，两个T型夹的侧孔也朝后方。'
  ], checks:['顺序为 C—D—C—D—C，共5个夹具。','中间的 C 位于横梁正中，左右对称。'] },
  { title:'后横梁也排好夹具', phase:'组装横梁', parts:'后横梁 B2、T型夹 D ×2、十字夹 C ×3', diagram:'rear', torque:'light', actions:[
    '把 B2 平放，与前横梁平行，贴“后”纸条。',
    '从左到右同样套：轮子 C、左角 D、中央 C、右角 D、轮子 C。',
    '轮子夹空孔朝地；中央夹和角夹的空孔朝前横梁。'
  ], checks:['前后两梁各有 C×3、D×2。','前后中央 C 面对面，位置都居中。'] },
  { title:'插入左侧梁', phase:'形成外框', parts:'左侧梁 B4（246mm）', diagram:'left', torque:'light', actions:[
    '把 B4 一端插进前梁左角 T 型夹朝后的孔。',
    '另一端插进后梁左角 T 型夹朝前的孔。',
    '只轻拧，保留调整空间；246mm 是杆的标称长度。'
  ], checks:['B4 在左边，连接的是两个 T 型夹。','B4 与前后梁大致成直角。'] },
  { title:'插入右侧梁', phase:'形成外框', parts:'右侧梁 B5（246mm）', diagram:'right', torque:'light', actions:[
    '同样把 B5 插进前后梁右角的两个 T 型夹。',
    '让左右侧梁平行，底盘外形接近 30×30cm。',
    '此时所有底盘夹具仍只轻拧。'
  ], checks:['四角都是 T 型夹，不是轮子夹。','左右侧梁互相平行。'] },
  { title:'把中央底梁装在正中', phase:'中央底梁', parts:'中央底梁 B3（300mm）', diagram:'center', torque:'light', actions:[
    '找出前后横梁正中的两个十字夹 C。',
    '把 B3 前后两端分别插入这两个夹具朝内的孔。',
    '从上方看，B3 必须在左右侧梁之间的正中线，绝不能装在边上。'
  ], checks:['从左侧梁到 B3、从 B3 到右侧梁，看起来距离相近。','B3 与两侧梁平行。'] },
  { title:'找正底盘，再锁紧', phase:'校正底盘', parts:'半成品底盘、已接好的轮子 E×4', diagram:'base', torque:'tight', actions:[
    '把4个圆螺母的 Φ10 圆柱插入四角附近轮子十字夹朝下的孔，先轻拧固定。',
    '把底盘放到平地，调成近似正方形，四轮同时着地、中央梁居中。',
    '交替拧紧四角 T 夹、中央梁 C 夹、轮子 C 夹；每次只拧一点，复查后再锁牢。'
  ], checks:['四轮同时着地且能转动。','中央梁确实在中间，左右侧梁平行。'] },
  { title:'先把篮子放到底盘', phase:'篮子与主杆', parts:'网篮 O（30×30×15cm）', diagram:'basket', torque:'none', actions:[
    '先不要安装105cm主杆。',
    '把篮子放在底盘上，调整到稳当的位置。',
    '找出篮底最接近中央底梁正中、允许 Φ10 主杆通过的网孔。'
  ], checks:['篮子已在底盘上，不需要以后从主杆顶部套入。','篮子不明显歪斜或顶住轮子。'] },
  { title:'让主杆穿过篮底', phase:'篮子与主杆', parts:'主杆 A1、硅胶垫 H1×2/H2×1、固定环 G', diagram:'rodThrough', torque:'light', pending:'padStack', actions:[
    '把 A1 从篮内选好的网孔向下穿过，立在中央底梁附近。',
    '用硅胶垫在接触处填缝、减震，用分离式固定环做限位。',
    '先试摆位置，确认篮子稳、主杆能居中；垫片与固定环最终上下顺序等实物到货后确认。'
  ], checks:['主杆穿过篮底网孔，底端对准中央底梁。','篮子与主杆接触处没有明显硬碰硬。'] },
  { title:'把主杆接上中央梁', phase:'篮子与主杆', parts:'十字夹 C ×1、主杆 A1、中央底梁 B3', diagram:'rodJoin', torque:'light', actions:[
    '在 B3 的中部装上1个十字夹 C。',
    '将 A1 的底端插入夹具竖直的孔，让主杆站起来。',
    '只轻拧到不会自己滑脱，保留校直空间。'
  ], checks:['主杆落点在 B3 中部，不在底盘边缘。','主杆从正面和侧面看都大致竖直。'] },
  { title:'看两面，把主杆锁直', phase:'找正主杆', parts:'已安装主杆、卷尺或直尺', diagram:'alignment', torque:'tight', actions:[
    '站到架子正前方，看主杆是否向左或右歪。',
    '再走到侧面，看它是否向前或后歪。',
    '调直后锁紧主杆底部 C 夹；再复查篮子限位和底盘。'
  ], checks:['正面与侧面都没有明显歪斜。','轻推主杆，底部夹具不松动。'] },
  { title:'装约79cm的下横杆', phase:'顶部横杆', parts:'下横杆 A3（300mm）、十字夹 C ×1', diagram:'lowerBar', torque:'light', actions:[
    '从中央底梁高度0cm往上量，在约79cm处做可擦标记。',
    '用1个十字夹 C 把 A3 接到主杆上，横杆与主杆成直角。',
    '先轻拧；稍后要量它到上横杆和 iPad 上沿的净距离。'
  ], checks:['A3 高度约79cm，左右伸出大致均衡。','横杆平直、暂时仍可微调。'] },
  { title:'装约100cm的上横杆', phase:'顶部横杆', parts:'上横杆 A2（300mm）、十字夹 C ×1、端帽 N', diagram:'upperBar', torque:'tight', actions:[
    '从0cm往上量，在约100cm处安装 A2。',
    `量两根横杆最近边缘之间的净距离，必须至少${display.barGap}；不够就调整。`,
    '确认两杆平直后锁紧两个夹具，并给可接触的裸露杆端装端帽。'
  ], checks:[`两根横杆净距离≥${display.barGap}，不能只看中心点间距。`,'两杆夹具均已锁紧，外露末端安全。'] },
  { title:'把 iPad 放在底盘范围内', phase:'附件', parts:'iPad 支架 J、平板、卷尺', diagram:'ipad', torque:'light', pending:'ipadMount', actions:[
    '先用实物确认支架如何夹到 Φ10 主杆；连接方式待实物确认。',
    '固定点可在约50～56cm区域试摆；支架尽量短，平板向篮子/底盘投影内收。',
    `平板上沿建议≤${display.ipadTop}（不得超过约${display.ipadCeiling}），实测它到${display.topBars[1]}横杆最近边缘的净距离≥${display.ipadGap}；确认无明显侧倾后锁紧。`
  ], checks:['平板不会明显把架子拉向一侧。',`平板上沿到下横杆净距离≥${display.ipadGap}。`] },
  { title:'用两道扎带固定笔筒', phase:'附件', parts:'网格笔筒 K、防滑条 M、黑色扎带 L ×2', diagram:'cup', torque:'tight', actions:[
    '在笔筒背面与主杆接触处贴一小段防滑条。',
    '把笔筒放在约45～55cm、尽量与 iPad 相反的一侧。',
    '两根扎带分别穿过网格，在上、下两处绕主杆拉紧；位置确认后再剪去多余尾巴。'
  ], checks:['用的是上下两道扎带。','轻推笔筒，不下滑也不绕杆旋转。'] },
  { title:`把${dimensions.yarnGuides.count}个${dimensions.yarnGuides.innerDiameter/10}cm导线环装成一组`, phase:'附件', parts:`${display.guide}导线环 I ×${dimensions.yarnGuides.count}`, diagram:'guides', torque:'light-then-tight', actions:[
    `先找主杆约${display.guideGroup}的区域，在篮口上方留出顺畅出线空间。`,
    '先装主方向第1个环，只轻拧；再把另外两个环紧挨着装在附近。',
    `让三个环向三个不同方向展开，尽量同高；夹具顶住时只上下错开约1～${dimensions.yarnGuides.maxVerticalOffset/10}cm。`,
    `调整到三个${dimensions.yarnGuides.innerDiameter/10}cm圆环互不碰撞，三股毛线各走自己的环，再锁紧全部夹具。`
  ], checks:['三个环是否集中在一组？','是否没有明显上下分成三层？','是否分别朝三个方向？',`三个${dimensions.yarnGuides.innerDiameter}mm圆环是否互不碰撞？`,'三股毛线从篮子出来后，是否分别顺畅进入自己的环？','三个夹具是否都已锁紧？'] },
  { title:'逐项验收整机', phase:'最终验收', parts:'装好的整机、卷尺', diagram:'final', torque:'check', actions:[
    '打开下方“验收”页，从底盘、主杆到附件逐项检查。',
    '先锁住四轮刹车，轻推各处，确认不松、不斜、没有明显侧倾。',
    '全部通过后勾完清单，再标记本步完成。'
  ], checks:['轮子、尺寸、夹具、端帽和导线环都已逐项检查。','有任一项不通过，就回到对应步骤调整。'] }
];

export const inspection = [
  ['wheels','4个轮子都能正常转动'],['brakes','4个刹车都能锁住'],['floor','四轮同时着地'],
  ['base','底盘不明显扭曲、侧梁平行'],['center','中央底梁位于正中'],['rod','主杆从正面和侧面看基本垂直'],
  ['bars',`两横杆最近边缘净距≥${display.barGap}`],['ipadGap',`下横杆到 iPad 上沿净距≥${display.ipadGap}`],['ipadTop',`iPad 上沿建议≤${display.ipadTop}，且不超过约${display.ipadCeiling}`],
  ['balance','iPad 不会明显把架子拉向一侧'],['cup','笔筒不下滑、不旋转'],
  ['guides',`${dimensions.yarnGuides.count}个${display.guide}导线环成一组、基本同高、朝三方向且互不碰撞`],
  ['guideClamps','三个导线环夹具已锁紧，三股毛线分别顺畅通过'],
  ['basket','篮子无明显金属碰撞异响'],['screws','所有最终需锁紧的螺丝均已锁紧'],
  ['caps','裸露光轴末端有端帽或没有锐利毛刺']
].map(([id,label])=>({id,label}));

export const glossary = [
  {id:'cross', title:'十字夹 C', subtitle:'两根10mm杆交叉连接', body:'共9个：轮子4、中央梁两端2、主杆底部1、顶部横杆2。装轮子时由十字夹夹住圆螺母的 Φ10 外圆柱。'},
  {id:'tee', title:'T型夹 D', subtitle:'底盘四个角', body:'共4个。每个角用它把300mm前/后横梁与246mm左/右侧梁连接。角上还会另有一个轮子用十字夹。'},
  {id:'nut', title:'圆螺母 F', subtitle:'把 M6 轮杆转成 Φ10 外径', body:'轮子的 M6×15mm 螺杆先拧入 M6×Φ10×16mm 圆螺母，再把圆螺母外圆柱插进轮子十字夹。'},
  {id:'collar', title:'分离式固定环 G', subtitle:'篮子/主杆限位', body:'和硅胶垫一起用于篮底接触位置的限位、填缝与减震。最终垫片上下顺序待实物到货确认。'},
  {id:'guides', title:`${dimensions.yarnGuides.innerDiameter/10}cm独立导线环 I`, subtitle:'三方向的一组', body:`${display.guide}×${dimensions.yarnGuides.count}。都装在主杆约${display.guideGroup}区域，尽量同高，分别向三个方向伸出；若夹具互相干涉，只错开约1～${dimensions.yarnGuides.maxVerticalOffset/10}cm。`}
];

export const mistakes = [
  ['中央底梁装到边上','从上方看，中央梁 B3 应沿底盘正中线连接前后梁。','base'],
  ['轮子螺杆直接塞进十字夹','先把 M6 螺杆拧入 Φ10 圆螺母，再夹住圆螺母外圆柱。','wheel'],
  ['把 T 型夹当成轮子夹','角上的 T 型夹接侧梁，旁边另有一个十字夹接轮子。','base'],
  ['一开始就把全部夹具锁死','先轻拧，校正方正和垂直后，再按步骤锁紧。','base'],
  ['没放篮子就先装主杆','先把篮子放到底盘，再让主杆穿过篮底网孔。','basket'],
  ['主杆没找直就锁紧','从正面、侧面分别看直，再锁紧底部十字夹。','alignment'],
  ['两横杆净距离不足20cm','量最近边缘的净距，不只量中心点。','upperBar'],
  ['iPad 离底盘太远','用短支架，把平板尽量收到篮子/底盘投影内。','ipad'],
  ['笔筒没贴防滑条，或只绑一道','接触面贴防滑条，再用上下两道扎带固定。','cup'],
  ['三个导线环上下拉成三层',`集中在${display.guideGroup}区域，尽量同高；夹具干涉最多只错开约1～${dimensions.yarnGuides.maxVerticalOffset/10}cm。`,'guides'],
  ['三个导线环全朝同一方向','分向展开，让三股线各自进入一个环。','guides'],
  [`三个${dimensions.yarnGuides.innerDiameter/10}cm圆环互相碰撞`,'旋转各环方向，保留间隙，锁紧前轻推确认。','guides'],
  ['导线环太贴近篮口',`环组中心放在篮口上方约${display.guideGroup}，让毛线顺畅上行。`,'guides']
].map(([title,fix,diagram])=>({title,fix,diagram}));
