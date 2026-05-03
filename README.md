# Stay Hydrated

A full-stack mobile app for tracking daily water intake, built with **React Native / Expo** on the frontend and **Spring Boot** on the backend. Snap a photo of your drink and an AI vision model verifies it's actually water.

---

## High-Level Architecture Diagram (HLD)

![alt text](<High-Level Architecture Diagram (HLD).png>)

## Features

- **Dashboard** — animated water bottle that fills as you log intake, daily goal progress, current streak, and best streak
- **Log Water** — preset amounts (100 / 250 / 500 / 750 / 1000 ml) or custom entry; optional photo proof uploaded to Cloudinary and verified by Groq's Llama 4 Scout vision model
- **Stats** — today's breakdown and an animated weekly bar chart showing goal completion per day
- **Achievements** — milestone badges (First Sip, 7-Day Streak, 30-Day Streak, Hydration Pro, Wave Maker, All Star) with native share cards
- **Profile** — edit display name, set a custom daily goal (ml), and view lifetime stats
- **Preferences** — manage notification settings
- **Auth** — JWT access tokens (15 min) + refresh tokens (7 days) stored in Expo SecureStore; auto-refresh on 401/403

---

## Tech Stack

### Frontend

|               |                                                                                      |
| ------------- | ------------------------------------------------------------------------------------ |
| Framework     | React Native + Expo (SDK, file-based routing via `expo-router`)                      |
| Language      | TypeScript                                                                           |
| HTTP          | Axios with request/response interceptors                                             |
| State         | Zustand (`auth-store`)                                                               |
| Storage       | `expo-secure-store`                                                                  |
| Images        | `expo-image`, `expo-image-picker`                                                    |
| AI            | Groq API — `meta-llama/llama-4-scout-17b-16e-instruct`                               |
| Image hosting | Cloudinary (unsigned upload preset)                                                  |
| UI extras     | `expo-linear-gradient`, `react-native-svg`, `react-native-view-shot`, `expo-sharing` |

### Backend

|           |                               |
| --------- | ----------------------------- |
| Framework | Spring Boot 4.0.6             |
| Language  | Java 17                       |
| Database  | MySQL 8                       |
| ORM       | Spring Data JPA / Hibernate   |
| Security  | Spring Security + JJWT 0.12.6 |
| Utilities | Lombok, Spring Validation     |

---

## Project Structure

```
stay-hydrated/
├── stay-hydrated-frontend/     # Expo app
│   └── src/app/
│       ├── (auth)/             # login, register screens
│       ├── (tabs)/             # index (dashboard), log, stats, profile
│       ├── api/                # axios client + per-feature API modules
│       ├── constants/          # colors, env vars, SVG assets
│       ├── components/         # toast, confirm-modal
│       └── store/              # Zustand auth store
│
└── stay-hydrated-backend/      # Spring Boot app
    └── src/main/java/.../
        ├── controller/         # REST endpoints
        ├── service/            # business logic
        ├── entity/             # JPA entities
        ├── repository/         # Spring Data repositories
        ├── dto/                # request / response DTOs
        ├── mapper/             # entity ↔ DTO mappers
        ├── security/           # JWT filter, user details service
        ├── config/             # JWT properties
        ├── exception/          # global exception handler
        └── util/               # SecurityUtils
```

---

## Getting Started

### Prerequisites

- Java 17+, Maven
- MySQL 8 running locally
- Node.js 18+, npm / yarn
- Expo CLI (`npm install -g expo-cli`) or use `npx expo`
- A physical device or Android/iOS simulator

---

### Backend Setup

1. Create the database:

   ```sql
   CREATE DATABASE stay_hydrated;
   ```

2. Update credentials in `stay-hydrated-backend/src/main/resources/application.yaml` if your MySQL user/password differ from the defaults (`root` / `password`).

3. Run the app:
   ```bash
   cd stay-hydrated-backend
   ./mvnw spring-boot:run
   ```
   The server starts on **port 8080**. Hibernate will auto-create/update tables on first run.

