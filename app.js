import { dimensions as d, display, pendingDetails, partGroups, steps, inspection, glossary, mistakes } from './data.js';
import { diagramFor } from './diagrams.js';

const STORAGE_KEY='knitting-rack-guide-state-v1';
const defaultState=()=>({currentStep:0,completed:[],received:[],inspection:[]});
function readState(){
  try { const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(!raw||typeof raw!=='object')return defaultState();
    return {currentStep:Math.max(0,Math.min(17,Number(raw.currentStep)||0)),completed:Array.isArray(raw.completed)?raw.completed.filter(Number.isInteger):[],received:Array.isArray(raw.received)?raw.received.filter(x=>typeof x==='string'):[],inspection:Array.isArray(raw.inspection)?raw.inspection.filter(x=>typeof x==='string'):[]};
  } catch { return defaultState(); }
}
let state=readState();
const main=document.getElementById('main');
const dialog=document.getElementById('diagramDialog');
const resetDialog=document.getElementById('resetDialog');
const moreDialog=document.getElementById('moreDialog');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{showToast('浏览器未能保存进度，请检查存储权限。');}};
function showToast(message){let el=document.querySelector('.toast');if(!el){el=document.createElement('div');el.className='toast';el.setAttribute('role','status');document.body.append(el);}el.textContent=message;el.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.classList.remove('show'),3200);}
function route(){const h=location.hash.replace(/^#/,'')||'home';const [page,arg]=h.split('/');return {page,arg};}
function go(page,arg){location.hash=arg===undefined?`#${page}`:`#${page}/${arg}`;}
function diagramCard(key,title,extra='') {return `<button class="diagram-card ${extra}" type="button" data-diagram="${key}" data-title="${esc(title)}" aria-label="放大查看：${esc(title)}"><span class="diagram-art">${diagramFor(key)}</span><span class="diagram-zoom">点击放大 ↗</span></button>`;}
function sectionTop(kicker,title,subtitle=''){return `<div class="page-head"><span class="eyebrow">${kicker}</span><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div>`;}
function home(){
  const next=state.completed.length===steps.length?17:(!state.completed.includes(state.currentStep)?state.currentStep:steps.findIndex((_,i)=>i>state.currentStep&&!state.completed.includes(i))>=0?steps.findIndex((_,i)=>i>state.currentStep&&!state.completed.includes(i)):steps.findIndex((_,i)=>!state.completed.includes(i)));
  const percent=Math.round(state.completed.length/steps.length*100);
  return `<div class="home-hero"><span class="eyebrow light">一步一步 · 按自己的节奏</span><h1>我的编织架<br>安装助手</h1><p>18个小步骤，装好移动式编织收纳架。</p><div class="progress-line"><div style="width:${percent}%"></div></div><div class="hero-progress"><strong>${percent}%</strong><span>已完成 ${state.completed.length} / 18 步</span></div><button class="primary white" type="button" data-go="steps/${next+1}">${state.completed.length===18?'查看安装步骤':'继续安装 · 第'+(next+1)+'步'} <span aria-hidden="true">→</span></button></div>
  <div class="content-stack"><div class="summary-card"><div><span class="eyebrow">接下来</span><h2>第${next+1}步 · ${esc(steps[next].title)}</h2><p>${esc(steps[next].phase)}</p></div><span class="summary-number">${String(next+1).padStart(2,'0')}</span></div>
  <div class="section-header"><h2>装好后长这样</h2><button class="text-button" type="button" data-go="structure">看完整结构 →</button></div>${diagramCard('final','最终结构正视图','home-diagram')}
  <div class="tip-card"><strong>装之前记住</strong><p>夹具先轻拧，结构找正以后再锁紧。底盘中央梁一定在正中间。</p></div>
  <div class="install-card"><strong>放到 iPhone 主屏幕</strong><p>用 Safari 打开 → 点底部“分享” → “添加到主屏幕”。安装后基础内容可离线查看。</p></div>
  <div class="mini-links"><button type="button" data-go="mistakes">常见错误 →</button><button type="button" data-go="glossary">认识夹具 →</button><button type="button" data-go="settings">进度设置 →</button></div></div>`;
}
function torqueBox(type){
  const values={light:['先轻拧','拧到零件不会自行滑落，但还能移动调整。'],tight:['现在锁紧','先找正位置，再分次拧牢；不要猛拧伤螺纹。'],'light-then-tight':['先轻拧 → 现在锁紧','三个环先一起调方向和间隙，确认后逐个锁紧。'],none:['先定位','这一步无需锁紧夹具，先确认摆放位置。'],check:['逐项检查','未通过的项目回到相应步骤调整。']};
  const [label,detail]=values[type]||values.none;
  return `<div class="torque ${type}"><span>${label}</span><p>${detail}</p></div>`;
}
function stepPage(index){
  index=Math.max(0,Math.min(17,index));state.currentStep=index;save();const step=steps[index];const done=state.completed.includes(index);
  const pending=step.pending?pendingDetails[step.pending]:null;
  return `${sectionTop(`第 ${index+1} / 18 步 · ${esc(step.phase)}`,esc(step.title))}
    <div class="step-progress" aria-label="已完成${state.completed.length}步，共18步"><div style="width:${state.completed.length/18*100}%"></div></div>
    ${torqueBox(step.torque)}
    <div class="step-body"><div class="part-strip"><span>这一步拿</span><strong>${esc(step.parts)}</strong></div>
    ${diagramCard(step.diagram,step.title)}
    ${pending?`<div class="pending-note"><strong>待实物确认</strong><span>${esc(pending.label)}。${esc(pending.reason)}</span></div>`:''}
    <section class="instruction-card"><h2>现在这样做</h2><ol>${step.actions.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></section>
    <section class="check-card"><h2>检查一下</h2><ul>${step.checks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>
    <div class="step-actions"><button class="primary" type="button" data-complete="${index}">${done?'✓ 本步已完成 · 点击撤销':'✓ 完成本步'}</button><div class="step-pager"><button type="button" data-prev="${index}" ${index===0?'disabled':''}>← 上一步</button><button type="button" data-next="${index}" ${index===17?'disabled':''}>下一步 →</button></div></div>
    <button class="text-button all-steps" type="button" data-go="step-list">查看全部18步</button></div>`;
}
function stepList(){return `${sectionTop('安装路线','18个小步骤','随时可以跳到任意步骤；已完成的步骤会保留。')}<div class="content-stack"><ol class="step-list">${steps.map((s,i)=>`<li><button type="button" data-go="steps/${i+1}"><span class="step-index ${state.completed.includes(i)?'done':''}">${state.completed.includes(i)?'✓':i+1}</span><span><small>${esc(s.phase)}</small><strong>${esc(s.title)}</strong></span><span class="chev">›</span></button></li>`).join('')}</ol></div>`;}
function parts(){
  const all=partGroups.flatMap(g=>g.items);const received=all.filter(p=>state.received.includes(p.id)).length;
  return `${sectionTop('收货时对照','零件清单',`已收到 ${received} / ${all.length} 项。勾选会自动保存。`)}<div class="content-stack"><div class="note-line">说明：杆长为标称长度。十字夹共9个、T型夹共4个，请分开放。</div>${partGroups.map(g=>`<section class="part-group"><h2>${esc(g.title)}</h2>${g.items.map(p=>`<label class="part-row"><input type="checkbox" data-part="${p.id}" ${state.received.includes(p.id)?'checked':''}><span class="part-id">${p.id}</span><span class="part-info"><strong>${esc(p.name)} <em>×${esc(p.qty)}</em></strong><small>${esc(p.spec)}</small></span></label>`).join('')}</section>`).join('')}<button class="subtle-button" type="button" data-go="glossary">不认识夹具？看零件说明 →</button></div>`;
}
function structure(){return `${sectionTop('装配关系','最终结构','高度都以中央底梁为0cm。点击任意图放大。')}<div class="content-stack"><div class="structure-tabs"><span>正视</span><span>侧视</span><span>俯视</span></div><h2 class="block-title">正视图</h2>${diagramCard('final','最终结构正视图')}<h2 class="block-title">侧视图</h2>${diagramCard('side','最终结构侧视图')}<h2 class="block-title">底盘俯视图</h2>${diagramCard('base','底盘俯视图')}<h2 class="block-title">导线环组俯视图</h2>${diagramCard('guides',`三个${d.yarnGuides.innerDiameter}mm导线环组俯视图`)}
  <div class="dimension-grid"><div><strong>${display.mainRod}</strong><span>主杆长度</span></div><div><strong>${display.topBars.join(' / ')}</strong><span>上 / 下横杆</span></div><div><strong>≥${display.barGap}</strong><span>两横杆净距</span></div><div><strong>建议≤${display.ipadTop}</strong><span>平板上沿，且不得超过约${display.ipadCeiling}</span></div><div><strong>≥${display.ipadGap}</strong><span>下横杆到平板净距</span></div><div><strong>${display.guideGroup}</strong><span>导线环组中心</span></div></div>
  <div class="tip-card"><strong>导线环是一组</strong><p>${d.yarnGuides.count}个环内径均为${d.yarnGuides.innerDiameter}mm，尽量同高，分别向三个方向伸出；夹具互相干涉时上下仅错开约1～${d.yarnGuides.maxVerticalOffset/10}cm。</p></div>
  <div class="tip-card"><strong>底盘长度说明</strong><p>前后横梁和中央底梁各${d.baseFrontBack}mm；左右侧梁各${d.baseSide}mm。${d.baseSide}mm = ${d.baseFrontBack}mm − ${d.baseFrontBack-d.baseSide}mm，${d.baseFrontBack-d.baseSide}mm 是同款 T 型夹两侧合计占用。图示强调连接关系，真实外沿受夹具尺寸影响。</p></div></div>`;}
function glossaryPage(){return `${sectionTop('零件怎么用','零件说明','点图可以放大。每个编号在步骤和零件清单中一致。')}<div class="content-stack">${glossary.map(x=>`<section class="explain-card"><div><span class="eyebrow">${esc(x.subtitle)}</span><h2>${esc(x.title)}</h2><p>${esc(x.body)}</p></div>${diagramCard('gloss-'+x.id,x.title)}</section>`).join('')}</div>`;}
function mistakesPage(){return `${sectionTop('装错了怎么办','常见错误','发现一处就回到对应步骤调整。')}<div class="content-stack">${mistakes.map((m,i)=>`<details class="mistake"><summary><span class="mistake-number">${String(i+1).padStart(2,'0')}</span><strong>${esc(m.title)}</strong><span class="chev">⌄</span></summary><div class="mistake-body"><p><b>正确做法：</b>${esc(m.fix)}</p>${diagramCard(m.diagram,m.title)}</div></details>`).join('')}<div class="tip-card"><strong>导线环正确状态</strong><p>三个${d.yarnGuides.innerDiameter/10}cm大环集中成一组、基本同高、方向分开、彼此不碰撞，并高于篮口留出顺畅出线空间。</p></div></div>`;}
function inspectionPage(){let count=state.inspection.length;return `${sectionTop('最后一步','整机验收',`已通过 ${count} / ${inspection.length} 项。逐项触摸勾选。`)}<div class="content-stack"><div class="inspection-hero"><strong>${count===inspection.length?'全部通过 ✓':`${count} / ${inspection.length}`}</strong><p>${count===inspection.length?'可以开始使用编织架了。':'未通过的项目请先调整，不要跳过。'}</p></div><div class="inspection-list">${inspection.map((item,i)=>`<label class="inspection-item"><input type="checkbox" data-inspection="${item.id}" ${state.inspection.includes(item.id)?'checked':''}><span class="inspection-num">${String(i+1).padStart(2,'0')}</span><strong>${esc(item.label)}</strong></label>`).join('')}</div><button class="subtle-button" type="button" data-go="steps/18">回到第18步 →</button></div>`;}
function settings(){const release=globalThis.RACK_RELEASE||{version:'未知',updated:'未提供'};return `${sectionTop('本机数据','进度设置','所有勾选只保存在这台设备的浏览器里。')}<div class="content-stack"><div class="setting-card"><strong>当前安装进度</strong><p>${state.completed.length} / 18步，已收货 ${state.received.length} 项，验收 ${state.inspection.length} 项。</p></div><div class="setting-card"><strong>重置安装进度</strong><p>会清除当前步骤、已完成步骤、零件收货和验收勾选。</p><button class="danger-button" type="button" id="resetButton">重置全部进度</button></div><div class="release-info">版本：${esc(release.version)} · 最后更新：${esc(release.updated)}</div><button class="subtle-button" type="button" data-go="home">返回首页</button></div>`;}
function render(){const {page,arg}=route();const pages={home,parts,structure,inspection:inspectionPage,glossary:glossaryPage,mistakes:mistakesPage,settings,'step-list':stepList};
  main.innerHTML=page==='steps'?stepPage(Number(arg||state.currentStep+1)-1):(pages[page]||home)();
  document.querySelectorAll('.bottom-nav button').forEach(b=>{let active=b.dataset.page===(page==='step-list'?'steps':page);b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  document.title=`${page==='steps'?`第${Number(arg||state.currentStep+1)}步 · `:''}我的编织架安装助手`;
  window.scrollTo({top:0,behavior:'instant'});
}
document.addEventListener('click',event=>{
  const target=event.target.closest('button');if(!target)return;
  if(target.dataset.go){if(moreDialog.open)moreDialog.close();const [page,arg]=target.dataset.go.split('/');go(page,arg);return;}
  if(target.dataset.page){go(target.dataset.page);return;}
  if(target.dataset.diagram){document.getElementById('diagramTitle').textContent=target.dataset.title||'结构图';document.getElementById('diagramLarge').innerHTML=diagramFor(target.dataset.diagram);dialog.showModal();return;}
  if(target.dataset.complete!==undefined){const n=Number(target.dataset.complete);state.completed=state.completed.includes(n)?state.completed.filter(x=>x!==n):[...state.completed,n].sort((a,b)=>a-b);if(state.completed.includes(n)&&n<17)state.currentStep=n+1;save();render();showToast(state.completed.includes(n)?'已记录本步完成':'已撤销本步完成');return;}
  if(target.dataset.prev!==undefined){go('steps',Math.max(1,Number(target.dataset.prev)));return;}
  if(target.dataset.next!==undefined){go('steps',Math.min(18,Number(target.dataset.next)+2));return;}
  if(target.id==='resetButton'){
    resetDialog.showModal();
    return;
  }
  if(target.id==='cancelReset'){resetDialog.close();return;}
  if(target.id==='confirmReset'){resetDialog.close();state=defaultState();save();go('home');render();showToast('全部进度已重置。');return;}
  if(target.id==='menuButton'){moreDialog.showModal();return;}
  if(target.id==='closeMore'){moreDialog.close();return;}
  if(target.id==='closeDiagram'){dialog.close();return;}
});
document.addEventListener('change',event=>{
  const t=event.target;
  if(t.matches('[data-part]')){state.received=t.checked?[...new Set([...state.received,t.dataset.part])]:state.received.filter(x=>x!==t.dataset.part);save();const p=route();if(p.page==='parts')render();}
  if(t.matches('[data-inspection]')){state.inspection=t.checked?[...new Set([...state.inspection,t.dataset.inspection])]:state.inspection.filter(x=>x!==t.dataset.inspection);save();render();}
});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
resetDialog.addEventListener('click',e=>{if(e.target===resetDialog)resetDialog.close();});
moreDialog.addEventListener('click',e=>{if(e.target===moreDialog)moreDialog.close();});
window.addEventListener('hashchange',render);
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register(`./sw.js?v=${encodeURIComponent(globalThis.RACK_RELEASE.version)}`,{scope:'./',updateViaCache:'none'}).then(registration=>registration.update().catch(()=>{})).catch(()=>showToast('离线缓存暂时未启用。'));
if(!location.hash)history.replaceState(null,'','#home');
render();
