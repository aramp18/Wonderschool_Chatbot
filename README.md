# Wonderschool Provider Messaging Tool

A web application that allows childcare providers to submit requests to Wonderschool via text or voice input. The system uses a knowledge base for common questions and falls back to AI for unique queries, providing accurate and consistent responses.

## Features

- Text and voice-based messaging interface
- Speech-to-text conversion for voice input
- Knowledge Base integration with exact matching
- Automated response generation using OpenAI
- Smart message categorization
- Modern, responsive UI
- Deployed on Vercel for instant access

## Live Demo

Visit [wonderschool-chatbot.vercel.app](https://wonderschool-chatbot.vercel.app) to try the application.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- OpenAI API (for message processing)
- Knowledge Base (JSON-based)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aramp18/Wonderschool_Chatbot.git
cd Wonderschool_Chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── api/messages/     # API routes
├── components/            # React components
│   ├── ChatContainer.tsx
│   └── MessageBubble.tsx
└── lib/                  # Utility functions and configurations
    ├── openai.ts        # OpenAI API integration
    ├── knowledge.ts     # Knowledge base matching logic
    └── knowledge-base.json # Structured knowledge base
```

## Knowledge Base

The application uses a structured knowledge base (`knowledge-base.json`) that contains common questions and their answers. The system:

1. Normalizes incoming questions (lowercase, remove punctuation)
2. Attempts to find an exact match in the knowledge base
3. Falls back to OpenAI API for unique or complex questions

Categories in the knowledge base include:
- Support requests
- Account management
- Billing inquiries
- Website updates
- Pricing changes
- Product feedback

## Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your GitHub repository
4. Add your `OPENAI_API_KEY` in the Environment Variables section
5. Deploy!

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 