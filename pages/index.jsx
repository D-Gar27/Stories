import Head from 'next/head';
import Feed from '../components/Feed';
import Navbar from '../components/Navbar';
import SignInModal from '../components/SignInModal';
import ProfileModal from '../components/ProfileModal';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stories, setStories] = useState([]);
  useEffect(() => {
    const fetchStories = async () => {
      const q = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));
      const docSnap = await getDocs(q);
      const tempStories = docSnap.docs.map((story) => story.data());
      setStories(tempStories);
    };
    fetchStories();
  }, []);
  return (
    <div className="scrollbar-thin scrollbar-track-black">
      <Head>
        <title>Stories</title>
        <meta
          name="description"
          content="Stories is a simple blog made for people who want to share their stories with the world"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Feed stories={stories} />

      {/* Is User Signned In Modal */}
      <SignInModal />
      <ProfileModal />
    </div>
  );
}
