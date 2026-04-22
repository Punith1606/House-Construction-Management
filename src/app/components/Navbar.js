"use client"
import React, { useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const Navbar = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const hello = session?.user?.email?.split("@")[0] || ""

  useEffect(() => {
    if (session && pathname !== "/dashboard" && pathname !== `/${hello}/products` && pathname !== `/Login`) {
      signOut({ callbackUrl: "/Login" })
    }
  }, [pathname, session, hello])

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <div className="text-3xl font-bold flex items-center gap-2 mb-2 md:mb-0">
          <button onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer">
            <span className="text-blue-400">H</span><span className="text-cyan-400">B</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {session && (pathname === `/${hello}/products` || pathname === "/dashboard") && (
            <>
              <span className="text-lg font-medium mr-4">Welcome {hello}</span>

              <button
                onClick={() => signOut({ callbackUrl: "/Login" })}
                className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-md text-sm font-medium"
              >
                Log Out
              </button>

              {pathname === "/dashboard" && (
                <Link href={`/${hello}/products`}>
                  <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium">
                    Products
                  </button>
                </Link>
              )}

              {pathname === `/${hello}/products` && (
                <Link href="/dashboard">
                  <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </button>
                </Link>
              )}
            </>
          )}

          {!session && (
            <Link href="/Login">
              <button className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-sm font-medium">
                Business Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
