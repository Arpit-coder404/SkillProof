# SkillProof

> **"Don't just list your skills. Prove them."**  
> *A Practical Skills Passport & Verification Platform for University Students.*

SkillProof is a collegiate platform that helps students document, demonstrate, verify, and showcase practical competencies through genuine project repositories, design systems, research papers, faculty rubrics, and mentor attestations.

---

## 🏛️ Design Philosophy & Aesthetic Identity

SkillProof is designed with an **editorial, human, structured, and confident aesthetic** inspired by premium academic publications, university presses, and high-craft productivity software.

- **No AI SaaS Cliches**: No purple-blue neon gradients, no glassmorphism, no generic decorative blobs, and no artificial AI ratings.
- **Editorial Color Palette**:
  - Warm Paper: `#F7F6F2`
  - Primary Text (Ink): `#20231F`
  - Forest Green (Attestations & Verified Marks): `#234B3C`
  - Muted Sage: `#DCE5DC`
  - Secondary Grey: `#777B75`
  - Border: `#E5E4DE`
  - Terracotta (Accent & Alerts): `#D77A45`
- **Distinctive Typography**:
  - Headings: `Newsreader` / `DM Serif Display`
  - Body & UI: `DM Sans` / `Inter`
  - Metadata: Letter-spaced uppercase sans-serif

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer; tested on Node v26)
- npm (v9 or newer)

### Installation & Launch

```bash
# 1. Clone or navigate to the repository
cd SkillProof

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the local development server
npm run dev
```

Open your browser at `http://localhost:5173`.

To create a production build:
```bash
npm run build
npm run preview
```

---

## 👥 Pre-Seeded Demo Profiles & Roles

SkillProof features a built-in **Role Switcher** in the top navigation bar, allowing seamless testing across all 4 key user types without needing credentials:

| Role | Name | Title & Affiliation | Key Feature to Test |
| :--- | :--- | :--- | :--- |
| **Student** | **Arpit Pujani** *(Default)* | Senior in CS • Systems Architect, Stanford / Metro Tech | Has verified skills (Python, Distributed Systems), pending reviews, and evidence vault |
| **Student** | **Elena Rostova** | HCI & Design Systems Lead, RISD / Brown | Expert design tokens, interactive Figma community prototypes, and user research |
| **Student** | **Marcus Vance** | M.S. Candidate in Data Science, Carnegie Mellon | Applied statistical modeling, Bayesian analysis, transit maps |
| **Faculty (Reviewer)** | **Prof. David Chen** | Chair of Software Engineering, Software Eng. Institute | Has incoming verification request from Arpit for the Room Booking Engine |
| **Faculty (Reviewer)** | **Dr. Eleanor Vance** | Associate Professor & Systems Research Lab Director | Verified Arpit's Raft consensus implementation |
| **Mentor (Reviewer)** | **Sarah Jenkins** | Staff Software Engineer at Stripe • Alumni Mentor | Evaluated Python low-level socket inspection tooling |
| **Mentor (Reviewer)** | **Michael Torres** | VP of Product Design • Techstars Mentor in Residence | Verified campus design token architecture |
| **Organization** | **Apex Technology Partners** | Early Career Talent Acquisition | Searches and discovers verified candidates without opaque AI scores |
| **Admin** | **Academic Standards Board** | Collegiate Verification Consortium Registrar | Audits the tamper-evident immutable log and manages catalog competencies |

---

## 🔄 End-to-End Verification Journey (Test Script)

Follow these steps to experience the complete verification lifecycle:

1. **Start as Student (Arpit Pujani)**:
   - Navigate to **My Skills** (`/skills`). Notice skills marked as *Verified*, *Under Review*, or *Self-declared*.
   - Click **+ Add Skill to Passport**. Select *Applied Statistical Modeling*, set starting level to *Intermediate*, and click **Add to Passport**. Notice it is clearly tagged **Self-declared** (a self-declaration is never auto-verified).
2. **Deposit Concrete Evidence**:
   - Go to **Evidence Vault** (`/evidence`) or click **Deposit New Evidence**.
   - Select the associated skill, choose *GitHub Repository* or *Technical Document / PDF*, enter a title, and describe your **Specific Personal Contribution**.
   - Check **Request Verification Review** and choose **Prof. David Chen**. Click **Submit for Verification**.
3. **Switch to Reviewer (Prof. David Chen)**:
   - Click the **Role Switcher** dropdown in the top-right and select **Prof. David Chen**.
   - Notice the Reviewer workspace banner and click **Review Submissions** (`/mentor`).
   - In the left column, click on the newly received submission (or the pending *University Study Room Booking Engine* submission).
4. **Inspect & Verify**:
   - Review the candidate's personal contribution statement and artifact link.
   - Check the evaluator verification criteria (e.g. *Code Quality*, *Independent Contribution*, *Test Coverage*).
   - Enter your official evaluator notes (e.g., *"Verified optimistic concurrency locking and unit tests under load."*).
   - Click **Confirm & Cryptographically Seal Verification**. Confetti fires, an attestation record is generated, and reference ID `SKP-2026-XXXXX` is cryptographically issued.
5. **Switch Back to Student (Arpit Pujani)**:
   - Look at the **Notifications Bell**: a new alert appears informing the student that their evidence was verified.
   - Open **My Skills**: the skill status has progressed to **Verified** with the official reference ID.
   - Click **View Attestation** to open the formal **SkillProof Attestation Certificate** with reviewer credentials, timestamps, and criteria.
6. **Inspect the Public Skills Passport**:
   - Click **View Public Passport** (`/passport/student-arpit`).
   - Observe the updated verified counters, clickable seals, and printable editorial layout.
7. **Discover as an Organization / Recruiter**:
   - Switch to **Apex Technology Partners** and open **Discover Students** (`/discover`).
   - Use the category filters, specific skill search, and *Verified Competencies Only* toggle to find Arpit and Elena.

---

## 🛠️ Architecture & Relational Schema

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **State Management & Persistence**: Zustand store synchronized to `localStorage` under `skillproof_store_v1`. All evidence, verification requests, rubric scores, and audit logs persist across page reloads.
- **Relational Data Entities**:
  - `users`: Student, faculty, mentor, organization, and admin profiles.
  - `skillDefinitions`: Competency standards across 6 academic domains.
  - `studentSkills`: Mapping student to skill with 5-tier proficiency and verification states.
  - `evidence`: Individual project repositories, prototypes, papers, and contribution statements.
  - `assessments`: Challenges created by faculty with 4-part rubrics (max 5 pts each).
  - `assessmentSubmissions`: Student challenge deliverables with rubric evaluations.
  - `verificationRequests`: Active verification workflows between candidates and reviewers.
  - `verificationRecords`: Immutable certified records with unique reference IDs.
  - `auditLogs`: Append-only activity trail preventing silent or unauthorized modifications.

---

## 📜 License

Created for the SkillProof Academic Consortium. All rights reserved.

