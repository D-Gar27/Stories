import { useEffect, useState } from 'react';
import Story from './Story';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

const Stories = () => {
  const [stories, setStories] = useState([]);
  useEffect(() => {
    let controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      const q = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q, { signal });
      setStories(snapshot.docs);
      controller = null;
    })();
    return () => controller?.abort();
  }, []);
  return (
    <div className="w-full mx-auto mt-6 flex flex-col gap-4 justify-center">
      {stories.map((story) => (
        <Story key={story.data().slug} data={story} />
      ))}
    </div>
  );
};

export default Stories;
