"use client";
import AuthGuard from "../components/AuthGuard";
import {  useEffect} from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged , User  , signOut} from "firebase/auth";
export default function DashboardPage() {
    const router = useRouter();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    return (
        <AuthGuard>
            <h1>Welcome to the Dashboard</h1>

            <button onClick={() => signOut(auth)}>Sign Out</button>
        </AuthGuard>
    );
}
