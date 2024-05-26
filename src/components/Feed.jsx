"use client";

import MiniProfile from "./MiniProfile";
import Posts from "./Posts";
import { useSession, signIn } from 'next-auth/react'

export default function Feed() {
  const { data: session } = useSession();
  return (
    <>

    {session ? (
      <>
        <main className="grid grid-cols-1 md:grid-cols-3 md:max-w-6xl mx-auto">
        <section className="md:col-span-2">
          <Posts />
        </section>
        <section className="hidden md:inline-grid md:col-span-1">
          <div className="fixed w-[380px]">
            <MiniProfile />
          </div>
        </section>
        </main>
      </>
      ) : (
        <main className="w-2/4 mx-auto">
        <section className="text-center">
          <h1 className="text-3xl text-center pt-10">Welcome to Enduan MAX</h1>
          <p className="w-3/4 text-justify mx-auto p-5">
            Hey there!   Welcome to Enduan Max, the social 
            media platform where knowledge meets laughter 
            and anything goes (almost)! Tired of censored 
            content and echo chambers? We are too. Here, you 
            can explore a vast ocean of information, engage 
            in stimulating discussions, and have a blast 
            while you're at it.
          </p>

          <p className="w-3/4 text-justify mx-auto p-5">
            Enduan Max is built on the foundation of uncensored, 
            knowledge-based content. Dive deep into diverse topics, 
            share your unique perspectives, and learn from a vibrant 
            community. Don't be afraid to ask questions, challenge ideas, 
            and have a little fun along the way. We encourage healthy 
            debate, creativity, and a thirst for knowledge. So, buckle up, 
            unleash your curiosity, and get ready to experience a whole new 
            way to learn and connect!
          </p>

          <button
                onClick={signIn}
                className="text-blue-500 text-sm flex-1 m-auto font-semibold">
                    Sign In <span className="text-red-500"> NOW!!</span>
          </button>
        </section>
        </main>
      )}

      

      </>
  )
}
