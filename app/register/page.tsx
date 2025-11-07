"use client"
import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            toast.success("Account created successfully!")
            router.push("/dashboard")
        } catch (error) {
            toast.error("Error creating account")
        }
    }
    return (
        <form onSubmit={handleRegister}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
        </form>
    );
}