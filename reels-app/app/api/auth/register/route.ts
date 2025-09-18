
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { NextResponse, NextRequest } from 'next/server';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation function
function validatePassword(password: string): { isValid: boolean; error?: string } {
    if (password.length < 6) {
        return { isValid: false, error: 'Password must be at least 6 characters long' };
    }
    if (password.length > 50) {
        return { isValid: false, error: 'Password must be less than 50 characters' };
    }
    return { isValid: true };
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        
        // Check if required fields are present
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' }, 
                { status: 400 }
            );
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' }, 
                { status: 400 }
            );
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return NextResponse.json(
                { error: passwordValidation.error }, 
                { status: 400 }
            );
        }

        // Sanitize inputs (trim whitespace)
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedPassword = password.trim();

        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: sanitizedEmail });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' }, 
                { status: 409 }
            );
        }

        // Create new user
        const newUser = await User.create({ 
            email: sanitizedEmail, 
            password: sanitizedPassword 
        });

        // Return success response without sensitive data
        return NextResponse.json(
            { 
                message: 'User created successfully',
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    createdAt: newUser.createdAt
                }
            }, 
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' }, 
            { status: 500 }
        );
    }
}