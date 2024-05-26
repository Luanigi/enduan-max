"use client";

import MiniProfile from "./MiniProfile";
import Posts from "./Posts";
import { useSession } from 'next-auth/react'

export default function Feed() {
  const { data: session } = useSession();
  return (
    <main className="grid grid-cols-1 md:grid-cols-3 md:max-w-6xl mx-auto">

    {session ? (
      <>
        <section className="md:col-span-2">
          <Posts />
        </section>
        <section className="hidden md:inline-grid md:col-span-1">
          <div className="fixed w-[380px]">
            <MiniProfile />
          </div>
        </section>
      </>
      ) : (
        <section className="md:inline-grid md:col-span-1">
          <div className="fixed w-[380px]">
            <MiniProfile />
          </div>
        </section>
      )}

      </main>
  )
}
