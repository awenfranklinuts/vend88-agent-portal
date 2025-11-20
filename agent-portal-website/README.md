# Agent Portal Website

A comprehensive POS customer management portal built with Next.js 15, React 19, and TypeScript.

## Features

- **Customer Management**: Manage all POS customers across multiple locations
- **Permission Control**: Fine-grained permission management system
- **Multi-language Support**: English and Chinese language support
- **Modern UI**: Clean, responsive design with styled-components
- **Authentication**: Secure login system for agents and administrators

## Tech Stack

- **Framework**: Next.js 15
- **React**: 19.0.0
- **TypeScript**: 5
- **Styling**: Styled Components
- **API Client**: Axios
- **Language**: i18n support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
agent-portal-website/
├── app/                  # Next.js app directory
├── components/           # React components
├── context/             # React context providers
├── config/              # Configuration files
├── styles/              # Theme and global styles
├── i18n/                # Internationalization
└── public/              # Static assets
```

## Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_BASE_URL=https://prod.vend88.com
```

## License

Private - All rights reserved
