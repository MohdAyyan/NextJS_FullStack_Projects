import CredentialsProvider from 'next-auth/providers/credentials';
import User from "@/models/User";
import { connectToDatabase } from './db';
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" }, 
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please provide both email and password");
                }
               
                try {
                    await connectToDatabase();
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("Invalid email or password");
                    }

                   const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                   if (!isPasswordValid) {
                       throw new Error("Invalid  password");
                   }

                   return {
                       id: user._id.toString(),
                       email: user.email,
                   }

                } catch {
                    throw new Error("No user found");       
                }

            }
        }),
    ],
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
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt" as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}