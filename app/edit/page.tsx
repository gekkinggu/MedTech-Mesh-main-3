"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { Navbar } from "@/components/navbar"
import { EditForm } from "@/components/edit/edit-form"

function EditPageContent() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true)
  const searchParams = useSearchParams()
  const modelId = searchParams.get('id')

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <main className="pt-[80px] pb-[100px] px-[52px]">
        <div className="max-w-4xl mx-auto">
          <EditForm modelId={modelId} />
        </div>
      </main>
    </div>
  )
}

export default function EditPage() {
  return (
    <Suspense>
      <EditPageContent />
    </Suspense>
  )
}