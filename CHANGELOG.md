# Changelog

All notable changes to the Bayesian Case Assistant will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.2.0] - 2026-01-16

### Added
- **Evidence Deletion**: Users can now delete evidence items with a trash icon button
- **Tutorial/Onboarding Modal**: Comprehensive in-app tutorial accessible via help icon in header
- Explains the full workflow: creating cases, adding suspects, entering evidence, analyzing rankings, and reviewing audit logs
- Includes tips for best practices in Bayesian analysis

### Changede
- **Dark Mode Overhaul**: Completely redesigned dark theme with deeper blacks, better contrast, and vibrant accent colors
- Dark background now uses proper dark tones instead of muddy greys

### Technical
- Added `TutorialDialog` component with step-by-step guide
- Extended `EvidenceList` component with delete functionality
- Updated CSS variables for improved dark mode aesthetics

---

## [1.1.0] - 2026-01-16

### Added
- **Dark Mode Toggle**: Users can now switch between light and dark themes
- **PROJECT_CONTEXT.md**: Comprehensive documentation about the project
- **CHANGELOG.md**: This changelog file for tracking changes
- **Vercel Configuration**: Added `vercel.json` for proper SPA routing

### Changed
- Updated meta tags for better SEO and social media previews
- Updated Open Graph image for social sharing
- Cleaned up README.md

### Fixed
- Fixed Vercel 404 error on direct URL access (SPA routing issue)
- Fixed CSS @import order warning in build process

### Technical
- Moved Google Fonts @import to proper position in CSS
- Added rewrites configuration for client-side routing on Vercel

---

## [1.0.0] - 2026-01-15

### Added
- Initial release of Bayesian Case Assistant
- Case management system (create, view, manage cases)
- Suspect tracking with access and motive flags
- Evidence entry with type and diagnostic strength classification
- Real-time probability ranking using Bayesian inference
- "Other/Unknown" suspect category for mathematical completeness
- Audit log for complete calculation history
- Responsive design for mobile and desktop
- Local storage persistence for offline use
