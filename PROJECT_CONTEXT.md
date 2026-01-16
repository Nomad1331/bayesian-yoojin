# Project Context: Bayesian Case Assistant

## Overview

**Bayesian Case Assistant** is a decision support tool for organizing and weighing evidence using structured Bayesian rules. It helps investigators rank suspects based on evidence without making guilt determinations or replacing professional investigation.

## Purpose

This application assists in:
- Organizing evidence in a structured manner
- Weighing evidence using fixed, auditable diagnostic weights
- Ranking suspects by probability based on entered evidence
- Providing a complete audit trail of all calculations

## Key Features

1. **Case Management**: Create and manage multiple investigation cases
2. **Suspect Tracking**: Add suspects with optional access and motive flags
3. **Evidence Entry**: Classify evidence by type and diagnostic strength
4. **Probability Ranking**: View real-time suspect rankings based on Bayesian calculations
5. **Audit Log**: Complete history of all probability calculations and changes
6. **Dark Mode**: Toggle between light and dark themes

## Technical Architecture

### Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks + localStorage for persistence
- **Routing**: React Router DOM

### Key Algorithms

#### Bayesian Probability Calculation
The app uses Bayesian inference to update suspect probabilities:
- Initial priors are distributed equally among suspects plus an "Other/Unknown" category
- Evidence is classified by type (physical, testimonial, circumstantial, documentary, digital, alibi)
- Diagnostic strength modifies likelihood ratios
- Probabilities are updated iteratively using Bayes' theorem

#### "Other/Unknown" Suspect
This is an intentional feature representing the probability that none of the listed suspects is the perpetrator. It ensures:
- Probabilities are normalized correctly
- A "none of the above" baseline is maintained
- Mathematical completeness of the probability model

## File Structure

```
src/
├── components/          # UI components
│   ├── ui/             # shadcn/ui base components
│   ├── AddEvidenceDialog.tsx
│   ├── AddSuspectDialog.tsx
│   ├── AuditLog.tsx
│   ├── CreateCaseDialog.tsx
│   ├── EvidenceList.tsx
│   ├── ProbabilityBar.tsx
│   ├── SuspectList.tsx
│   └── SuspectRanking.tsx
├── lib/
│   ├── bayesian.ts     # Core probability calculations
│   ├── storage.ts      # localStorage persistence
│   └── utils.ts        # Utility functions
├── pages/
│   ├── Index.tsx       # Home page with case list
│   ├── CasePage.tsx    # Individual case view
│   └── NotFound.tsx    # 404 page
├── types/
│   └── index.ts        # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## Deployment

- **Platform**: Vercel
- **URL**: https://bayesian.vercel.app
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Important Notes

1. This tool does NOT use AI for probability calculations
2. All probability calculations use fixed, auditable diagnostic weights
3. The app stores data locally in the browser (localStorage)
4. No server-side processing or data collection occurs