---

### Frontend Setup

1. Install dependencies:

   ```bash
   cd stay-hydrated-frontend
   npm install
   ```

2. Set your credentials in `src/app/constants/env.ts`:

   ```ts
   export const GROQ_API_KEY = "<your-groq-api-key>";
   export const CLOUDINARY_CLOUD_NAME = "<your-cloud-name>";
   export const CLOUDINARY_UPLOAD_PRESET = "<your-unsigned-preset>";
   ```

3. Set your backend URL in `src/app/api/client.ts`:

   ```ts
   export const BASE_URL = "http://<your-local-ip>:8080/api";
   ```

   Use your machine's LAN IP (not `localhost`) so the device/emulator can reach the backend.

4. Start the Expo dev server:
   ```bash
   npx expo start
   ```
   Scan the QR code with Expo Go or press `a` / `i` for Android / iOS emulator.

---

## API Overview

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <accessToken>`.

| Method | Path              | Auth | Description                            |
| ------ | ----------------- | ---- | -------------------------------------- |
| POST   | `/auth/register`  | No   | Create account                         |
| POST   | `/auth/login`     | No   | Get access + refresh tokens            |
| POST   | `/auth/refresh`   | No   | Rotate tokens using refresh token      |
| POST   | `/auth/logout`    | No   | Invalidate refresh token               |
| GET    | `/dashboard`      | Yes  | Today's summary (goal, intake, streak) |
| POST   | `/intake`         | Yes  | Log a water intake entry               |
| GET    | `/intake/history` | Yes  | Paginated intake history               |
| GET    | `/stats/today`    | Yes  | Today's detailed stats                 |
| GET    | `/stats/weekly`   | Yes  | Last 7 days bar-chart data             |
| GET    | `/achievements`   | Yes  | All achievements with earned status    |
| GET    | `/goal`           | Yes  | Current daily goal                     |
| PUT    | `/goal`           | Yes  | Update daily goal                      |
| GET    | `/profile`        | Yes  | User profile                           |
| PUT    | `/profile`        | Yes  | Update display name / avatar           |
| GET    | `/preferences`    | Yes  | Notification preferences               |
| PUT    | `/preferences`    | Yes  | Update preferences                     |

---

## External Services

| Service                              | Purpose                                     | How to get credentials                              |
| ------------------------------------ | ------------------------------------------- | --------------------------------------------------- |
| [Groq](https://console.groq.com)     | AI vision — verifies photo contains a drink | Create account → API Keys                           |
| [Cloudinary](https://cloudinary.com) | Image hosting for intake photos             | Dashboard → Settings → Upload → Add unsigned preset |

Both services are **optional**. The app falls back to logging without a photo if credentials are not set.

---

## Environment Variables Reference

### Frontend — `src/app/constants/env.ts`

| Variable                   | Description                            |
| -------------------------- | -------------------------------------- |
| `GROQ_API_KEY`             | Groq API key for vision model calls    |
| `CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud name                  |
| `CLOUDINARY_UPLOAD_PRESET` | Unsigned Cloudinary upload preset name |

### Backend — `src/main/resources/application.yaml`

| Key                                 | Default                                     | Description                         |
| ----------------------------------- | ------------------------------------------- | ----------------------------------- |
| `spring.datasource.url`             | `jdbc:mysql://localhost:3306/stay_hydrated` | MySQL connection string             |
| `spring.datasource.username`        | `root`                                      | DB username                         |
| `spring.datasource.password`        | `password`                                  | DB password                         |
| `app.jwt.secret`                    | _(set in yaml)_                             | HS256 signing secret (min 32 chars) |
| `app.jwt.access-token-expiry-ms`    | `900000`                                    | Access token lifetime (15 min)      |
| `app.jwt.refresh-token-expiry-days` | `7`                                         | Refresh token lifetime              |

---

## Author

Built by **Vivek Pramanik**
