import { dimensions as d, display } from './data.js';

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const line = (x1,y1,x2,y2,cls='rod') => `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const txt = (x,y,t,cls='label',extra='') => `<text class="${cls}" x="${x}" y="${y}" ${extra}>${esc(t)}</text>`;
const circle = (x,y,r,cls='') => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
const rect = (x,y,w,h,cls='') => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`;
const tag = (x,y,t,cls='tag') => `<g>${rect(x-17,y-16,34,22,cls)}${txt(x,y,t,'tag-text','text-anchor="middle"')}</g>`;
const svg = (content,title,view='0 0 390 340') => `<svg class="rack-svg" xmlns="http://www.w3.org/2000/svg" viewBox="${view}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#a36d2d"/></marker></defs>${content}</svg>`;
const dim = (x1,y1,x2,y2,t,tx,ty) => `${line(x1,y1,x2,y2,'dim-line')}${txt(tx,ty,t,'dim-text')}`;

function clamp(x,y,type,hot=false) {
  const cls = `clamp ${hot?'hot':''}`;
  return type==='D'
    ? `<g>${rect(x-12,y-10,24,20,cls)}${line(x,y-10,x,y+10,'clamp-line')}${txt(x,y+4,'D','clamp-text','text-anchor="middle"')}</g>`
    : `<g>${rect(x-10,y-10,20,20,cls)}${line(x-8,y,x+8,y,'clamp-line')}${line(x,y-8,x,y+8,'clamp-line')}${txt(x+13,y-12,'C','tiny')}</g>`;
}
function base(stage='base',compact=false) {
  const current = {front:'front',rear:'rear',left:'left',right:'right',center:'center',base:'wheels',final:'all'}[stage] || 'all';
  const showLeft=['left','right','center','wheels','all'].includes(current);
  const showRight=['right','center','wheels','all'].includes(current);
  const showCenter=['center','wheels','all'].includes(current);
  const showWheels=['wheels','all'].includes(current);
  let s = `${txt(195,26,'底盘俯视｜前方在上','svg-heading','text-anchor="middle"')}`;
  s += `${line(70,84,320,84,current==='front'?'rod hot':'rod')}${line(70,274,320,274,current==='rear'?'rod hot':'rod')}`;
  if(showLeft)s += line(96,84,96,274,current==='left'?'rod hot':'rod');
  if(showRight)s += line(294,84,294,274,current==='right'?'rod hot':'rod');
  if(showCenter)s += line(195,84,195,274,current==='center'?'rod hot':'rod center-rod');
  for (const y of [84,274]) {
    for (const x of [96,294]) s += clamp(x,y,'D',current==='front'&&y===84||current==='rear'&&y===274);
    s += clamp(195,y,'C',current==='center'||current==='front'&&y===84||current==='rear'&&y===274);
    for (const x of [70,320]) {
      s += clamp(x,y,'C',current==='wheels'||current==='front'&&y===84||current==='rear'&&y===274);
      if(showWheels){s += circle(x,y===84?51:307,13,current==='wheels'?'wheel hot':'wheel');s += txt(x,y===84?55:311,'E','wheel-text','text-anchor="middle"');}
    }
  }
  if(showCenter)s += tag(195,166,'B3');
  if(showLeft)s += tag(114,183,'B4');
  if(showRight)s += tag(276,183,'B5');
  s += `${txt(194,72,'B1 前横梁','part-label','text-anchor="middle"')}${txt(194,298,'B2 后横梁','part-label','text-anchor="middle"')}`;
  s += `${dim(70,38,320,38,`${d.baseFrontBack}mm`,170,36)}${dim(340,85,340,273,`${d.baseSide}mm 侧梁`,342,180)}`;
  if (!compact) s += `${txt(195,331,'C＝十字夹（轮子／中央梁）   D＝T型夹（四角）','svg-note','text-anchor="middle"')}`;
  return svg(s,showCenter?'底盘俯视图：中央底梁位于正中，四角T型夹与轮子十字夹分开':'底盘俯视图：前后横梁与当前安装的侧梁，四角T型夹与轮子十字夹分开');
}
function beam(which) {
  const y=162, isFront=which==='front';
  let s=txt(195,33,`${isFront?'前':'后'}横梁夹具顺序｜俯视`,'svg-heading','text-anchor="middle"');
  s+=`${line(29,y,361,y,'rod hot')}${txt(195,135,isFront?`B1 ${d.baseFrontBack}mm`:`B2 ${d.baseFrontBack}mm`,'part-label','text-anchor="middle"')}`;
  const xs=[47,102,195,288,343];
  xs.forEach((x,i)=>{s+=clamp(x,y,i===1||i===3?'D':'C',true);s+=txt(x,221,['轮子 C','角 D','中央 C','角 D','轮子 C'][i],'small-label','text-anchor="middle"');s+=line(x,178,x,202,'callout')});
  s+=dim(29,86,361,86,`${d.baseFrontBack}mm`,166,82);
  s+=`${txt(195,263,'从左到右：C — D — C — D — C','svg-note','text-anchor="middle"')}`;
  s+=`${txt(195,292,isFront?'侧孔朝后方；轮子孔朝地':'侧孔朝前方；轮子孔朝地','svg-note','text-anchor="middle"')}`;
  return svg(s,`${isFront?'前':'后'}横梁上轮子十字夹、角T型夹、中央十字夹的顺序`);
}
function wheel() {
  let s=txt(195,28,'一个轮子的连接｜放大示意','svg-heading','text-anchor="middle"');
  s+=`${circle(99,230,30,'wheel hot')}${circle(99,230,13,'hub')}${line(99,199,99,155,'rod hot')}${txt(44,276,'轮子 E','part-label')}`;
  s+=`${rect(84,109,30,48,'nut hot')}${txt(133,136,'F  圆螺母','part-label')}${txt(133,158,'内螺纹 M6','small-label')}${txt(133,182,'外径 Φ10mm','small-label')}`;
  s+=`${txt(130,93,'轮杆 M6×15mm','small-label')}${line(100,100,100,71,'callout')}`;
  s+=`${rect(77,46,44,30,'clamp')}${txt(134,65,'C 十字夹夹住圆螺母外圆柱','small-label')}`;
  s+=`${txt(195,311,'先把细螺杆拧进圆螺母，再插入十字夹','svg-note','text-anchor="middle"')}`;
  return svg(s,'轮子M6螺杆拧进M6内螺纹圆螺母，圆螺母Φ10外圆柱插进十字夹');
}
function basket(stage) {
  let s=txt(195,27,'篮子先放好，再穿主杆','svg-heading','text-anchor="middle"');
  s+=`${line(39,280,351,280,'rod')}${txt(195,312,'B3 中央底梁','part-label','text-anchor="middle"')}`;
  s+=`${rect(56,169,278,104,'basket hot')}`;
  for(let x=80;x<335;x+=24)s+=line(x,170,x,271,'mesh');
  for(let y=192;y<273;y+=23)s+=line(56,y,334,y,'mesh');
  s+=`${txt(68,158,`O 网篮 ${display.basket}`,'part-label')}`;
  if(stage!=='basket'){
    s+=`${line(195,46,195,278,'rod hot')}${circle(195,270,9,'collar')}${txt(219,237,'H 硅胶垫 / G 固定环','small-label')}`;
    s+=`${line(208,240,198,263,'callout')}`;
  }
  s+=`${txt(195,330,stage==='basket'?'此时不要先安装105cm主杆':'垫片与固定环上下顺序：待实物确认','svg-note','text-anchor="middle"')}`;
  return svg(s,'先将30厘米网篮置于底盘，然后主杆穿过篮底网孔');
}
function ringTop(compact=false) {
  // 300 mm base width is 240 SVG units; 90 mm opening is 72 units.
  const cx=195,cy=198,r=d.yarnGuides.innerDiameter*0.4;
  let s=txt(195,29,'导线环组俯视｜同高分向','svg-heading','text-anchor="middle"');
  s+=`${line(cx,cy,103,cy,'guide-arm')}${line(cx,cy,287,cy,'guide-arm')}${line(cx,cy,cx,97,'guide-arm')}`;
  s+=`${circle(80,cy,r,'guide-ring hot')}${circle(310,cy,r,'guide-ring hot')}${circle(cx,78,r,'guide-ring hot')}`;
  s+=`${circle(cx,cy,10,'main-rod')}${txt(cx,cy+31,'A1 主杆','small-label','text-anchor="middle"')}`;
  s+=`${tag(80,203,'I①')}${tag(195,83,'I②')}${tag(310,203,'I③')}`;
  s+=`${txt(195,269,`每个圆环内径 ${d.yarnGuides.innerDiameter}mm（${d.yarnGuides.innerDiameter/10}cm）`,'svg-note','text-anchor="middle"')}`;
  if(!compact)s+=`${txt(195,292,'三环集中成一组；角度可按使用习惯微调','svg-note','text-anchor="middle"')}${txt(195,315,'转动方向，确保大环互不碰撞','svg-note','text-anchor="middle"')}`;
  return svg(s,`导线环组俯视图：三个内径${d.yarnGuides.innerDiameter}毫米大环集中在主杆附近，分别向左、上、右伸出`);
}
function elevation(view='front',stage='final',compact=false) {
  const y=h=>292-h*0.222;
  const showLower=['lowerBar','upperBar','ipad','cup','guides','final'].includes(stage);
  const showUpper=['upperBar','ipad','cup','guides','final'].includes(stage);
  const showIpad=['ipad','cup','guides','final'].includes(stage);
  const showCup=['cup','guides','final'].includes(stage);
  const showGuides=['guides','final'].includes(stage);
  let s=txt(195,25,view==='front'?'整机正视图':'整机侧视图','svg-heading','text-anchor="middle"');
  const cx=view==='front'?195:212;
  s+=`${line(42,292,348,292,'floor')}${line(cx,y(d.mainRod),cx,286,'rod')}`;
  s+=`${line(78,281,312,281,'rod')}${rect(90,y(d.basket[2]),210,33,'basket')}`;
  for(let x=110;x<300;x+=24)s+=line(x,y(d.basket[2]),x,y(d.basket[2])+33,'mesh');
  s+=`${circle(93,300,12,'wheel')}${circle(297,300,12,'wheel')}`;
  if(showLower)s+=`${line(view==='front'?123:152,y(d.topBars[1]),view==='front'?267:272,y(d.topBars[1]),stage==='lowerBar'?'rod hot':'rod')}`;
  if(showUpper)s+=`${line(view==='front'?123:152,y(d.topBars[0]),view==='front'?267:272,y(d.topBars[0]),stage==='upperBar'?'rod hot':'rod')}`;
  // Three guides are one group, with the near/far projected rings shown using dashed edges.
  const gy=y((d.yarnGuides.groupHeightMin+d.yarnGuides.groupHeightMax)/2), gr=d.yarnGuides.innerDiameter*14/90;
  if(showGuides){
    s+=`${circle(cx-39,gy,gr,'guide-ring hot')}${circle(cx+39,gy,gr,'guide-ring hot')}${circle(cx,gy-1,gr,'guide-ring projected')}`;
    s+=`${line(cx-20,gy,cx-10,gy,'guide-arm')}${line(cx+10,gy,cx+20,gy,'guide-arm')}`;
    s+=`${txt(cx-39,gy+4,'1','tiny','text-anchor="middle"')}${txt(cx,gy+4,'2','tiny','text-anchor="middle"')}${txt(cx+39,gy+4,'3','tiny','text-anchor="middle"')}`;
    s+=`${txt(18,gy+29,'3环同高','tiny')}`;
  }
  const ipadX=view==='front'?cx+21:cx+16;
  if(showIpad)s+=`${rect(ipadX,y(d.ipadTopMax),69,44,stage==='ipad'?'ipad hot':'ipad')}${txt(ipadX+35,y(d.ipadTopMax)+27,'iPad','ipad-text','text-anchor="middle"')}`;
  const cupX=view==='front'?cx-65:cx-62;
  if(showCup)s+=`${rect(cupX,y(550),48,27,stage==='cup'?'cup hot':'cup')}${txt(cupX+24,y(550)+18,'K','small-label','text-anchor="middle"')}`;
  s+=`${dim(33,y(d.mainRod),33,281,display.mainRod,39,130)}${txt(90,267,`篮高${d.basket[2]/10}cm`,'small-label')}`;
  if(showUpper)s+=txt(280,y(d.topBars[0])+4,display.topBars[0],'dim-text');
  if(showLower)s+=txt(280,y(d.topBars[1])+4,display.topBars[1],'dim-text');
  if(showIpad)s+=txt(290,183,`≤${display.ipadTop}`,'dim-text');
  if(!compact&&showGuides)s+=`${txt(195,331,`导线环组中心约${display.guideGroup}；三方向见俯视图`,'svg-note','text-anchor="middle"')}`;
  const description=showGuides?`${display.mainRod}主杆、${display.topBars[0]}和${display.topBars[1]}横杆、平板上沿不超${display.ipadCeiling}、三个${d.yarnGuides.innerDiameter}mm导线环同高成组`:showIpad?'主杆、两根横杆与底盘范围内的iPad':showUpper?`主杆、${display.topBars[1]}下横杆与${display.topBars[0]}上横杆`:showLower?`主杆和${display.topBars[1]}下横杆`:'主杆与底盘';
  return svg(s,`${view==='front'?'正':'侧'}视图：${description}`);
}
function dimensionsDiagram(stage) {
  let s=elevation('front',stage,true).replace(/<\/svg>$/,'');
  const y=h=>292-h*0.222;
  if(stage!=='lowerBar')s+=`${line(65,y(d.topBars[0]),65,y(d.topBars[1]),'dim-line')}${txt(75,94,`净距≥${display.barGap}`,'dim-text')}`;
  if(['ipad','final'].includes(stage))s+=`${line(345,y(d.topBars[1])-5,345,y(d.ipadTopMax),'dim-line')}${txt(271,141,`净距≥${display.ipadGap}`,'dim-text')}`;
  s+='</svg>';
  return s;
}
function cup() {
  let s=txt(195,27,'笔筒固定｜局部近景','svg-heading','text-anchor="middle"');
  s+=`${line(245,43,245,290,'rod')}${rect(92,85,144,158,'cup hot')}`;
  for(let x=111;x<230;x+=23)s+=line(x,86,x,242,'mesh');
  for(let y=106;y<238;y+=25)s+=line(93,y,235,y,'mesh');
  s+=`${rect(231,101,10,126,'pad hot')}${txt(251,91,'M 防滑条','small-label')}`;
  s+=`${line(100,128,271,128,'tie')}${line(100,204,271,204,'tie')}${tag(72,134,'L①')}${tag(72,211,'L②')}`;
  s+=`${txt(195,284,'两道扎带穿网格，绕主杆拉紧','svg-note','text-anchor="middle"')}`;
  return svg(s,'网格笔筒背面贴防滑条，再用上下两道扎带绕主杆固定');
}
function inventory() {
  let s=txt(195,26,'先认编号，再开始装','svg-heading','text-anchor="middle"');
  s+=`${line(74,59,74,278,'rod hot')}${tag(74,160,'A1')}${txt(24,311,'1050mm 主杆','small-label')}`;
  for(let i=0;i<5;i++){let y=80+i*37;s+=`${line(147,y,270,y,'rod')}${tag(300,y+5,i<2?`A${i+2}`:`B${i-1}`)}`;}
  s+=`${txt(195,284,'300mm ×5','part-label','text-anchor="middle"')}${txt(195,315,'另有246mm ×2；C×9，D×4','svg-note','text-anchor="middle"')}`;
  return svg(s,'零件编号：主杆1050毫米一根，300毫米光轴五根，246毫米侧梁两根，十字夹九个，T型夹四个');
}
function alignment() {
  let s=txt(195,27,'从两面看是否竖直','svg-heading','text-anchor="middle"');
  for(const [x,label] of [[102,'正面'],[288,'侧面']]){
    s+=`${line(x-61,281,x+61,281,'rod')}${line(x,75,x,280,'rod hot')}${line(x-49,75,x-49,280,'dim-line')}${txt(x,313,label,'part-label','text-anchor="middle"')}`;
  }
  s+=`${txt(195,53,'主杆不向左右 / 前后明显歪斜','svg-note','text-anchor="middle"')}`;
  return svg(s,'正面和侧面同时检查主杆是否垂直');
}
function rodJoin() {
  let s=txt(195,28,'主杆与中央底梁｜连接近景','svg-heading','text-anchor="middle"');
  s+=`${line(45,244,345,244,'rod')}${line(195,48,195,244,'rod hot')}${clamp(195,244,'C',true)}`;
  s+=`${tag(195,109,'A1')}${tag(90,225,'B3')}`;
  s+=`${txt(195,288,'C 十字夹：水平夹B3，竖直夹A1','svg-note','text-anchor="middle"')}`;
  s+=`${txt(195,313,'先轻拧；从正面和侧面找直后再锁紧','svg-note','text-anchor="middle"')}`;
  return svg(s,'主杆A1竖直插入中央底梁B3中部的十字夹C');
}
function glossaryDiagram(id) {
  if(id==='guides')return ringTop();
  if(id==='nut')return wheel();
  if(id==='tee'||id==='cross')return base('base');
  return basket('rodThrough');
}
export function diagramFor(key) {
  switch(key){
    case 'inventory':return inventory(); case 'wheel':return wheel();
    case 'front':return beam('front'); case 'rear':return beam('rear');
    case 'left':case 'right':case 'center':case 'base':return base(key);
    case 'basket':case 'rodThrough':return basket(key);
    case 'rodJoin':return rodJoin(); case 'alignment':return alignment();
    case 'lowerBar':case 'upperBar':case 'ipad':return dimensionsDiagram(key);
    case 'cup':return cup(); case 'guides':return ringTop();
    case 'final':return dimensionsDiagram('final');
    case 'side':return elevation('side','final');
    case 'gloss-cross':return glossaryDiagram('cross'); case 'gloss-tee':return glossaryDiagram('tee');
    case 'gloss-nut':return glossaryDiagram('nut'); case 'gloss-collar':return glossaryDiagram('collar');
    case 'gloss-guides':return glossaryDiagram('guides');
    default:return elevation('front','final');
  }
}
