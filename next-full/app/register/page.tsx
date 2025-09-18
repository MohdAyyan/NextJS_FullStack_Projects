"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return // Prevent further execution if passwords don't match
    }
    try {
      const res =  await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
      const data = await res.json()
      if(!res.ok){
        setError(data.error)
        setLoading(false)
      }else{
        setError("")
        setLoading(false)
        router.push("/login")
      }
    } catch (error) {
      console.error("Error registering user: ", error)
      setError("Failed to register user")
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)"
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
          border: "1px solid #e5e7eb"
        }}
      >
        <h2 style={{
          textAlign: "center",
          marginBottom: "0.5rem",
          color: "#1e293b",
          fontWeight: 700,
          fontSize: "2rem",
          letterSpacing: "-1px"
        }}>Create Account</h2>
        <label htmlFor="email" style={{fontWeight: 500, color: "#334155"}}>Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <label htmlFor="password" style={{fontWeight: 500, color: "#334155"}}>Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <label htmlFor="confirmPassword" style={{fontWeight: 500, color: "#334155"}}>Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Loading..." : "Register"}
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
    </div>
  )
}

export default RegisterPage