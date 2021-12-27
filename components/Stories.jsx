import { useEffect, useState } from 'react';
import Story from './Story';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

const Stories = ({ stories }) => {
  return (
    <div className="w-full mx-auto mt-6 flex flex-col gap-4 justify-center">
      {stories.map((story) => (
        <Story key={story?.slug} data={story} />
      ))}
    </div>
  );
};

export default Stories;
