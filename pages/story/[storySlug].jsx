import Image from 'next/image';
import Navbar from '../../components/Navbar';
import {
  FaRegHeart,
  FaRegCommentDots,
  FaPaperPlane,
  FaTrash,
  FaHeart,
  FaEdit,
  FaCheck,
} from 'react-icons/fa';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebase.js';
import { useSession } from 'next-auth/react';
import Moment from 'react-moment';
import { useRecoilState } from 'recoil';
import { signInModalState } from '../../atoms/signInModalAtom';
import SignInModal from '../../components/SignInModal';
import Link from 'next/link';
import { AiFillHome } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';
import Head from 'next/head';

const FullStory = ({ story: storyData }) => {
  const story = JSON.parse(storyData);
  const router = useRouter();
  const { storySlug } = router.query;

  const [commentToAdd, setCommentToAdd] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toEdit, setToEdit] = useState({
    title: '',
    textBody: '',
  });

  const { data: user } = useSession();

  const [isSignnedIn, setIsSignnedIn] = useRecoilState(signInModalState);

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
    let isMounted = true;
    if (isMounted) {
      setHasLiked(
        likes.findIndex((like) => like.id === user?.user?.email) !== -1
      );
    }
    return () => (isMounted = false);
  }, [likes, user]);

  const addCommentToStory = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsSignnedIn(true);
      return;
    }
    if (!commentToAdd) {
      return;
    }

    try {
      await addDoc(collection(db, 'stories', storySlug, 'comments'), {
        comment: commentToAdd,
        userImg: user?.user?.image,
        username: user?.user?.name || user?.user?.email,
        email: user?.user?.email,
        timestamp: serverTimestamp(),
      });
      setCommentToAdd('');
    } catch (error) {
      console.log(error);
    }
  };
  const addLikeToStory = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsSignnedIn(true);
      return;
    }

    try {
      if (hasLiked) {
        await deleteDoc(
          doc(db, 'stories', storySlug, 'likes', user?.user?.email)
        );
        return;
      }
      await setDoc(doc(db, 'stories', storySlug, 'likes', user?.user?.email), {
        userImg: user?.user?.image,
        username: user?.user?.name || user?.user?.email,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (id) => {
    try {
      await deleteDoc(doc(db, 'stories', storySlug, 'comments', id));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStory = async () => {
    try {
      await deleteDoc(doc(db, 'stories', storySlug));
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const updateStory = async () => {
    try {
      await updateDoc(doc(db, 'stories', storySlug), toEdit);
      setEditing(false);
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const timestamp = new Date(story?.timestamp.seconds * 1000);

  if (router.isFallback) return null;
  return (
    <>
      <Head>
        <title>Stories | {story?.title}</title>
        <meta
          name="description"
          content="Stories is a simple blog made for people who want to share their stories with the world"
        />
      </Head>

      <main className="w-screen min-h-screen overflow-x-hidden">
        <Navbar />
        <SignInModal />
        <section className="w-full max-w-xl md:max-w-2xl xl:max-w-4xl mx-auto mt-8 px-3">
          <Link href={{ pathname: '/' }} passHref>
            <div
              className="hover:brightness-125 cursor-pointer ease-out duration-200 scale-90 text-blue-500 flex items-center justify-center gap-3 border-2 border-blue-500 rounded-md py-1 px-3 mt-4 mb-4
              max-w-[7rem] w-full"
            >
              <BsArrowLeft className="text-base font-bold" />{' '}
              <AiFillHome className="text-xl font-bold" />
            </div>
          </Link>
          {story.image ? (
            <Image
              src={story.image}
              width={200}
              height={120}
              layout="responsive"
              alt="story"
              className="aspect-video w-full max-w-lg rounded-md mx-auto"
            />
          ) : (
            <div className="w-full rounded-md mx-auto h-[30rem] bg-blue-200 flex justify-center items-center font-bold text-xl">
              Loading...
            </div>
          )}
          <div className="flex w-full justify-between items-center mt-4">
            <div className="flex items-center justify-start gap-2">
              {story?.userImg && (
                <Image
                  src={story.userImg}
                  width={32}
                  height={32}
                  alt="user"
                  className="rounded-full"
                />
              )}
              <p className="text-sm text-gray-700 font-bold">
                {story?.username}
              </p>
            </div>
            <Moment fromNow className="text-gray-600">
              {timestamp}
            </Moment>
          </div>
          {editing ? (
            <input
              type="text"
              onChange={(e) => setToEdit({ ...toEdit, title: e.target.value })}
              value={toEdit?.title}
              className="text-lg text-center font-semibold mt-4 mb-7 py-1 w-full text-black border-blue-500 border-2 rounded-md"
            />
          ) : (
            <h1 className="text-xl text-center font-semibold mt-4 mb-7">
              {story?.title}
            </h1>
          )}

          {editing ? (
            <textarea
              value={toEdit.textBody}
              onChange={(e) =>
                setToEdit({ ...toEdit, textBody: e.target.value })
              }
              name=""
              className="w-full min-h-[20rem] border-2 border-blue-500 rounded-md pl-2 pt-1"
            ></textarea>
          ) : (
            <>
              {story?.textBody.includes('||') ? (
                story.textBody.split('||').map((para, i) => {
                  return (
                    <p className="mt-2 font-medium" key={i}>
                      {para}
                    </p>
                  );
                })
              ) : (
                <p className="mt-2 font-medium">{story?.textBody}</p>
              )}
            </>
          )}

          <div className="flex w-full mt-4 items-center justify-between">
            <p
              className="flex items-center gap-2 text-gray-500 text-lg"
              onClick={addLikeToStory}
            >
              {hasLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}{' '}
              {likes.length}
            </p>
            {user && user?.user?.email === story?.email && (
              <div className="flex items justify-center gap-3">
                {editing ? (
                  <FaCheck
                    onClick={updateStory}
                    className="text-green-400 hover:text-green-500 text-xl cursor-pointer"
                  />
                ) : (
                  <FaEdit
                    className="text-cyan-400 hover:text-cyan-500 text-xl cursor-pointer"
                    onClick={() => setEditing(true)}
                  />
                )}
                <FaTrash
                  className="text-red-400 hover:text-red-500 text-lg cursor-pointer"
                  onClick={deleteStory}
                />
                {editing && (
                  <p
                    onClick={() => setEditing(false)}
                    className="text-red-400 hover:text-red-500 text-base cursor-pointer"
                  >
                    cancel
                  </p>
                )}
              </div>
            )}
            <p className="flex items-center gap-2 text-gray-500 text-lg">
              <FaRegCommentDots /> {comments.length}
            </p>
          </div>
          <section className="w-full mx-auto h-max bg-gray-50 p-6 my-6 relative">
            {comments &&
              comments.map((comment) => {
                const {
                  username,
                  userImg,
                  comment: userComment,
                  timestamp,
                  email,
                } = comment.data();
                return (
                  <div className="w-full mb-6 bg-white p-2" key={comment.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-start gap-2">
                        {' '}
                        <Image
                          src={userImg}
                          width={34}
                          height={34}
                          alt="user"
                          className="rounded-full"
                        />
                        <p>{username}</p>
                      </div>
                      {user && email === user?.user?.email && (
                        <FaTrash
                          className="text-red-400 hover:text-red-500 text-lg cursor-pointer"
                          onClick={() => deleteComment(comment.id)}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between w-full px-4 mt-6">
                      <p className="font-medium">{userComment}</p>
                      <Moment
                        fromNow
                        className="text-sm text-gray-500 font-medium"
                      >
                        {timestamp?.toDate()}
                      </Moment>
                    </div>
                  </div>
                );
              })}
            <form className="flex items-center w-full max-w-[19.5rem] mx-auto justify-center border rounded-md border-blue-500 h-[2.75rem] gap-2 p-0">
              <input
                type="text"
                value={commentToAdd}
                onChange={(e) => setCommentToAdd(e.target.value)}
                name="comment"
                placeholder="Your thoughts for this story"
                className="w-full bg-transparent max-w-[15rem] outline-none pl-2"
                required
              />
              <button
                onClick={addCommentToStory}
                className="h-[2.75rem] text-white font-bold hover:text-blue-500 hover:bg-transparent ease-out duration-200 transition-all text-base rounded-tr-md rounded-br-md border-l-2 border-blue-500 bg-blue-500 w-full max-w-[4rem] flex justify-center items-center"
              >
                <FaPaperPlane />
              </button>
            </form>
          </section>
        </section>
      </main>
    </>
  );
};

export default FullStory;

export const getStaticPaths = async () => {
  let docss = [];
  const docRef = collection(db, 'stories');
  const docSnap = await getDocs(docRef);

  docSnap.docs.forEach((doc) => docss.push(doc.data()));
  const paths = docss.map((data) => ({
    params: { storySlug: data.slug },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const storySlug = params.storySlug;

  let story = {};

  const docRef = doc(db, 'stories', storySlug);
  const docSnap = await getDoc(docRef);
  story = docSnap.data();
  return {
    props: { story: JSON.stringify(story) } || null,
    revalidate: 100,
  };
};
