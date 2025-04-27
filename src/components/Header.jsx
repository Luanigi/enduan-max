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
    const [selectedFiles, setSelectedFiles] = useState([])
    const [imageFileUrls, setImageFileUrls] = useState([])
    const [uploading, setUploading] = useState(false)
    const [postUploading, setPostUploading] = useState(false)
    const [caption, setCaption] = useState('');
    const [canSearch, setCanSearch] = useState(true);
    const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const filePickerRef = useRef(null)
    const db = getFirestore(app)
    
    function addImagesToPost(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedFiles(files);
            const fileUrls = files.map(file => URL.createObjectURL(file));
            setImageFileUrls(fileUrls);
        }
    }

    useEffect(() => {
        if (selectedFiles.length > 0) {
            uploadImagesToStorage();
        }
    }, [selectedFiles])

    async function uploadImagesToStorage() {
        setUploading(true);
        setUploadProgress(0);
        
        const storage = getStorage(app);
        const uploadedUrls = [];
        
        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                setCurrentUploadIndex(i);
                const file = selectedFiles[i];
                const fileName = new Date().getTime() + '-' + file.name;
                const storageRef = ref(storage, fileName);
                
                const uploadTask = uploadBytesResumable(storageRef, file);
                
                // Wait for each upload to complete using a promise
                const url = await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state-changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Upload ${i+1}/${selectedFiles.length}: ${progress.toFixed(1)}%`);
                            setUploadProgress(progress);
                        },
                        (error) => {
                            console.log(error);
                            reject(error);
                        },
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadURL);
                        }
                    );
                });
                
                uploadedUrls.push(url);
            }
            
            setImageFileUrls(uploadedUrls);
            setUploading(false);
        } catch (error) {
            console.error("Error uploading images:", error);
            setUploading(false);
        }
    }

    async function handleSubmit() {
        if (imageFileUrls.length === 0) return;
        
        setPostUploading(true);
        try {
            const docRef = await addDoc(collection(db, 'posts'), {
                username: session?.user?.username,
                caption,
                profileImg: session.user.image,
                images: imageFileUrls,
                timestamp: serverTimestamp(),
            });
            
            setPostUploading(false);
            setSelectedFiles([]);
            setImageFileUrls([]);
            setIsOpen(false);
            setCaption('');
        } catch (error) {
            console.error("Error creating post:", error);
            setPostUploading(false);
        }
    }

  return (
    <div className='shadow-sm border-b border-slate-500 sticky top-0 z-30 p-3 bg-zinc-900/50 backdrop-blur-2xl'>
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

        {/* <SearchPost /> */}
        
        {/*menu items*/}

        {session ? (
            <div className='flex gap-2 items-center'>
            <IoMdAddCircleOutline className='text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600' onClick={()=>setIsOpen(true)}/>
            <Link href={`/profile/${session.user.username}`}>
                <img src={session.user.image} 
                    alt={session.user.name} 
                    className='h-10 w-10 rounded-full cursor-pointer' />
            </Link>
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
                        {selectedFiles.length > 0 ? (
                            <div className="w-full">
                                <div className="flex overflow-x-auto gap-2 pb-2 max-h-[250px]">
                                    {imageFileUrls.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Selected file ${index + 1}`}
                                            className={`h-[200px] w-auto object-cover rounded cursor-pointer ${uploading ? 'opacity-70' : ''}`}
                                            onClick={() => {
                                                if (!uploading) {
                                                    // Remove this image
                                                    const newFiles = [...selectedFiles];
                                                    newFiles.splice(index, 1);
                                                    setSelectedFiles(newFiles);
                                                    
                                                    const newUrls = [...imageFileUrls];
                                                    newUrls.splice(index, 1);
                                                    setImageFileUrls(newUrls);
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                                {uploading && (
                                    <div className="w-full bg-gray-300 rounded-full h-2.5 mt-3">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full" 
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Uploading image {currentUploadIndex + 1} of {selectedFiles.length} ({uploadProgress.toFixed(0)}%)
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : ( 
                            <HiCamera onClick={()=>filePickerRef.current.click()} className='text-5xl text-gray-400 cursor-pointer'/>
                        )}
                        <input 
                            ref={filePickerRef} 
                            hidden 
                            type="file" 
                            accept='image/*' 
                            multiple
                            onChange={addImagesToPost} />
                            
                        {selectedFiles.length > 0 && !uploading && (
                            <button 
                                onClick={() => filePickerRef.current.click()}
                                className="mt-2 text-blue-500 text-sm"
                            >
                                Add more photos
                            </button>
                        )}
                    </div>
                    <input 
                        type="text" 
                        maxLength='150' 
                        placeholder='Please enter your caption...' 
                        className='my-4 border-none text-center w-full focus:ring-0 outline-none bg-transparent text-white' 
                        onChange={(e) => setCaption(e.target.value)}
                        value={caption}
                    />
                        
                    <button 
                    onClick={handleSubmit}
                    
                    disabled={
                        selectedFiles.length === 0 || caption.trim() === '' || postUploading || uploading
                    }
                    
                    className='w-full bg-zinc-900 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-zinc-500 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:hover:brightness-100'>
                        {uploading ? `Uploading ${currentUploadIndex + 1}/${selectedFiles.length}...` : (selectedFiles.length > 0 ? `Upload Post (${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''})` : 'Select Images')}
                    </button>
                    
                    <AiOutlineClose className='cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-300' onClick={() => setIsOpen(false)} />
                </Modal>
            )
        }
    </div>
  )
}