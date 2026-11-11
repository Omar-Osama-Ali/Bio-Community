
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const root = document.documentElement.dataset.root || ".";
const asset = p => `${root}/${p}`;
const page = document.body.dataset.page || "";
const navItems=[["HOME","index.html","home"],["ABOUT","about.html","about"],["EXPERIMENTS","experiments.html","experiments"],["BIO SHORTS","shorts.html","shorts"],["MICROSCOPIC WORLD","microscopy.html","microscopy"],["ACTIVITIES","activities.html","activities"]];
function header(){
 const links=navItems.map(([label,url,id])=>`<a href="${root}/${url}" ${page===id?'aria-current="page"':""}>${label}</a>`).join("");
 return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="container header-inner"><a class="brand" href="${root}/index.html"><img src="${asset("assets/images/branding/bio-community-logo.jpg")}" alt="BIO COMMUNITY logo"><span>BIO COMMUNITY</span></a><button class="menu-toggle" aria-label="Open navigation" aria-expanded="false">☰</button><nav class="nav" aria-label="Main navigation">${links}</nav></div></header>`;
}
function footer(){
 return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div><div class="footer-brand"><img src="${asset("assets/images/branding/bio-community-logo.jpg")}" alt=""><div><strong>BIO COMMUNITY</strong><br><small>Where Biology Comes to Life.</small></div></div><p style="max-width:340px;margin-top:18px">Discover. Explore. Experiment. A student community exploring Biology through observation and hands-on learning.</p></div><div><h3>Explore</h3><div class="footer-links">${navItems.slice(1).map(x=>`<a href="${root}/${x[1]}">${x[0]}</a>`).join("")}</div></div><div><h3>Information</h3><div class="footer-links"><a href="${root}/privacy.html">Privacy & Media Information</a><a href="${root}/404.html">Page not found</a></div><div style="display:flex;align-items:center;gap:10px;margin-top:20px"><img class="school-mark" src="${asset("assets/images/branding/school-logo.jpg")}" alt="School logo"><small>Institutional identity</small></div></div></div><div class="footer-bottom"><span>© <span id="year"></span> BIO COMMUNITY</span><span>Discover. Explore. Experiment.</span></div></div></footer><button class="top-link" aria-label="Back to top">↑</button>`;
}
async function data(name){const r=await fetch(asset(`data/${name}.json`));if(!r.ok)throw new Error(`Could not load ${name}`);return r.json()}
function experimentCard(e){
 if(e.status!=="published")return `<article class="card"><div class="card-media coming"><div class="coming-inner"><span class="coming-label">Coming soon</span><p class="eyebrow" style="margin:14px 0 0">Experiment ${e.number}</p></div></div><div class="card-body"><div class="card-meta">In preparation</div><h3>${e.title}</h3><p>${e.description}</p></div></article>`;
 return `<article class="card"><a href="${root}/experiment.html?id=${e.id}"><div class="card-media"><img loading="lazy" src="${asset(e.thumbnail)}" alt="Video preview for ${e.title}"></div></a><div class="card-body"><div class="card-meta">Experiment ${e.number} · ${e.duration}</div><h3>${e.title}</h3><p>${e.description}</p><a class="text-link" href="${root}/experiment.html?id=${e.id}">Watch experiment →</a></div></article>`;
}
function shortCard(s){
 if(s.status!=="published")return `<article class="short-card"><div class="short-placeholder"><div><span class="coming-label">Coming soon</span><p class="eyebrow" style="margin:18px 0 0">Experiment ${s.parentExperimentId.slice(-2)}</p><strong>Short ${s.number}</strong></div></div><div class="short-info"><h3>Short ${s.number}</h3><p>Reserved for a future release.</p></div></article>`;
 return `<article class="short-card"><video controls playsinline muted preload="none" poster="${asset(s.thumbnail)}" data-short-video><source src="${asset(s.video)}" type="video/mp4"></video><div class="short-info"><div class="card-meta" style="color:#d8e2d5">EXPERIMENT 01 · SHORT ${s.number}</div><h3>${s.title}</h3><p>${s.description}</p><a class="btn" href="${root}/experiment.html?id=${s.parentExperimentId}">Watch full experiment</a></div></article>`;
}
function setup(){
 document.body.insertAdjacentHTML("afterbegin",header());document.body.insertAdjacentHTML("beforeend",footer());
 const toggle=$(".menu-toggle"),nav=$(".nav");
 toggle?.addEventListener("click",()=>{let open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");toggle.textContent=open?"×":"☰"});
 $("#year") && ($("#year").textContent=new Date().getFullYear());
 const top=$(".top-link");window.addEventListener("scroll",()=>top?.classList.toggle("visible",window.scrollY>600),{passive:true});top?.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
 // Keep only the most visible BIO Short playing; playback remains user initiated.
 const vids=$$("[data-short-video]");if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting&&e.target instanceof HTMLVideoElement)e.target.pause()}),{threshold:.35});vids.forEach(v=>io.observe(v))}
 vids.forEach(v=>v.addEventListener("play",()=>vids.filter(x=>x!==v).forEach(x=>x.pause())));
}
async function renderExperiments(target,limit=6){const es=await data("experiments");$(target).innerHTML=es.slice(0,limit).map(experimentCard).join("")}
async function renderShorts(target,grouped=false){
 const ss=await data("shorts"),es=await data("experiments");
 if(!grouped){$(target).innerHTML=ss.map(shortCard).join("");return}
 $(target).innerHTML=es.map(e=>`<div class="short-group"><div><span class="eyebrow">Experiment ${e.number}</span><h2 style="font-size:1.65rem;margin:5px 0">${e.title}</h2></div>${e.status==="published"?`<a class="text-link" href="${root}/experiment.html?id=${e.id}">Full experiment →</a>`:"<span class='coming-label'>Coming soon</span>"}</div>${ss.filter(s=>s.parentExperimentId===e.id).map(shortCard).join("")}`).join("");
}
async function renderSpecimens(){const items=await data("specimens");$("#specimen-grid").innerHTML=items.map(s=>`<article class="specimen"><button class="gallery-trigger" data-image="${asset(s.image)}" data-caption="${s.name}"><img loading="lazy" src="${asset(s.image)}" alt="${s.description}"></button><div class="card-body"><div class="card-meta">Microscope image</div><h3>${s.name}</h3><p>${s.description}</p>${s.magnification?`<p>Magnification: ${s.magnification}</p>`:""}</div></article>`).join("");}
function setupModal(){const m=$("#image-modal");if(!m)return;$$("[data-image]").forEach(b=>b.addEventListener("click",()=>{m.setAttribute("aria-hidden","false");$("#modal-image").src=b.dataset.image;$("#modal-caption").textContent=b.dataset.caption;$(".modal-close").focus()}));const close=()=>{m.setAttribute("aria-hidden","true");$("#modal-image").src=""};$(".modal-close").addEventListener("click",close);m.addEventListener("click",e=>{if(e.target===m)close()});document.addEventListener("keydown",e=>{if(e.key==="Escape")close()})}
async function renderActivities(){const items=await data("activities");$("#activity-grid").innerHTML=items.map(a=>`<article class="card"><div class="card-media"><video class="activity-video" controls playsinline preload="none" poster="${asset(a.poster)}"><source src="${asset(a.video)}" type="video/mp4"></video></div><div class="card-body"><div class="card-meta">Community video</div><h3>${a.title}</h3><p>Authentic footage supplied for BIO COMMUNITY.</p></div></article>`).join("")}
async function renderExperimentDetail(){
 const id=new URLSearchParams(location.search).get("id")||"experiment-01";const es=await data("experiments");const e=es.find(x=>x.id===id);const host=$("#experiment-detail");
 if(!e){host.innerHTML=`<div class="empty-state"><h2>Experiment not found</h2><a class="btn" href="${root}/experiments.html">Back to experiments</a></div>`;return}
 if(e.status!=="published"){host.innerHTML=`<div class="empty-state"><span class="coming-label">Coming soon</span><h1 style="font-size:3rem;margin:22px auto">Experiment ${e.number}</h1><p class="lead" style="margin-inline:auto">This experiment is being prepared. Its video and verified scientific information will appear here when published.</p><a class="btn" href="${root}/experiments.html">Explore available experiments</a></div>`;return}
 const ss=(await data("shorts")).filter(s=>s.parentExperimentId===id);
 host.innerHTML=`<div class="detail-grid"><div class="detail-main"><div class="card-meta">EXPERIMENT ${e.number} · ${e.duration}</div><h1 style="font-size:clamp(2.8rem,6vw,5rem)">${e.title}</h1><p class="lead">${e.description}</p><div class="video-wrap"><video controls playsinline preload="none" poster="${asset(e.thumbnail)}"><source src="${asset(e.video)}" type="video/mp4"></video></div><div class="section" style="padding:44px 0"><h2 style="font-size:2.2rem">About this video</h2><p class="muted">The supplied full-length video is published here. The experiment title, objective, materials, procedure, observations, and scientific explanation have not yet been provided as verified text.</p><div class="notice">Scientific information will be added after it has been confirmed by the community.</div></div><h2 style="font-size:2.2rem">Associated BIO SHORTS</h2><div class="shorts-row">${ss.map(shortCard).join("")}</div></div><aside class="detail-aside"><span class="eyebrow">Video information</span><h3>Experiment ${e.number}</h3><p class="muted">Published video</p><p><strong>Duration</strong><br>${e.duration}</p><a class="btn" href="${root}/shorts.html" style="width:100%">Explore BIO Shorts</a></aside></div>`;
}
setup();
(async()=>{try{
 if(page==="home"){await renderExperiments("#featured-experiments",3);await renderShorts("#home-shorts");}
 if(page==="experiments")await renderExperiments("#experiments-grid");
 if(page==="shorts")await renderShorts("#shorts-feed",true);
 if(page==="microscopy"){await renderSpecimens();setupModal()}
 if(page==="activities")await renderActivities();
 if(page==="experiment")await renderExperimentDetail();
}catch(e){console.error(e);const el=$("[data-render-error]");if(el)el.textContent="Some content could not be loaded. Please refresh the page."}})();
