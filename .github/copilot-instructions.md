<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements
<!-- E-Cell FCRIT website with Next.js 14, TypeScript, Tailwind CSS, Sanity CMS -->

- [x] Scaffold the Project
<!-- Next.js 14 project successfully created with TypeScript, Tailwind, ESLint, App Router -->

- [x] Customize the Project
<!-- ✅ COMPLETED: Website fully customized with all required components, pages, and data structures. Features include:
- Complete homepage with all sections (Hero, About, Counter, Events, Team, Testimonials, Contact)
- Dedicated Events page with filtering and detailed event information
- Comprehensive Team page with current members, past alumni, and faculty advisors
- About page with mission, vision, values, achievements, and timeline
- Proper TypeScript interfaces and data management
- Responsive design with modern glassmorphism effects
- Working forms with validation
- All E-Cell FCRIT requirements implemented
  -->

- [x] Install Required Extensions
<!-- ONLY install extensions provided mentioned in the get_project_setup_info. Skip this step otherwise and mark as completed. -->

- [x] Compile the Project
<!-- ✅ COMPLETED: All dependencies installed, TypeScript compilation successful, no errors found, development server running at localhost:3000 -->

- [x] Create and Run Task
<!-- ✅ COMPLETED: Development server task is running successfully using npm run dev -->

- [x] Update Dependencies & Fix Vulnerabilities
<!-- ✅ COMPLETED: All dependencies updated to latest versions:
- Next.js 16.2.2, React 19.2.4, TypeScript 6.0.2
- 0 vulnerabilities (npm audit passed)
- All lucide-react icons updated for v1.7.0
- Sanity CMS packages updated (v5.14.1)
- Build tested and successful
  -->

- [x] Setup Docker & CI/CD Pipeline
<!-- ✅ COMPLETED: Full Docker and GitHub Actions CI/CD setup:
- Dockerfile (multi-stage production build, ~200MB)
- Dockerfile.dev (development with hot reload)
- docker-compose.yml (production + dev services)
- .dockerignore (optimized build context)
- GitHub Actions workflows:
  - docker-build.yml (builds and pushes to GHCR)
  - security-scan.yml (npm audit, ESLint, Trivy scanning)
  - deploy.yml (automated deployment to college server)
- Documentation:
  - DOCKER.md (complete Docker guide)
  - DEPLOYMENT.md (college server deployment guide)
  - CICD_CHECKLIST.md (setup checklist and quick reference)
- .nvmrc (Node.js v24.14.1 lock)
  -->

- [ ] Launch the Project
<!--
Verify that all previous steps have been completed.
Prompt user for debug mode, launch only if confirmed.
 -->

- [ ] Ensure Documentation is Complete
<!--
Verify that all previous steps have been completed.
Verify that README.md and the copilot-instructions.md file in the .github directory exists and contains current project information.
Clean up the copilot-instructions.md file in the .github directory by removing all HTML comments.
 -->

<!--
## Project Context
E-Cell FCRIT Modern Website
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Sanity CMS for content management
- Professional entrepreneurship club website
- Event management, blog system, team management
- Production deployment to ecell.fcrit.ac.in
-->
