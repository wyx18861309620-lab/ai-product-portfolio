'use strict';
const decks={proposal:{name:'游戏策划与商业化',count:58,pdf:'assets/game-proposal.pdf',description:'玩法与系统设计、UI/UX、IAA / IAP 商业化、发行规划及广告创意流程。'},research:{name:'市场调研',count:16,pdf:'assets/market-research.pdf',description:'区域市场、竞品与用户偏好、Sort 赛道判断、视觉风格及玩法方向。'}};
let deck='proposal',page=1;
const el=id=>document.getElementById(id);
const src=(d,n)=>`assets/${d}/page-${String(n).padStart(2,'0')}.jpg`;
function renderPage(){
 const d=decks[deck],alt=`${d.name}，第 ${page} 页`;
 el('slideImage').src=src(deck,page);el('slideImage').alt=alt;el('pageSelect').value=String(page);
 el('prevSlide').disabled=page===1;el('nextSlide').disabled=page===d.count;
 el('dialogPrev').disabled=page===1;el('dialogNext').disabled=page===d.count;
 el('dialogImage').src=src(deck,page);el('dialogImage').alt=alt;el('dialogPage').textContent=`${d.name} · ${page} / ${d.count}`;
 document.querySelectorAll('.thumb').forEach((b,i)=>b.setAttribute('aria-current',String(i+1===page)));
 if(page<d.count){const next=new Image();next.src=src(deck,page+1);}
}
function switchDeck(key){
 deck=key;page=1;const d=decks[deck];
 document.querySelectorAll('[data-deck]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.deck===deck)));
 el('viewer').setAttribute('aria-labelledby',deck+'Tab');el('deckDescription').textContent=d.description;el('pdfLink').href=d.pdf;el('pageTotal').textContent='/ '+d.count;
 el('pageSelect').replaceChildren(...Array.from({length:d.count},(_,i)=>{const o=document.createElement('option');o.value=i+1;o.textContent='第 '+(i+1)+' 页';return o;}));
 el('thumbnails').replaceChildren(...Array.from({length:d.count},(_,i)=>{const b=document.createElement('button');b.className='thumb';b.type='button';b.setAttribute('aria-label',`查看第 ${i+1} 页`);const img=document.createElement('img');img.loading='lazy';img.src=src(deck,i+1);img.alt='';const span=document.createElement('span');span.textContent=i+1;b.append(img,span);b.addEventListener('click',()=>{page=i+1;renderPage();});return b;}));
 el('thumbnails').scrollLeft=0;renderPage();
}
function move(delta){page=Math.min(decks[deck].count,Math.max(1,page+delta));renderPage();}
document.querySelectorAll('[data-deck]').forEach(b=>b.addEventListener('click',()=>switchDeck(b.dataset.deck)));
el('pageSelect').addEventListener('change',e=>{page=Number(e.target.value);renderPage();});
['prevSlide','dialogPrev'].forEach(id=>el(id).addEventListener('click',()=>move(-1)));
['nextSlide','dialogNext'].forEach(id=>el(id).addEventListener('click',()=>move(1)));
['zoomSlide','enlargeSlide'].forEach(id=>el(id).addEventListener('click',()=>el('slideDialog').showModal()));
el('closeDialog').addEventListener('click',()=>el('slideDialog').close());
el('slideDialog').addEventListener('click',e=>{if(e.target===el('slideDialog'))el('slideDialog').close();});
document.addEventListener('keydown',e=>{const inViewer=el('slideDialog').open||el('viewer').contains(document.activeElement)||el('thumbnails').contains(document.activeElement);if(inViewer&&!['SELECT','INPUT','TEXTAREA'].includes(document.activeElement.tagName)){if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}});
el('loadGame').addEventListener('click',()=>{
 const iframe=document.createElement('iframe');iframe.title='Sushi Cat Sort 在线试玩';
 iframe.src='https://html-classic.itch.zone/html/18536236/index.html?v=1785082877';iframe.allow='autoplay; fullscreen; gamepad';iframe.allowFullscreen=true;
 let loaded=false;iframe.addEventListener('load',()=>{loaded=true;el('gameStatus').textContent='游戏框架已载入';});
 el('gameMount').replaceChildren(iframe);el('gameStatus').textContent='正在载入游戏…';el('fullscreenGame').disabled=false;
 setTimeout(()=>{if(!loaded){el('gameStatus').textContent='暂未载入，请在新窗口试玩';const fallback=document.createElement('a');fallback.href='https://archieneverwake.itch.io/sushi-cat-sort';fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.className='game-fallback button primary';fallback.textContent='新窗口试玩 ↗';el('gameMount').append(fallback);}},18000);
});
el('fullscreenGame').addEventListener('click',()=>{const shell=document.querySelector('.game-shell');if(shell.requestFullscreen)shell.requestFullscreen().catch(()=>{el('gameStatus').textContent='可使用 itch.io 新窗口试玩';});});
switchDeck('proposal');
