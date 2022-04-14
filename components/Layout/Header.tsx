// components/Layout/Header.tsx
import React from 'react'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0'

const Header = () => {
  const { user } = useUser()
  return (
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link href="/">
            <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 24 24" fill="none" stroke="#0095ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            </a>
          </Link>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
              {user && (
                  <div className="flex itemx-center justify-center mr-5 capitalize bg-blue-500 py-1 px-3 rounded-md text-white">
                      <Link href="/admin">
                          <a>
                              + Create
                          </a>
                      </Link>
                  </div>
              )}
            {user ? (
                <div className="flex items-center space-x-5">
                  <img alt="profile" className="rounded-full w-12 h-12" src={user.picture} />
                  &nbsp;{user.name}
                  <Link href="/api/auth/logout">
                    <a className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                      Logout
                    </a>
                  </Link>
                </div>
            ) : (
                <Link href="/api/auth/login">
                  <a className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    Login
                  </a>
                </Link>
            )}
          </nav>
        </div>
      </header>
  )
}

export default Header