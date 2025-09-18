"use client"
import React,{ useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';


function Login() {
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Login failed. Please try again.");
                return;
            }
            console.log("Login successful:", data);
            router.push("/");
        } catch (error) {
            console.error("Error logging in:", error);
            
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && (
              <div className="mb-4 text-red-500 text-center">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
                <p className="text-center mt-4">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-blue-500 hover:text-blue-600">
                        Register
                    </Link>
                </p>
            </form>
        </div>
  )
}

export default Login