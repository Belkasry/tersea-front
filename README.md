## Create an Environment File: 
If you haven't already, create a .env or .env.local file in the root of your Vue project.
This file is where you can set environment variables for local development.
## Set the Axios Base URL
Add the following line to your .env file
```bash
VITE_AXIOS_BASE_URL="http://localhost:8000"
```
Replace "http://localhost:8000" with the URL of your Laravel API server if it's different. For example, if you're running the Laravel server on port 8080, you would set it to "http://localhost:8080"

## 💿 Install

Set up your project using your preferred package manager. Use the corresponding command to install the dependencies:

| Package Manager                                                | Command        |
|---------------------------------------------------------------|----------------|
| [yarn](https://yarnpkg.com/getting-started)                   | `yarn install` |
| [npm](https://docs.npmjs.com/cli/v7/commands/npm-install)     | `npm install`  |
| [pnpm](https://pnpm.io/installation)                          | `pnpm install` |
| [bun](https://bun.sh/#getting-started)                        | `bun install`  |

After completing the installation, your environment is ready for Vuetify development.

### Starting the Development Server

To start the development server with hot-reload, run the following command. The server will be accessible at [http://localhost:3000](http://localhost:3000):

```bash
yarn dev
```

(Repeat for npm, pnpm, and bun with respective commands.)

### Building for Production

To build your project for production, use:

```bash
yarn build
```

(Repeat for npm, pnpm, and bun with respective commands.)

