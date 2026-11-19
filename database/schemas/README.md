# SkillChain Database Schemas & Collections

This directory documents the MongoDB data model for the SkillChain platform.

## Collections Overview

| Collection | Model File | Description |
| :--- | :--- | :--- |
| `users` | `User.model.js` | User accounts with role-based credentials (student, recruiter, admin) and bcrypt password hashing. |
| `studentprofiles` | `StudentProfile.model.js` | Academic details, bio, contact info, and profile completion scoring. |
| `skills` | `Skill.model.js` | Individual student skills categorized and marked with verification status. |
| `projects` | `Project.model.js` | Practical portfolio artifacts with repository and deployment links. |
| `certificates` | `Certificate.model.js` | Verifiable certificates with SHA-256 fingerprint, blockchain transaction proof, and status history. |
| `jobs` | `Job.model.js` | Placement job postings created by recruiters with required skills and criteria. |
| `applications` | `Application.model.js` | Student job applications with unique `(job, student)` constraint and recruiter recruitment status. |
| `resumes` | `Resume.model.js` | Parsed resume metadata, extracted competencies, and text content. |
| `notifications` | `Notification.model.js` | Real-time and persistent alerts for status updates and verification reviews. |
| `auditlogs` | `AuditLog.model.js` | Security and regulatory audit trails for administrative operations. |

