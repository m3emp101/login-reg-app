# Campaign Central MERN App

Campaign Central is a simple MERN stack application that demonstrates authenticated navigation with a global header. It includes public pages (Home, Help, Contact) and protected content (Campaigns) that becomes available after logging in.

## Features

- Global header with logo routing to the home page and navigation links to Help, Contact, Login, and Register.
- Authentication flow backed by Express, MongoDB, JWT, and bcrypt.
- Conditional navigation state showing Logout and Campaigns once a user is logged in.
- Sample campaigns feed served from the backend for authenticated users.
- Responsive layout with lightweight styling.

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or hosted)

## 1. Backend Setup (`/server`)

```bash
cd server
cp .env.example .env
# Update .env with your MongoDB URI and a JWT secret

npm install
npm run dev
```

The backend boots on `http://localhost:4000` by default. It exposes authentication routes under `/api/auth` and a protected campaigns route at `/api/campaigns`.

## 2. Frontend Setup (`/client`)

```bash
cd client
cp .env.example .env
# Update VITE_API_BASE_URL if the server runs on a different host or port

npm install
npm run dev
```

Vite serves the React app at `http://localhost:3000`. The client reads API settings from `VITE_API_BASE_URL` (defaults to `http://localhost:4000/api`).

## Usage

1. Register a new account from the Register page (passwords are hashed in MongoDB).
2. After registering or logging in, you are redirected to the Campaigns page where sample campaign data is displayed.
3. The header updates to show the Campaigns link and a Logout button while authenticated.

## API Overview

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | Create a new user account |
| `/api/auth/login` | POST | Login with email + password to receive a JWT |
| `/api/auth/me` | GET | Fetch the current user profile (requires `Authorization: Bearer <token>`) |
| `/api/campaigns` | GET | Retrieve sample campaigns (requires JWT) |

## Development Tips

- Keep both the server (`npm run dev`) and client (`npm run dev`) processes running during development.
- By default the app expects MongoDB at `mongodb://localhost:27017/mern_auth`; update `.env` if using Atlas or another URI.
- Auth tokens are stored in `localStorage` under the key `auth_token`.

## Testing the Flow Quickly

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Then visit `http://localhost:3000`, register a user, and explore the campaigns section.
