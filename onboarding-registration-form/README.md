# vend88-agent-portal

## Overview
The vend88-agent-portal is a web application designed for agents to manage their tasks efficiently. It features a multi-language API that forwards requests to the backend, allowing for seamless internationalization.

## Project Structure
```
vend88-agent-portal
├── src
│   ├── pages
│   │   ├── index.tsx          # Main entry point of the application
│   │   ├── agent.tsx          # Agent-specific page
│   │   └── api
│   │       └── [lang]
│   │           └── forward.ts # API route for language-specific requests
│   ├── components
│   │   ├── Header.tsx         # Header component for navigation
│   │   └── AgentPage.tsx      # Component for displaying agent information
│   ├── lib
│   │   └── proxy.ts           # Logic for forwarding requests to the backend
│   ├── locales
│   │   ├── en.json            # Localization strings for English
│   │   └── id.json            # Localization strings for Indonesian
│   └── types
│       └── index.ts           # TypeScript types and interfaces
├── package.json                # npm configuration file
├── tsconfig.json               # TypeScript configuration file
├── next.config.js              # Next.js configuration settings
└── README.md                   # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd vend88-agent-portal
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the application:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:3000`.

## Usage
- Navigate to the main page to access general features.
- Use the agent page to manage agent-specific tasks.
- The application supports multiple languages; use the appropriate language code in the API route to receive localized responses.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.