PROJECT SAGIP-LOBO – UPDATED PHASE 1
School Action for Disaster Preparedness and Integrated Protection
Lobo Elementary School

FILES
- index.html: main app and five component pages
- styles.css: responsive mobile and desktop design
- app.js: navigation, local demo forms, local checklist, exports
- manifest.webmanifest: installable PWA metadata
- service-worker.js: offline caching of app shell
- assets/project-sagip-logo.png: retain/upload your approved logo here

FIVE COMPONENTS
1. SAGIP-INFO – centralized disaster information hub
2. SAGIP-ALERTO – emergency contacts, communication guidance, and response procedures
3. SAGIP-BANTAY – school hazard awareness, mapping, and student-led safety reporting
4. SAGIP-KAAGAPAY – family and community preparedness and coordination
5. SAGIP-SIGURADO – monitoring, evaluation, and continuous improvement

UPLOAD INSTRUCTIONS
1. Keep your existing GitHub repository PROJECT-SAGIP.
2. Download and extract this ZIP on your Android phone.
3. In GitHub, upload/replace index.html, styles.css, app.js, manifest.webmanifest, service-worker.js, and README.txt to the repository root.
4. Keep the existing assets folder and the uploaded project-sagip-logo.png inside it. Do not delete your logo.
5. Commit the updated files to main. GitHub Pages should redeploy automatically.

IMPORTANT LIMITATIONS
- This is a Phase 1 prototype, not a production-ready emergency management system.
- Forms, checklist, and records are stored only in the current browser/device using localStorage. They do not synchronize to other users or to the school.
- The role selector is not authentication or access control. Do not enter sensitive personal or learner information.
- Offline caching requires the first successful online visit over HTTPS. Local browser storage is device/browser-specific.
- Emergency contact numbers, school evacuation maps, assembly areas, and response procedures are placeholders or general reminders until validated and approved by school personnel and partner agencies.
- This app does not replace official emergency response systems, school protocols, or instructions from authorities.
- Before actual implementation, add secure authentication, database security rules, server-side report submission, offline queue/synchronization, audit logs, backups, privacy notice, and retention procedures.

PHASE 2 – SAGIP-ADMIN
See FIREBASE_SETUP.txt. Firebase must be configured and the supplied Firestore and Storage security rules deployed before administrator login/content management works. Never publish private service-account keys.

PHASE 2 – SAGIP-ADMIN
See FIREBASE_SETUP.txt for Firebase Authentication/Firestore setup and free-platform resource-link workflow. Cloud Storage direct uploads are intentionally excluded to avoid requiring Firebase Blaze billing.


PHASE 2 – SAGIP-ADMIN
- admin.js: Firebase Authentication and content-management interface
- firestore.rules: starter Firestore access rules
- storage.rules: starter Storage upload/read rules
- FIREBASE_SETUP.txt: setup and account provisioning guide

SECURITY AND SYNC NOTES
Firebase must be configured before administrator sign-in works. Only active School Head and DRRM Coordinator accounts with matching Firestore user role documents are authorized by the starter rules. There is no public sign-up.
Published content and its attachments are publicly readable. Do not upload confidential or sensitive personal information.
Firestore offline persistence can cache previously read content and queue supported document writes while offline. File uploads still require internet in this version. Phase 1 hazard observations remain device-local until a later shared-report integration.
