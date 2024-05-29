"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { signIn, useSession, signOut } from 'next-auth/react'
import Modal from 'react-modal'
import {IoMdAddCircleOutline} from 'react-icons/io'
import { HiCamera } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'
import { app } from '@/firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage' 
import { addDoc, collection, doc, getFirestore, serverTimestamp } from 'firebase/firestore'


Modal.defaultStyles.overlay.backgroundColor = '#333333AA';
Modal.defaultStyles.content.backgroundColor = '#222222CC';

export default function Header() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [postUploading, setPostUploading] = useState(false)
    const [caption, setCaption] = useState('');
    const filePickerRef = useRef(null)
    const db = getFirestore(app)
    function addImageToPost(e) {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImageFileUrl(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        if (selectedFile) {
            uploadImageToStorage()
        }
    }, [selectedFile])

    async function uploadImageToStorage() {
        setImageFileUploading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + '-' + selectedFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile); 
        uploadTask.on(
            'state-changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('upload: ' + progress);
            },
            (error) => {
                console.log(error);
                setImageFileUploading(false);
                setImageFileUrl(null);
                setSelectedFile(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then (
                    (downloadURL) => {
                        setImageFileUrl(downloadURL);
                        setImageFileUploading(false)
                    }
                )
            }
        )
    }

    async function handleSubmit() {
        setPostUploading(true);
        const docRef = await addDoc(collection(db, 'posts'), {
            username: session.user.username,
            caption,
            profileImg: session.user.image,
            image: imageFileUrl,
            timestamp: serverTimestamp(),

        })
        setPostUploading(false);
        setIsOpen(false);
        location.reload();
    }
{/*}
    const search = () => {
        let search_input, post, a, i;
        search_input = document.getElementById("search").value.toLowerCase();
       
        post = document.getElementsByClassName(".textdata");
      
        for (i = 0; i < post.length; i++) {
          p = post[i].getElementsByTagName("p")[0];

          if (p.innerHTML.toLowerCase().indexOf(search_input) > -1) {
            p[i].style.display = "";
          } else {
            p[i].style.display = "none";
          }
        }
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("cliked");
            search();
        }
    });

*/}
  return (
    <div className='shadow-sm border-b border-slate-500 sticky top-0 z-30 p-3 bg-white/200 backdrop-blur-2xl'>
        <div className='flex justify-between items-center max-w-6xl mx-auto'>
        {/*logo*/}
        
        <Link href="/" className='hidden lg:inline-flex'>
            <Image
            src='/logo.png'
            width={96} 
            height={96} 
            alt='enduan max'
            />
        </Link>

        <Link href="/" className='lg:hidden inline-flex'>
            <Image
            src='/min-logo.png'
            width={40} 
            height={40} 
            alt='enduan max'
            />
        </Link>
        
        {/*search input*/}

        <input 
            type="search" 
            placeholder="Search" 
            aria-label="Search" 
            id='search'
            className='bg-zinc-700 outline-zinc-400 outline-2 p-3 rounded text-sm w-full py-2 px-4 max-w-[210px] ' />

        {/*menu items*/}

        {session ? (
            <div className='flex gap-2 items-center'>
            <IoMdAddCircleOutline className='text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600' onClick={()=>setIsOpen(true)}/>
            <img src={session.user.image} 
            alt={session.user.name} 
            className='h-10 w-10 rounded-full cursor-pointer' 
            onClick={signOut} />
            </div>
        ):(
            <button 
            onClick={signIn} 
            className='text-sm font-semibold text-blue-500'>Log In</button>
        )}

        </div>
        {
            isOpen && (
                <Modal isOpen={isOpen} className={"max-w-lg w-[90%] p-6 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] backdrop-blur-2xl border-2 border-zinc-600 outline-none rounded-md shadow-md"} onRequestClose={() =>setIsOpen(false)} ariaHideApp={false}>
                    <div className='flex flex-col justify-center items-center h-[100%]'>
                        {selectedFile ? (
                            <img
                                onClick={() => setSelectedFile(null)}
                                src={imageFileUrl}
                                alt='selected file'
                                className={`w-full rounded max-h-[250px] object-cover cursor-pointer ${imageFileUploading ? 'animate-pulse' : ''}`}/>
                        ) : ( 
                        <HiCamera onClick={()=>filePickerRef.current.click()} className='text-5xl text-gray-400 cursor-pointer'/>
                        )}
                        <input 
                            ref={filePickerRef} 
                            hidden 
                            type="file" 
                            accept='image/*' 
                            onChange={addImageToPost} />
                    </div>
                    <input 
                        type="text" 
                        maxLength='150' 
                        placeholder='Please enter your caption...' 
                        className='my-4 border-none text-center w-full focus:ring-0 outline-none bg-transparent text-white' 
                        onChange={(e) => setCaption(e.target.value)}/>
                        
                    <button 
                    onClick={handleSubmit}
                    
                    disabled={
                        !selectedFile || caption.trim() === '' || postUploading || imageFileUploading
                    }
                    
                    className='w-full bg-zinc-900 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-zinc-500 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:hover:brightness-100'>
                        {imageFileUploading ? 'Uploading...' : (selectedFile ? 'Upload Post' : 'Select Image')}
                    </button>
                    
                    <AiOutlineClose className='cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-300' onClick={() => setIsOpen(false)} />
                </Modal>
            )
        }
    </div>
  )
}
