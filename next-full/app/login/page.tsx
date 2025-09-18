"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      }) 

      if(result?.error){
        setError(result.error) // result.error is a string
        setLoading(false)
      } else {
        setError("")
        setLoading(false)
        router.push("/")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  // Clear error when user types
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value)
    if (error) setError("")
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem"
      }}>
        <form 
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            padding: "2.5rem 2rem",
            borderRadius: "16px",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            minWidth: "340px",
            width: "100%",
            maxWidth: "370px",
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            border: "1px solid #e5e7eb",
            color: "#22223b" // <-- Main font color
          }}
        >
          <h2 style={{
            textAlign: "center",
            marginBottom: "0.5rem",
            color: "#22223b", // <-- Heading color
            fontWeight: 700,
            fontSize: "2rem",
            letterSpacing: "-1px"
          }}>Login</h2>
          <label htmlFor="email" style={{fontWeight: 500, color: "#22223b"}}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange(setEmail)}
            required
            style={{
              padding: "0.7rem",
              borderRadius: "6px",
              border: "1.5px solid #cbd5e1",
              fontSize: "1rem",
              outline: "none",
              transition: "border 0.2s",
              marginBottom: "0.2rem"
            }}
            onFocus={e => e.currentTarget.style.border = "1.5px solid #6366f1"}
            onBlur={e => e.currentTarget.style.border = "1.5px solid #cbd5e1"}
          />
          <label htmlFor="password" style={{fontWeight: 500, color: "#22223b"}}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleInputChange(setPassword)}
            required
            style={{
              padding: "0.7rem",
              borderRadius: "6px",
              border: "1.5px solid #cbd5e1",
              fontSize: "1rem",
              outline: "none",
              transition: "border 0.2s",
              marginBottom: "0.2rem"
            }}
            onFocus={e => e.currentTarget.style.border = "1.5px solid #6366f1"}
            onBlur={e => e.currentTarget.style.border = "1.5px solid #cbd5e1"}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: "0.9rem",
              borderRadius: "6px",
              border: "none",
              background: loading ? "#a5b4fc" : "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.08)",
              transition: "background 0.2s"
            }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.background = "#6366f1" }}
            onMouseOut={e => { if (!loading) e.currentTarget.style.background = "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)" }}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          {error && <p style={{
            color: "#ef4444",
            textAlign: "center",
            background: "#fef2f2",
            borderRadius: "4px",
            padding: "0.5rem",
            fontWeight: 500,
            marginTop: "0.5rem"
          }}>{error}</p>}
        </form>
        <div style={{
          marginTop: "1rem",
          background: "#fff",
          padding: "1rem 2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(31, 38, 135, 0.08)",
          border: "1px solid #e5e7eb",
          textAlign: "center",
          color: "#22223b" // <-- Font color for this section
        }}>
          Don't have an account?{" "}
          <button 
            type="button"
            onClick={() => router.push("/register")}
            style={{
              color: "#6366f1",
              background: "none",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
              marginLeft: "0.3rem"
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage