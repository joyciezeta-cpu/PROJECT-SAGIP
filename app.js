const DB={hazards:"sagip_hazards_v1",activities:"sagip_activities_v1",family:"sagip_family_v1"};
const $=id=>document.getElementById(id);
const pages=["home","info","alerto","bantay","kaagapay","sigurado","about"];
function get(key){try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return []}}
function put(key,val){localStorage.setItem(key,JSON.stringify(val))}
function safe(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function go(page){if(!pages.includes(page))page="home";document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("active",a.dataset.page===page));$("sidebar").classList.remove("open");history.replaceState(null,"","#"+page);refresh();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();go(a.dataset.page)}));
document.querySelectorAll('a[href^="#"]:not(nav a)').forEach(a=>a.addEventListener("click",e=>{let p=a.getAttribute("href").slice(1);if(pages.includes(p)){e.preventDefault();go(p)}}));
$("menuBtn").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
function connection(){ $("connection").textContent=navigator.onLine?"● Online":"● Offline"; }
window.addEventListener("online",connection);window.addEventListener("offline",connection);
function refresh(){
 const h=get(DB.hazards),a=get(DB.activities),f=get(DB.family);
 $("hazardCount").textContent=h.length;$("activityCount").textContent=a.length;$("familyCount").textContent=f.length+"/5";
 $("hazardList").innerHTML=h.length?h.slice().reverse().map(x=>`<div class="saved-item"><b>${safe(x.category)} — ${safe(x.area)}</b><small>${safe(x.date)} • ${safe(x.reporter)}</small><p>${safe(x.details)}</p></div>`).join(""):"No observations saved on this device.";
 $("activityList").innerHTML=a.length?a.slice().reverse().map(x=>`<div class="saved-item"><b>${safe(x.title)}</b><small>${safe(x.date)} • ${safe(x.partner)} • ${safe(x.type)}</small><p>${safe(x.notes)}</p></div>`).join(""):"No activity drafts saved on this device.";
}
function values(form){return Object.fromEntries(new FormData(form).entries())}
$("hazardForm").addEventListener("submit",e=>{e.preventDefault();let all=get(DB.hazards);all.push({...values(e.currentTarget),savedAt:new Date().toLocaleString()});put(DB.hazards,all);e.currentTarget.reset();$("hazardMsg").textContent="Safety observation saved on this device only. It has not been sent to school personnel.";refresh()});
$("activityForm").addEventListener("submit",e=>{e.preventDefault();let all=get(DB.activities);all.push({...values(e.currentTarget),savedAt:new Date().toLocaleString()});put(DB.activities,all);e.currentTarget.reset();$("activityMsg").textContent="Activity draft saved on this device only.";refresh()});
function csvDownload(rows,name){if(!rows.length)return false;let keys=[...new Set(rows.flatMap(Object.keys))];let csv=[keys.join(","),...rows.map(r=>keys.map(k=>'"'+String(r[k]??"").replace(/"/g,'""')+'"').join(","))].join("\n");let url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));let a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);return true}
$("exportHazards").addEventListener("click",()=>{if(!csvDownload(get(DB.hazards),"sagip-bantay-observations.csv"))$("hazardMsg").textContent="No observations to export."});
$("exportAll").addEventListener("click",()=>{let data={project:"PROJECT SAGIP-LOBO",exportedAt:new Date().toISOString(),hazardObservations:get(DB.hazards),communityActivities:get(DB.activities),familyChecklist:get(DB.family)};let url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));let a=document.createElement("a");a.href=url;a.download="sagip-lobo-monitoring-records.json";a.click();URL.revokeObjectURL(url);$("exportMsg").textContent="Local records exported. Store the file securely."});
document.querySelectorAll("[data-check]").forEach(el=>{let saved=get(DB.family);el.checked=saved.includes(el.dataset.check);el.addEventListener("change",()=>{let current=get(DB.family);current=el.checked?[...new Set([...current,el.dataset.check])]:current.filter(x=>x!==el.dataset.check);put(DB.family,current);$("checkMsg").textContent="Family checklist updated on this device.";refresh()})});
function registerSW(){if("serviceWorker"in navigator&&location.protocol!=="file:")navigator.serviceWorker.register("./service-worker.js").catch(()=>{})}
connection();refresh();go((location.hash||"#home").slice(1));registerSW();
