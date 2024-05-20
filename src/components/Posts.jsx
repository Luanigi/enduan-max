"use client";

import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
  import { app } from '../firebase';
  import Post from './Post';
  import { useEffect, useState } from 'react';

  
  export default function Posts() {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      const db = getFirestore(app);
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newData = [];
        querySnapshot.forEach((doc) => {
          newData.push({ id: doc.id, ...doc.data() });
        });
        setData(newData);
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <div>
        {data.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    );
  }