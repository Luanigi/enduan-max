"use client";

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { signIn, useSession, signOut } from 'next-auth/react'
import { app } from '@/firebase'
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore'


export default function page() {
  const { data: session } = useSession();
  const db = getFirestore(app)

async function userData() {
  const docRef = await addDoc(collection(db), {
    username: session.user.username,
    profileImg: session.user.image,
    image: imageFileUrl,
})}
  return (
    <>
    {session ? (
      <div className='flex gap-2 items-center'>
      <IoMdAddCircleOutline className='text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600' onClick={()=>setIsOpen(true)}/>
      <img src={session.user.image} 
      alt={session.user.name} 
      className='h-10 w-10 rounded-full cursor-pointer' 
      onClick={signOut} />
      <p>{session.user.username}</p>
      </div>
  ):(
      <button 
      onClick={signIn} 
      className='text-sm font-semibold text-blue-500'>Log In</button>
  )}
  </>
  )
}
