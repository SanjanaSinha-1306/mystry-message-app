'use client'
import { SessionProvider } from "next-auth/react"

// To check if the user is authenticated
export default function AuthProvider({children}
:{children:React.ReactNode}) {
  return (
    <SessionProvider >
     {children}
    </SessionProvider>
  )
}