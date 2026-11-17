const STORE = {incidents:"kalasag_incidents_v1", risks:"kalasag_risks_v1"};
const $ = (id) => document.getElementById(id);
const pages = ["home","about","emergency","learning","incident","risk","monitoring","contacts"];
let deferredInstallPrompt = null;

function readStore(key){try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return []}}
function writeStore(key,value){localStorage.setItem(key,JSON.stringify(value))}
function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function showPage(page){
  if(!pages.includes(page)) page="home";
  document.querySelectorAll(".page").forEach(el=>el.classList.toggle("active",el.id===`page-${page}`));
  document.querySelectorAll(".nav-link").forEach(el=>el.classList.toggle("active",el.dataset.page===page));
  $("sidebar").classList.remove("open");
  $("menuBtn").setAttribute("aria-expanded","false");
  if(location.hash!==`#${page}`) history.replaceState(null,"",`#${page}`);
  renderLists();
  window.scrollTo({top:0,behavior:"smooth"});
}
function accessForRole(){
  const role=$("roleSelect").value;
  document.querySelectorAll("[data-access]").forEach(el=>{
    const type=el.dataset.access;
    const allowed = type==="report" ? role!=="public" : type==="staff" ? ["teacher","drrm","admin"].includes(role) : ["barangay","teacher","drrm","admin"].includes(role);
    el.classList.toggle("hidden",!allowed);
  });
  const current=(location.hash||"#home").slice(1);
  if(current==="risk" && !["teacher","drrm","admin"].includes(role)) showPage("home");
  if(current==="monitoring" && !["barangay","teacher","drrm","admin"].includes(role)) showPage("home");
  if(current==="incident" && role==="public") showPage("home");
}
function updateConnection(){
  const online=navigator.onLine;
  $("connection").classList.toggle("online",online);
  $("connection").innerHTML=`<i></i> ${online?"Online":"Offline"} mode`;
  $("monitorConnection").textContent=online?"Online":"Offline";
}
function renderLists(){
  const incidents=readStore(STORE.incidents), risks=readStore(STORE.risks);
  $("incidentCount").textContent=incidents.length;
  $("riskCount").textContent=risks.length;
  $("reportList").innerHTML=incidents.length?incidents.slice().reverse().map(x=>`<div class="report-item"><strong>${escapeHTML(x.type)} — ${escapeHTML(x.location)}</strong><small>${escapeHTML(x.date)} • ${escapeHTML(x.urgency)} • ${escapeHTML(x.savedAt)}</small><p>${escapeHTML(x.details)}</p></div>`).join(""):'<p class="muted">No reports saved on this device.</p>';
  $("riskList").innerHTML=risks.length?risks.slice().reverse().map(x=>`<div class="report-item"><strong>${escapeHTML(x.hazard)} — ${escapeHTML(x.area)}</strong><small>${escapeHTML(x.date)} • ${escapeHTML(x.condition)}</small><p>${escapeHTML(x.action)}</p></div>`).join(""):'<p class="muted">No entries saved on this device.</p>';
}
function formObject(form){return Object.fromEntries(new FormData(form).entries())}
$("incidentForm").addEventListener("submit",e=>{
  e.preventDefault(); const data=formObject(e.currentTarget);
  data.savedAt=new Date().toLocaleString(); data.id=crypto.randomUUID?crypto.randomUUID():String(Date.now());
  const all=readStore(STORE.incidents); all.push(data); writeStore(STORE.incidents,all);
  e.currentTarget.reset(); $("formMessage").textContent="Report saved on this device. It has NOT been sent to the school or emergency responders.";
  renderLists();
});
$("riskForm").addEventListener("submit",e=>{
  e.preventDefault(); const data=formObject(e.currentTarget);
  data.savedAt=new Date().toLocaleString(); data.id=crypto.randomUUID?crypto.randomUUID():String(Date.now());
  const all=readStore(STORE.risks); all.push(data); writeStore(STORE.risks,all);
  e.currentTarget.reset(); $("riskMessage").textContent="Checklist entry saved on this device only.";
  renderLists();
});
$("exportReports").addEventListener("click",()=>{
  const rows=readStore(STORE.incidents); if(!rows.length){$("formMessage").textContent="There are no incident reports to export.";return;}
  const keys=["type","location","date","urgency","details","reporter","contact","savedAt"];
  const csv=[keys.join(","),...rows.map(r=>keys.map(k=>`"${String(r[k]??"").replace(/"/g,'""')}"`).join(","))].join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}); const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="kalasag-local-incident-reports.csv";a.click();URL.revokeObjectURL(url);
});
document.querySelectorAll(".nav-link").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();showPage(a.dataset.page)}));
document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(a=>a.addEventListener("click",e=>{const p=a.getAttribute("href").slice(1);if(pages.includes(p)){e.preventDefault();showPage(p)}}));
$("roleSelect").addEventListener("change",accessForRole);
$("menuBtn").addEventListener("click",()=>{const open=$("sidebar").classList.toggle("open");$("menuBtn").setAttribute("aria-expanded",String(open))});
window.addEventListener("online",updateConnection);window.addEventListener("offline",updateConnection);
window.addEventListener("hashchange",()=>showPage((location.hash||"#home").slice(1)));
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;$("installBtn").classList.remove("hidden")});
$("installBtn").addEventListener("click",async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$("installBtn").classList.add("hidden")});
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}))}
updateConnection();accessForRole();showPage((location.hash||"#home").slice(1));renderLists();
