# Bayesian Case Assistant

A decision support tool for organizing and weighing evidence using structured Bayesian rules. This application assists investigators in ranking suspects based on evidence without making guilt determinations or replacing professional investigation

## Features

- **Case Management**: Create and manage multiple investigation cases
- **Suspect Tracking**: Add suspects with optional access and motive flags
- **Evidence Classification**: Classify evidence by type and diagnostic strength
- **Probability Ranking**: Real-time suspect rankings using Bayesian inference
- **Audit Trail**: Complete history of all probability calculations
- **Dark/Light Mode**: Toggle between themes for comfortable viewing

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router DOM

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How It Works

1. **Create a Case**: Start with a new investigation case
2. **Add Suspects**: Enter suspects with optional access/motive flags
3. **Enter Evidence**: Classify each piece of evidence by type and strength
4. **View Rankings**: See probability rankings update in real-time
5. **Review Audit Log**: Check the complete calculation history

## Important Notes

- This tool does NOT use AI for calculations
- All probability calculations use fixed, auditable diagnostic weights
- Data is stored locally in your browser
- No server-side processing or data collection

## Deployment

Deployed on Vercel: [bayesian.vercel.app](https://bayesian.vercel.app)

## License

MIT
