# NextAuth.js Setup Guide

## Step 1: Install NextAuth

```bash
npm install next-auth
```

## Step 2: Create Type Definitions

Create a file called `next-auth.d.ts`

## Step 3: Create Auth Configuration

Create a file called `authOptions.ts` with the following configuration:

### A. Providers Configuration

```typescript
providers: [
    CredentialProvider({
        name: "Credentials",
        credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.username || !credentials?.password) {
                throw new Error("Please provide both username and password");
            }
            // Logic to find whether username or password already exists or not
        }
    })
],
```

### B. Callbacks Configuration

```typescript
callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
        }
        return token;
    },
    
    async session({ session, token }) {
        if (session.user) {
            session.user.id = token.id as string;
        }
        return session;
    }
},
```

### C. Pages Configuration

```typescript
pages: {
    signIn: "/login",
    error: "/login"
},
```

### D. Session Configuration

```typescript
session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
},
```

### E. Secret Configuration

```typescript
secret: process.env.NEXTAUTH_SECRET,
```

## Step 4: Create API Route

Create a folder called `[...nextauth]` and inside it create a file called `route.ts`:

```typescript
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```