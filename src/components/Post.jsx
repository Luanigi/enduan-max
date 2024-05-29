"use client"
import { HiOutlineDotsVertical } from "react-icons/hi"
import LikeSection from "./LikeSection"
import CommentSection from "./CommentSection"
import { doc, deleteDoc } from "firebase/firestore"
import { getFirestore } from "firebase/firestore"
import { app } from '@/firebase'
import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from "react"
import { AiOutlineClose } from 'react-icons/ai'
import Modal from 'react-modal'
import Link from "next/link"

Modal.defaultStyles.overlay.backgroundColor = '#333333AA';
Modal.defaultStyles.content.backgroundColor = '#222222CC';


export default function Post({post, onDeletePost}) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(onDeletePost ? true : false);
  const db = getFirestore(app);

  const handleDeletePost = async () => {
      try {
        await deleteDoc(doc(db, 'posts', post.id)); 
        console.log("Post deleted successfully!")
        onDeletePost(post.id);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
  }
  

 return (
    <div className="bg-zinc-700 my-7 border rounded-md mx-10">
      <div className="flex items-center p-5 border-bottom border-gray-100 border-b-2">
      {/* <Link href={`/profile/${post.username}`}> */}
        <img
          src={post.profileImg}
          alt={post.username}
          className="h-12 rounded-full object-cover border-2 border-slate-600 p-1 mr-3"
        />
      {/* </Link> */}
        <p className="flex-1 font-bold overflow-x-hidden">{post.username}</p>
        { session.user.username === post.username && (
          <button id="delete" onClick={() => setIsOpen(true)}>
            <HiOutlineDotsVertical className="cursor-pointer h-5" />
          </button>
        )}
      </div>

      <img src={post.image} alt={post.caption} className="object-cover w-full" />
      <LikeSection id={post.id} />
      <p className="p-5 overflow-x-hidden textdata">
        <span className="font-bold">{post.username}</span>
        <br /> {post.caption}
      </p>
      <CommentSection id={post.id} />
      {
        isOpen && (
          <Modal 
            isOpen={isOpen} 
            className={"max-w-md w-[350px] p-6 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] backdrop-blur-2xl border-none outline-none rounded-md shadow-2xl"} 
            onRequestClose={() =>setIsOpen(false)} 
            ariaHideApp={false}>

          <button
            onClick={() => handleDeletePost()} 
            className='w-full bg-zinc-900 text-red-600 p-2 shadow-lg rounded-lg hover:bg-zinc-800'>Delete Post</button>
          <AiOutlineClose className='cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-300' onClick={() => setIsOpen(false)} />
          </Modal>
        )
      }
    </div>

  );
}