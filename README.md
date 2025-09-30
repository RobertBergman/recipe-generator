# Recipe Generator - AI-Powered Meal Planning

A modern full-stack application that generates personalized meal plans based on your dietary preferences and local store sales using AI. Like HelloFresh, but you shop for the ingredients yourself!

## Features

- 🍳 **AI-Powered Meal Planning**: Uses OpenRouter API to generate custom meal plans
- 🥗 **Multiple Diet Types**: Supports carnivore, Mediterranean, keto, paleo, vegan, vegetarian, and more
- 🏪 **Store Integration**: Plans meals based on sales at Yokes, Safeway, Walmart, Target, and Costco
- 📋 **Smart Shopping Lists**: Auto-generated shopping lists grouped by category
- 🎨 **Beautiful Recipe Cards**: View detailed recipes with ingredients, instructions, and nutrition info
- 💾 **Local Storage**: All settings and API keys stored securely in your browser
- 🌙 **Dark Mode**: Automatic dark mode support

## Getting Started

### Prerequisites

- Node.js 20 or higher
- An OpenRouter API key ([get one here](https://openrouter.ai/keys))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

1. Click "Configure Settings" on the welcome screen
2. Enter your OpenRouter API key
3. Select your diet type and preferences
4. Choose your location and preferred stores
5. Set your serving size and any dietary restrictions
6. Click "Save Settings"

### Using the App

1. Click "Generate Meal Plan" to create 7 meals based on your preferences
2. Click on any recipe card to view full details
3. Click "Shopping List" to see all ingredients organized by category
4. Check off items as you shop
5. Print or copy the shopping list to your clipboard

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: OpenRouter API (Claude 3.5 Sonnet)
- **Icons**: Lucide React
- **Storage**: Browser localStorage

## Supported Diet Types

- Balanced
- Carnivore
- Mediterranean
- Keto
- Paleo
- Vegan
- Vegetarian
- Pescatarian
- Whole30
- Gluten-Free
- Low-Carb

## Supported Stores

- Yokes
- Safeway
- Walmart
- Target
- Costco

## Future Enhancements

- Real-time store sales data integration
- User accounts with cloud storage
- Meal plan history and favorites
- Recipe ratings and reviews
- Nutritional goal tracking
- Meal prep instructions
- Multi-week meal planning
- Recipe customization and substitutions
