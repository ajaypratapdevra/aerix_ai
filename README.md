# 🚀 AERIX AI — Full Stack Portal

Complete source code for the AERIX AI Smart Business Portal.
Built with **Next.js 14 + TypeScript** (frontend) and **Express.js + MongoDB** (backend).

---

## 📁 Project Structure

```
aerix/
├── frontend/          ← Next.js 14 App (React + TypeScript + Tailwind)
└── backend/           ← Express.js API (Node.js + MongoDB)
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env      # Fill in your MongoDB URI + OpenAI key

# Frontend
cd ../frontend
npm install
cp .env.local.example .env.local   # Set NEXT_PUBLIC_API_URL
```

### 2. Configure Environment

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aerix_ai
JWT_SECRET=your_super_secret_key_here
OPENAI_API_KEY=sk-your_openai_key_here
FRONTEND_URL=http://localhost:3000
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd backend
node src/seed.js
```

This creates:
- ✅ 4 workshops (AI Tech, Safety, Chatbot, Aerospace)
- ✅ 4 products (Smart School, Edu Device, NAARIX, AI Assistant)
- ✅ Admin user: `aerixteam@gmail.com` / `AerixAdmin@2026`

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev      # Runs on port 5000

# Terminal 2 — Frontend
cd frontend && npm run dev     # Runs on port 3000
```

Open: **http://localhost:3000**

---

## 🏗️ Pages & Routes

### Public Pages
| Route | Page |
|-------|------|
| `/` | Homepage (Hero, Products, Workshops, Features) |
| `/innovations` | Products/Innovations page |
| `/workshops` | Workshops listing |
| `/portfolio` | Portfolio (filterable) |
| `/about` | About AERIX AI |
| `/team` | Team page |
| `/blog` | Blog listing |
| `/contact` | Contact form |
| `/auth/login` | Login |
| `/auth/register` | Register |

### Customer Dashboard (`/dashboard/*`)
| Route | Page |
|-------|------|
| `/dashboard` | Overview + recent activity |
| `/dashboard/book` | Book a workshop |
| `/dashboard/products` | Browse + request products |
| `/dashboard/bookings` | My bookings |
| `/dashboard/requests` | My demo/quote requests |
| `/dashboard/chat` | AI Assistant (full chat) |
| `/dashboard/profile` | Edit profile |

### Admin Panel (`/admin/*`)
| Route | Page |
|-------|------|
| `/admin` | Stats dashboard |
| `/admin/workshops` | CRUD workshops |
| `/admin/bookings` | All bookings + status update |
| `/admin/inquiries` | Contact form messages |
| `/admin/chat-logs` | All AI chat history |
| `/admin/users` | User management |

---

## 🔌 API Reference

### Auth
```
POST /api/auth/register     { name, email, password, schoolName?, phone? }
POST /api/auth/login        { email, password }
GET  /api/auth/me           → current user (requires token)
PUT  /api/auth/profile      { name, schoolName, phone }
```

### Workshops (public GET, admin write)
```
GET    /api/workshops
GET    /api/workshops/:id
POST   /api/workshops        (admin)
PUT    /api/workshops/:id    (admin)
DELETE /api/workshops/:id    (admin)
```

### Bookings
```
POST /api/bookings           { workshopId, schoolName, contactName, contactPhone, dateChosen, studentsCount }
GET  /api/bookings/my        → customer's bookings
GET  /api/bookings           → all bookings (admin)
PUT  /api/bookings/:id/status { status } (admin)
```

### Products, Requests, Inquiries — same pattern

### Chat
```
POST /api/chat               { message, sessionId, conversationHistory[] }
GET  /api/chat/logs          (admin)
GET  /api/chat/logs/my       (customer)
```

### Admin
```
GET /api/admin/stats
GET /api/admin/users
PUT /api/admin/users/:id/toggle
PUT /api/admin/users/:id/role
```

---

## 🎨 Brand Colors (Tailwind Classes)

| Name | Hex | Class |
|------|-----|-------|
| Cyan (Primary) | `#00BFFF` | `text-brand-cyan`, `bg-brand-cyan` |
| Orange (Accent) | `#FF6200` | `text-brand-orange`, `bg-brand-orange` |
| Navy (Dark BG) | `#0A0E1A` | `bg-brand-navy` |
| Navy Light | `#0F1629` | `bg-brand-navy-light` |
| Navy Card | `#141C35` | `bg-brand-navy-card` |

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
# Set NEXT_PUBLIC_API_URL to your backend URL
```

### Backend → Render
1. Create new Web Service on render.com
2. Connect GitHub repo, set root dir to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables

---

## 🔐 Security Features

- JWT auth with 7-day expiry
- Password hashing with bcrypt (12 rounds)
- Rate limiting on all routes (200 req/15min global, 15 req/min on chat)
- Admin-only route guards
- Soft delete (data preserved)
- Input validation on all endpoints

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| State | Zustand |
| Forms | React Hook Form |
| Backend | Express.js, Node.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| AI | OpenAI GPT-4o-mini |
| Fonts | Orbitron + Exo 2 (Google Fonts) |

---

**Built for AERIX AI 🚀 | aerixteam@gmail.com**
