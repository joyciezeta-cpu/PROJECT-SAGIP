// Firebase-powered SAGIP-ADMIN. Configure firebaseConfig in this file using your own Firebase web app settings.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABaTaBAsRwiWI3SytQKLB7MxSkLqqKOFo",
  authDomain: "project-sagip-lobo.firebaseapp.com",
  projectId: "project-sagip-lobo",
  storageBucket: "project-sagip-lobo.firebasestorage.app",
  messagingSenderId: "413881449792",
  appId: "1:413881449792:web:123035fc686728eb070ea5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

};
const $ = id => document.getElementById(id);
const setupNotice=$("adminSetupNotice"), signedOut=$("adminSignedOut"), signedIn=$("adminSignedIn");
const configured = firebaseConfig.apiKey.startsWith("AIza") && !firebaseConfig.projectId.includes("PASTE_");
let auth,db,currentUser=null,currentRole=null,editing=null;
const componentNames={info:"SAGIP-INFO",alerto:"SAGIP-ALERTO",bantay:"SAGIP-BANTAY",kaagapay:"SAGIP-KAAGAPAY",sigurado:"SAGIP-SIGURADO"
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function say(id,msg){if($(id))$(id).textContent=msg}
if(!configured){setupNotice.classList.remove("hidden");say("adminLoginMessage","Firebase has not been configured yet.");}
else{
  setupNotice.classList.add("hidden");
  const app=initializeApp(firebaseConfig);
  auth=getAuth(app);
  db=initializeFirestore(app,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})});
  onAuthStateChanged(auth,async user=>{
    currentUser=user;currentRole=null;
    if(!user){signedOut.classList.remove("hidden");signedIn.classList.add("hidden");return;}
    try{
      const profile=await getDoc(doc(db,"users",user.uid));
      const role=profile.exists()?profile.data().role:null;
      const active=profile.exists() && profile.data().active===true;
      if(!active || !["School Head","DRRM Coordinator"].includes(role)){
        await signOut(auth);say("adminLoginMessage","Access denied. This account is not an active School Head or DRRM Coordinator account.");return;
      }
      currentRole=role;signedOut.classList.add("hidden");signedIn.classList.remove("hidden");
      $("adminIdentity").textContent=user.email+" • "+role;
      await loadAdminContent();await loadPublishedContent();
    }catch(err){say("adminLoginMessage","Could not verify administrator permissions. Check Firebase security rules and user profile.");}
  });
}
$("adminLoginForm")?.addEventListener("submit",async e=>{
 e.preventDefault();if(!configured){say("adminLoginMessage","Firebase setup is required. Follow FIREBASE_SETUP.txt.");return;}
 const fd=new FormData(e.currentTarget);
 try{await signInWithEmailAndPassword(auth,fd.get("email"),fd.get("password"));say("adminLoginMessage","Signed in. Verifying administrator permissions…");}
 catch(err){say("adminLoginMessage","Sign-in failed. Check the email/password and Firebase Authentication setup.");}
});
$("adminSignOut")?.addEventListener("click",()=>signOut(auth));
$("contentCancel")?.addEventListener("click",()=>resetForm());
$("adminFilter")?.addEventListener("change",loadAdminContent);
function resetForm(){editing=null;$("contentForm").reset();$("contentForm").elements.id.value="";$("contentFormTitle").textContent="Add information";}
$("contentForm")?.addEventListener("submit",async e=>{
 e.preventDefault();if(!currentUser||!currentRole)return;
 const f=e.currentTarget,fd=new FormData(f);
 const resourceUrl=String(fd.get("resourceUrl")||"").trim();
 if(resourceUrl && !/^https:\/\/\S+$/i.test(resourceUrl)){say("contentSaveMessage","Resource link must begin with https://");return;}
 const data={component:fd.get("component"),type:fd.get("type"),title:fd.get("title").trim(),body:fd.get("body").trim(),status:fd.get("status"),resourceUrl,resourceLabel:String(fd.get("resourceLabel")||"").trim(),updatedAt:serverTimestamp(),updatedBy:currentUser.uid,updatedByRole:currentRole};
 try{
  if(editing){await updateDoc(doc(db,"content",editing.id),data);}
  else{data.createdAt=serverTimestamp();data.createdBy=currentUser.uid;await addDoc(collection(db,"content"),data);}
  say("contentSaveMessage","Saved successfully. Published items will appear in the public component pages when online.");
  resetForm();await loadAdminContent();await loadPublishedContent();
 }catch(err){say("contentSaveMessage","Save failed. Check internet connection, Firebase setup, and security rules.");}
});
async function loadAdminContent(){
 if(!currentUser)return;
 const host=$("adminContentList");host.textContent="Loading…";
 try{
  const snap=await getDocs(query(collection(db,"content"),orderBy("updatedAt","desc")));
  const filter=$("adminFilter").value;
  const docs=snap.docs.filter(d=>filter==="all"||d.data().component===filter);
  host.innerHTML=docs.length?docs.map(d=>{const x=d.data();return `<article class="admin-record"><h3>${esc(x.title)}</h3><small>${esc(componentNames[x.component]||x.component)} • ${esc(x.type)} • <span class="status-pill ${esc(x.status)}">${esc(x.status)}</span></small><p>${esc(x.body)}</p>${x.resourceUrl?`<a href="${esc(x.resourceUrl)}" target="_blank" rel="noopener">Open resource: ${esc(x.resourceLabel||"View material")}</a>`:""}<div class="record-actions"><button class="btn secondary" data-edit="${d.id}">Edit</button><button class="btn secondary" data-toggle="${d.id}" data-status="${esc(x.status)}">${x.status==="published"?"Unpublish":"Publish"}</button><button class="btn secondary" data-archive="${d.id}">Archive</button></div></article>`}).join(""):"No content records yet.";
  host.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>editRecord(b.dataset.edit,docs.find(d=>d.id===b.dataset.edit)));
  host.querySelectorAll("[data-toggle]").forEach(b=>b.onclick=()=>changeStatus(b.dataset.toggle,b.dataset.status==="published"?"draft":"published"));
  host.querySelectorAll("[data-archive]").forEach(b=>b.onclick=()=>archiveRecord(b.dataset.archive));
 }catch(err){host.textContent="Could not load content. Check Firestore configuration and rules.";}
}
async function editRecord(id,snap){editing={id,data:snap.data()};const x=snap.data(),f=$("contentForm");for(const k of ["component","type","title","body","status","resourceUrl","resourceLabel"])f.elements[k].value=x[k]||"";f.elements.id.value=id;$("contentFormTitle").textContent="Edit information";say("contentSaveMessage","Editing selected record. Select a new attachment only if you want to replace the existing one.");window.scrollTo({top:$("contentForm").getBoundingClientRect().top+scrollY-90,behavior:"smooth"});}
async function changeStatus(id,status){try{await updateDoc(doc(db,"content",id),{status,updatedAt:serverTimestamp(),updatedBy:currentUser.uid});await loadAdminContent();await loadPublishedContent();}catch{alert("Could not update status. Check your connection and permissions.");}}
async function archiveRecord(id){if(!confirm("Archive this item? It will no longer appear in public component pages."))return;try{await updateDoc(doc(db,"content",id),{status:"archived",updatedAt:serverTimestamp(),updatedBy:currentUser.uid});await loadAdminContent();await loadPublishedContent();}catch{alert("Could not archive this item.");}}
async function loadPublishedContent(){
 for(const key of Object.keys(componentNames)){const host=$("published-"+key);if(!host)continue;host.innerHTML='<p class="muted">Loading approved information…</p>';}
 if(!configured)return;
 try{
  const snap=await getDocs(query(collection(db,"content"),where("status","==","published")));
  for(const key of Object.keys(componentNames)){
   const host=$("published-"+key),items=snap.docs.filter(d=>d.data().component===key).map(d=>d.data());
   host.innerHTML=items.length?`<h2>Published information</h2>`+items.map(x=>`<article class="published-card"><span class="meta">${esc(x.type)} • ${x.updatedAt?.toDate?x.updatedAt.toDate().toLocaleDateString():""}</span><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p>${x.resourceUrl?`<a href="${esc(x.resourceUrl)}" target="_blank" rel="noopener">Open ${esc(x.resourceLabel||"resource")}</a>`:""}</article>`).join(""):"";
  }
 }catch(err){for(const key of Object.keys(componentNames)){const host=$("published-"+key);if(host)host.innerHTML='<p class="muted">Published online content will appear here after Firebase is configured and connected.</p>';}}
}
