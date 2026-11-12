(function(){
const K='fr_x';let X={stars:0,days:0,last:'',row:0,bad:0,wrong:[]};
try{Object.assign(X,JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){}
const sv=()=>{try{localStorage.setItem(K,JSON.stringify(X))}catch(e){}};
const day=d=>d.toISOString().slice(0,10);
const medal=()=>X.stars>=100?'💎 الماس':X.stars>=60?'🥇 طلایی':X.stars>=30?'🥈 نقره‌ای':X.stars>=10?'🥉 برنزی':'هنوز نه';
const hc=document.createElement('div');hc.className='card';
document.querySelector('#sH .grid').after(hc);
const to=document.createElement('div');
to.style.cssText='position:fixed;bottom:96px;left:12px;right:12px;background:#333;color:#fff;border-radius:14px;padding:12px;z-index:50;display:none;text-align:center;line-height:1.9';
document.body.appendChild(to);
function say(t){to.innerHTML='🍕 '+t;to.style.display='block';clearTimeout(say.t);say.t=setTimeout(()=>to.style.display='none',5000);}
function card(){setH(hc,`<h2>🏆 ستاره‌ها و مدال</h2><div class="stats"><div><b>${X.stars}</b>ستاره ⭐</div><div><b>${X.days}</b>روز پشت‌سرهم 🔥</div><div><b style="font-size:1.1em">${medal()}</b>مدال</div></div><small style="color:#888">نسخه ۴</small>`);}
function beep(ok){try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=ok?880:220;g.gain.value=.15;o.start();o.stop(c.currentTime+(ok?.18:.35));}catch(e){}}
const eq=(u,n,d)=>d!==0&&imp(u)*d===n*u.d;
function diag(a,b,op,u){
  const n1=imp(a),d1=a.d,n2=imp(b),d2=b.d;
  if(op==='+'&&eq(u,n1+n2,d1+d2))return 'مخرج‌ها را هم با هم جمع کردی. مخرج‌ها جمع نمی‌شوند؛ اول باید مخرج‌ها را یکی کنی.';
  if(op==='-'&&d1!==d2&&eq(u,n1-n2,d1-d2))return 'مخرج‌ها را از هم کم کردی. اول باید مخرج‌ها را یکی کنی، بعد فقط صورت‌ها را کم کنی.';
  if(op==='×'&&eq(u,n1*d2,d1*n2))return 'کسر دوم را وارونه کردی. وارونه کردن فقط در تقسیم لازم است.';
  if(op==='÷'&&eq(u,n1*n2,d1*d2))return 'ضرب کردی ولی کسر دوم را وارونه نکردی. در تقسیم اول کسر دوم را وارونه کن.';
  if(op==='÷'&&eq(u,n2*d1,d2*n1))return 'کسر اول را وارونه کردی. وارونه کردن فقط برای کسر دوم است.';
  return '';
}
const old=$('chk').onclick;
$('chk').onclick=function(){
  const u=parse($('ans').value),first=!answered;
  old.call(this);
  if(!u||!first)return;
  const r=solve(cur.a,cur.b,op,kind==='word'),ok=imp(u)*r.sd===r.sn*u.d;
  const t=day(new Date());
  if(X.last!==t){const y=new Date();y.setDate(y.getDate()-1);X.days=X.last===day(y)?X.days+1:1;X.last=t;}
  let msg;
  if(ok){X.stars+=1+(X.row>=2?1:0);X.row++;X.bad=0;
    const k=JSON.stringify([cur.a,cur.b,op]);X.wrong=X.wrong.filter(w=>JSON.stringify([w.a,w.b,w.op])!==k);
    beep(1);msg=['آفرین!','عالی بود!','دمت گرم، درست بود!'][Math.floor(Math.random()*3)]+(X.row>=3?' '+X.row+' جواب درست پشت‌سرهم 🔥':'');}
  else{X.row=0;X.bad++;X.wrong.push({a:cur.a,b:cur.b,op,kind});X.wrong=X.wrong.slice(-30);beep(0);
    const d=diag(cur.a,cur.b,op,u);msg=d||'اشکال ندارد! حل را ببین و دوباره امتحان کن.';
    if(d)setH($('fbP'),$('fbP').innerHTML+'<div class="st">🔎 '+d+'</div>');}
  if(X.row>=3&&S.lvl<2){S.lvl++;X.row=0;msg+=' سطح سخت‌تر شد 🚀';}
  else if(X.bad>=2&&S.lvl>0){S.lvl--;X.bad=0;msg+=' سطح آسان‌تر شد تا راحت‌تر یاد بگیری.';}
  save();sv();BN.forEach(f=>f());card();say(msg);
};
const rb=document.createElement('button');rb.className='go o';rb.textContent='🔁 تمرین اشتباه‌های قبلی';
$('nxt').after(rb);
rb.onclick=function(){
  if(!X.wrong.length){say('اشتباهی نداری! آفرین 🎉');return;}
  const it=X.wrong[Math.floor(Math.random()*X.wrong.length)],og=gen;
  op=it.op;kind=it.kind;
  document.querySelectorAll('#ops button').forEach(b=>b.classList.toggle('on',b.dataset.v===op));
  document.querySelectorAll('#kinds button').forEach(b=>b.classList.toggle('on',b.dataset.v===kind));
  gen=()=>it;newQ();gen=og;
};
card();
})();
