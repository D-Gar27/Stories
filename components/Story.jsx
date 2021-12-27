import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaRegHeart, FaRegCommentDots } from 'react-icons/fa';
import Moment from 'react-moment';
import { useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase.js';

const Story = ({ data }) => {
  const { username, title, slug: storySlug, image, userImg } = data;
  const timestamp = new Date(data?.timestamp.seconds * 1000).toDateString();
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      return onSnapshot(
        query(
          collection(db, 'stories', storySlug, 'likes'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => setLikes(snapshot.docs)
      );
    }
  }, [router.isReady, storySlug]);

  useEffect(() => {
    if (router.isReady) {
      return onSnapshot(
        query(
          collection(db, 'stories', storySlug, 'comments'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => setComments(snapshot.docs)
      );
    }
  }, [router.isReady, storySlug]);

  return (
    <div className="w-full bg-white border rounded-md p-6 shadow-xl">
      <div className="max-w-xl mx-auto">
        <div className="flex w-full sm:justify-between sm:items-center sm:flex-row items-start justify-center flex-col mb-4">
          <div className="flex items-center justify-start gap-2">
            <Image
              src={userImg}
              width={32}
              height={32}
              alt="user"
              className="rounded-full"
            />
            <p className="text-sm text-gray-700 font-bold">{username}</p>
          </div>
          <Moment fromNow className="text-sm text-gray-500 mt-3 sm:mt-0">
            {timestamp}
          </Moment>
        </div>
        <Image
          src={image}
          layout="responsive"
          width={380}
          height={240}
          alt="post"
          className="rounded-md"
        />
        <Link
          href={{
            pathname: '/' + storySlug,
          }}
          passHref
        >
          <h1 className="mt-4 font-semibold hover:underline ease-out duration-100 cursor-pointer">
            <i>{title}</i>
          </h1>
        </Link>
        <div className="flex w-full mt-4 items-center justify-between">
          <p className="flex items-center gap-2 text-gray-500 text-sm">
            <FaRegHeart className="text-lg" /> {likes?.length}
          </p>
          <p className="flex items-center gap-2 text-gray-500 text-sm">
            <FaRegCommentDots className="text-lg" /> {comments?.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Story;
