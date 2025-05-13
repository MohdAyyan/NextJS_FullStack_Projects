# Next.js Authentication Project

## Directory Structure
```
next-auth/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── users/
│   │   │       ├── signup/
│   │   │       │   └── route.ts
│   │   │       └── login/
│   │   │           └── route.ts
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── components/
│   ├── dbConfig/
│   │   └── dbConfig.ts
│   ├── helpers/
│   │   └── mailer.ts
│   └── models/
│       └── user.model.ts
├── .env
├── package.json
└── README.md
```

## Features
- 🔐 User Authentication (Signup/Login)
- ✉️ Email Verification
- 🔒 Protected Routes
- 📱 Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack
- Next.js 13+ (App Router)
- TypeScript
- MongoDB & Mongoose
- Tailwind CSS
- Nodemailer
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas Account
- Mailtrap Account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd next-auth
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```env
MONGO_URI=your_mongodb_uri
DOMAIN=http://localhost:3000
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
```

4. Run development server:
```bash
npm run dev
```

## API Routes

### Authentication
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/verify` - Email verification

## Environment Variables
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `DOMAIN` | Application domain |
| `MAILTRAP_USER` | Mailtrap username |
| `MAILTRAP_PASS` | Mailtrap password |

## Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License
MIT License - feel free to use this project for your own learning!