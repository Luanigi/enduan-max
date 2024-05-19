"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function MiniProfile() {
    const {data: session} = useSession();
  return (
    <div className="flex items-center justify-between mt-14 ml-10">
        <img src={
            session?.user?.image || '/min-logo.png'} 
            alt="user-profile-pic" 
            className="w-16 h-16 rounded-full border-2 border-slate-700 p-[2px] cursor-pointer"/>
            <div className="flex-1 ml-4">
                <h2 className="font-bold">{session?.user?.username}</h2>
                <h3 className="text-sm text-gray-400">Welcome to Enduan Max</h3>
            </div>
            {session ? (
                <button
                onClick={signOut}
                className="text-blue-500 text-sm font-semibold">
                    Sign Out
                </button>
            ) : (
                <button
                onClick={signIn}
                className="text-blue-500 text-sm font-semibold">
                    Sign In
                </button>
            )}
    </div>
  )
}
