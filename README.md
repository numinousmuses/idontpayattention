# I Don't Pay Attention

A voice-powered note-taking application that helps you capture and organize content from meetings, lectures, and videos without having to actively pay attention.

## Features

- **Voice Recognition**: Real-time audio transcription and processing
- **Structured Content**: Automatically organizes notes into text blocks, graphs, and marquees
- **Note Management**: Create, edit, delete, and duplicate notes with ease
- **Color Organization**: Categorize notes with different colors
- **Local Storage**: All data stored locally using IndexedDB for privacy
- **LLM Processing**: Enhanced content processing using OpenAI integration
- **Sharing**: Share notes with others via shareable links
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Dexie (IndexedDB wrapper)
- **AI Integration**: OpenAI API
- **Speech Recognition**: Web Speech API
- **Deployment**: SST (Serverless Stack) with OpenNext

## Development

This project is scaffolded with OpenNext and SST for serverless deployment on AWS.

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS account (for deployment)

### Running Development Server

```bash
npx sst dev --stage development
```

This will start the development server with SST's live Lambda development environment.

### Building for Production

```bash
npm run build
```

### Deployment

```bash
npx sst deploy
```

For production deployment:

```bash
npx sst deploy --stage production
```

## Configuration

The application is configured through `sst.config.ts` for:
- AWS deployment settings
- Domain configuration (idontfuckingpayattention.com)
- Environment-specific settings

## Documentation

For more information about SST configuration and deployment options, reference the [SST documentation](https://sst.dev/docs).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
