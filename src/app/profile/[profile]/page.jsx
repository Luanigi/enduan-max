"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getFirestore } from 'firebase/firestore'
import { app } from '@/firebase'

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState(null);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`/api/profile/${session.user.username}`);
        if (!res.ok) throw new Error('Failed to fetch profile data');
        const data = await res.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfileData();
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error loading profile.</div>;
  }

  const { name, profileImageUrl } = profileData || {};

  return (
    <div className="text-center items-center justify-center">
      <div className=''>
        <img 
          src={session.user.image || '/default-profile-pic.png'} 
          alt="Profile Picture"
          className='m-auto rounded-full' />
        <h1 className='text-2xl font-bold'>{name || session.user.name}</h1>
      </div>
    </div>
  )}