# Fotos Buitrago

A beautiful photo and video management website with Colombian and Costa Rican beach/nature vibes.

## Features

- 📁 Folder creation and organization
- 📸 Photo and video upload with drag-and-drop
- 🗑️ Delete photos, videos, and folders
- 📱 Responsive design for all devices
- 🌊 Tropical Caribbean aesthetic
- ⚡ Fast and modern React + TypeScript + Vite stack

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## AWS Deployment

This project includes a `buildspec.yml` file for AWS CodeBuild. Make sure to:

1. Set the correct source directory in your CodeBuild project
2. Update the API endpoints in `src/services/api.ts` with your actual API Gateway URLs
3. Configure your S3 bucket and API Gateway endpoints

## API Configuration

Update the API endpoint in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'YOUR_API_GATEWAY_ENDPOINT'; // Replace with your actual endpoint
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- AWS S3 + API Gateway (backend)