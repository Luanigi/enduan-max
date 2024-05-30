"use client"

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { app } from '@/firebase';
import Moment from 'react-moment';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [blog, setBlog] = useState('');
  const [blogs, setBlogs] = useState([]);
  const db = getFirestore(app);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session?.user?.username) return;

    const blogToPost = blog;
    setBlog(''); 
    await addDoc(collection(db, 'blogs', session?.user?.username, 'posts'), {
      blog: blogToPost,
      username: session?.user?.username,
      userImage: session?.user?.image,
      timestamp: serverTimestamp(),
    });
  }

  useEffect(() => {
    if (!session?.user?.username) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'blogs', session?.user?.username, 'posts'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => {
        setBlogs(snapshot.docs);
      }
    );

    return () => unsubscribe();
  }, [db, session]);

  useEffect(() => {
    if (!session?.user?.username) return;

    const fetchProfileData = async () => {
      try {
        const res = await fetch(`/api/profile/${session.user.username}`);
        if (!res.ok) throw new Error('Failed to fetch profile data');
        const data = await res.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfileData();
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error loading profile.</div>;
  }

  const { name } = profileData || {};

  return (
    <div className="text-center items-center justify-center">
      <div className='mt-[5%] xl:w-1/4 md:w-3/4 m-auto'>
        <img
          src={session?.user?.image || '/default-profile-pic.png'}
          alt="Profile Picture"
          className='m-auto rounded-full'
        />
        <h1 className='text-2xl font-bold p-8'>{name || session?.user?.name}</h1>

        {blogs.length > 0 && (
          <div className='mx-10 max-h-[20rem] overflow-y-scroll'>
            {blogs.map((blog, id) => (
              <div
                key={id}
                className='flex items-center space-x-2 mb-2 justify-between bg-zinc-600 p-2 rounded-md text-wrap'
              >
                <img
                  src={blog.data().userImage}
                  alt='userimage'
                  className='h-7 rounded-full object-cover border border-slate-500 p-[2px]'
                />
                <p className='text-sm flex-1 truncate'>
                <span className='font-bold text-slate-200'>
                  {blog.data().username}
                </span>{' '}
                <br />
                  {blog.data().blog}
                </p>
                <Moment fromNow className='text-xs text-gray-400 pr-1'>
                  {blog.data().timestamp?.toDate()}
                </Moment>
              </div>
            ))}
          </div>
        )}

        {session && (
          <form onSubmit={handleSubmit} className='flex items-center p-4 gap-2 w-[500px] absolute bottom-0'>
          <h1 className='font-bold text-lg'>Blog:</h1>
          <input
            type='text'
            value={blog}
            onChange={(e) => setBlog(e.target.value)}
            placeholder='Add a new Blog post...'
            className='border-none flex w-full focus:ring-0 outline-none bg-transparent overflow-x-scroll'
          />
          <button
            disabled={!blog.trim()} 
            type='submit'
            className=' text-blue-400 bg-zinc-700 disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-zinc-800 text-center p-1 w-2/12 rounded'
          >
            Post
          </button>
          </form>
        )}
      </div>
    </div>
  );
}