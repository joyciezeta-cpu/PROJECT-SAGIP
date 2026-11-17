PROJECT KALASAG – PHASE 1 STARTER
Lobo Elementary School

WHAT THIS VERSION INCLUDES
- Responsive website interface for desktop and mobile.
- Installable PWA structure (Android installation is available when hosted over HTTPS in a compatible browser).
- Emergency preparedness information and DRRM learning hub.
- Local incident reporting and risk-assessment demo forms.
- Local dashboard counts and CSV export of incident reports.
- Offline caching of the app shell using a service worker.
- Role preview selector for demonstrating the planned user experience.

IMPORTANT LIMITATIONS
1. This is a Phase 1 prototype, not a production-ready emergency management system.
2. The role selector is only a UI preview. It is NOT authentication or access control.
3. Incident and risk entries are stored only in the browser/device using localStorage.
4. Reports do NOT sync to the school, barangay, Firebase, or emergency responders.
5. Offline caching makes the app shell and static guides available after the first successful online visit. Forms save locally on that same browser/device.
6. Do not enter sensitive personal information or real learner records.
7. The emergency contacts, evacuation routes, assembly areas, and school-specific plans must be verified and inserted by authorized school officials before public use.
8. Test all emergency instructions with the school DRRM team and local authorities before implementation.

HOW TO PREVIEW
- Open index.html in a modern browser for a basic local preview.
- Service worker/PWA installation requires HTTPS or localhost; opening the file directly does not enable PWA installation or offline caching.
- To publish free, create a public GitHub repository and upload all files while preserving the folder structure. Enable GitHub Pages in repository Settings > Pages and use the generated HTTPS website address.
- Visit the published website once while online. On a supported Android browser, use the browser menu and choose Install app or Add to Home screen.

NEXT PHASE
- Add real user authentication and role-based access rules.
- Configure Firebase database and security rules.
- Build a reliable offline queue and conflict-aware synchronization.
- Add administrator review and status tracking for incident reports.
- Add audit logs, backups, privacy notice, and retention rules.
- Test with school and barangay representatives before deployment.
