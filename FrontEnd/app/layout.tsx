import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { FloatingAiAssistant } from "@/components/ui/glowing-ai-chat-assistant"
import { Toaster } from "sonner"
import "./globals.css"

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins"
})

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "PetCare - Connect with Certified Pet Trainers",
  description:
    "Professional pet-care platform connecting pet owners with certified trainers. Manage your pets, book training sessions, and track your pet's progress in real-time.",
  generator: "v0.app",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>",
    apple: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased transition-smooth text-shadow-sm`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <FloatingAiAssistant />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
