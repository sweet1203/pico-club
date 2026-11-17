const pages=[...document.querySelectorAll('.page')];
const QUIZ = window.QUIZ || {};
const QK = window.QK || 'pico';
let QS={}; try{QS=JSON.parse(localStorage.getItem(QK)||'{}')||{};}catch(e){QS={};}
function saveQ(){try{localStorage.setItem(QK,JSON.stringify(QS));}catch(e){}}
const TOTALQ=Object.values(QUIZ).reduce((a,b)=>a+b.length,0);
const steps=document.getElementById('steps');
const stepBtns=pages.map((p,i)=>{
  const b=document.createElement('button');
  b.type='button';
  b.textContent=i?`${i}. ${p.dataset.name}`:'시작';
  b.onclick=()=>go(i);
  steps.appendChild(b);
  return b;
});
function renderQuiz(box){
  const items=QUIZ[box.dataset.quiz];
  if(!items){box.hidden=true;return;}
  box.innerHTML=`<div class="qh"><b>확인</b><span>${items.length}문제 · 고르면 바로 채점</span></div>`;
  items.forEach((it,i)=>{
    const id=box.dataset.quiz+'-'+i;
    const d=document.createElement('div');
    d.className='qi';
    d.innerHTML=`<div class="qq">${i+1}. ${it.q}</div><div class="opts">${it.o.map((t,j)=>`<button type="button" data-j="${j}">${t}</button>`).join('')}</div><div class="why"></div>`;
    const mark=(j)=>{
      d.querySelectorAll('button').forEach(b=>b.disabled=true);
      d.querySelector(`button[data-j="${it.a}"]`).classList.add('right');
      if(j!==it.a) d.querySelector(`button[data-j="${j}"]`).classList.add('wrong');
      d.classList.add('answered');
      d.querySelector('.why').textContent=(j===it.a?'맞아요. ':'정답은 「'+it.o[it.a]+'」. ')+it.w;
    };
    d.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      const j=+b.dataset.j; QS[id]=j; saveQ(); mark(j); updScore();
    });
    if(QS[id]!=null) mark(QS[id]);
    box.appendChild(d);
  });
}
function updScore(){
  const el=document.getElementById('score');
  if(!el) return;
  if(!TOTALQ){el.hidden=true;return;}
  let ok=0;
  for(const k in QUIZ) QUIZ[k].forEach((it,i)=>{if(QS[k+'-'+i]===it.a) ok++;});
  el.textContent=`퀴즈 ${ok} / ${TOTALQ}`;
}
let cur=-1;
function go(i){
  if(!Number.isFinite(i)) i=0;
  i=Math.max(0,Math.min(pages.length-1,i));
  if(i===cur) return;
  const back=i<cur;
  if(cur>=0) pages[cur].classList.remove('on','back');
  pages[i].classList.add('on');
  pages[i].classList.toggle('back',back);
  const acc=pages[i].dataset.acc||'#2f6fd0';
  document.documentElement.style.setProperty('--acc',acc);
  document.documentElement.style.setProperty('--acc-soft',acc+'1a');
  stepBtns.forEach((b,j)=>b.classList.toggle('on',j===i));
  const btn=stepBtns[i];
  steps.scrollLeft=btn.offsetLeft-steps.clientWidth/2+btn.clientWidth/2;
  document.getElementById('prog').style.width=(pages.length<2?100:(i/(pages.length-1)*100))+'%';
  document.getElementById('pg').textContent=`${i} / ${pages.length-1}`;
  document.getElementById('prev').style.visibility=i?'visible':'hidden';
  document.getElementById('next').style.visibility=i<pages.length-1?'visible':'hidden';
  cur=i;
  try{localStorage.setItem(QK+'-pos',String(i)); history.replaceState(null,'','#p'+i);}catch(e){}
  window.scrollTo(0,0);
}
document.getElementById('prev').onclick=()=>go(cur-1);
document.getElementById('next').onclick=()=>go(cur+1);
document.addEventListener('keydown',e=>{
  if(e.target.matches&&e.target.matches('input,textarea')) return;
  if(e.key==='ArrowRight') go(cur+1);
  if(e.key==='ArrowLeft') go(cur-1);
});
document.querySelectorAll('[data-quiz]').forEach(renderQuiz);
document.querySelectorAll('.copycode').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const pre=btn.parentElement.nextElementSibling;
    const text=pre.innerText.replace(/\n$/,'');
    const old=btn.textContent;
    const done=t=>{btn.textContent=t; setTimeout(()=>{btn.textContent=old;},1200);};
    const fallback=()=>{
      const area=document.createElement('textarea');
      area.value=text; area.style.position='fixed'; area.style.left='-9999px';
      document.body.appendChild(area); area.select();
      try{document.execCommand('copy'); done('복사됨');}catch(e){done('선택 후 복사');}
      area.remove();
    };
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(()=>done('복사됨')).catch(fallback);
    else fallback();
  });
});
updScore();
let start=0;
const hash=/^#p(\d+)$/.exec(location.hash);
if(hash) start=+hash[1];
else {const saved=localStorage.getItem(QK+'-pos'); if(saved!=null) start=+saved;}
go(start);
