import { useState } from 'react';
import { BsFillCameraFill, BsArrowLeft } from 'react-icons/bs';
import { FaRegPaperPlane } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { AiFillHome } from 'react-icons/ai';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../firebase.js';
import { useSession } from 'next-auth/react';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import Image from 'next/image';
import Link from 'next/link';

const createStory = () => {
  const [title, setTitle] = useState('');
  const [textBody, setTextBody] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState({
    success: false,
    msg: '',
    loading: false,
  });

  const { data: user } = useSession();

  const router = useRouter();
  const addImagePreview = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) =>
      setSelectedImage(readerEvent.target.result);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setStatus({ ...status, loading: true });
    const slug = title.split(' ').join('-').toLowerCase();
    try {
      const docRef = await setDoc(doc(db, 'stories', slug), {
        username: user?.user?.name || user?.user?.email,
        email: user.user.email,
        title,
        userImg:
          user?.user.image ||
          'https://firebasestorage.googleapis.com/v0/b/stories-28f15.appspot.com/o/stories%2Fdefault.png?alt=media&token=d293343d-1de7-488a-bf98-7e4e5af53f93',
        textBody,
        slug,

        timestamp: serverTimestamp(),
      });

      const imageRef = ref(storage, `stories/${slug}/image`);
      await uploadString(imageRef, selectedImage, 'data_url').then(
        async (snapshot) => {
          const downloadUrl = await getDownloadURL(imageRef);
          await updateDoc(doc(db, 'stories', slug), {
            image: downloadUrl,
          });
        }
      );
      setStatus({
        success: true,
        msg: 'Published successfully',
        loading: false,
      });
      setSelectedImage(null);
    } catch (error) {
      setStatus({
        success: false,
        msg: 'Something went wrong try again later',
        loading: false,
      });
    }
  };
  return (
    <section className="w-screen min-h-screen flex justify-center items-center px-4 py-8 overflow-x-hidden">
      <Link href={{ pathname: '/' }}>
        <div className="hover:brightness-125 cursor-pointer ease-out duration-200 absolute md:top-5 md:left-5 scale-90 top-1 left-1 text-blue-500 flex items-center justify-center gap-3  border-2 border-blue-500 rounded-md py-1 px-3">
          <BsArrowLeft className="text-base font-bold" />{' '}
          <AiFillHome className="text-xl font-bold" />
        </div>
      </Link>

      <form className="grid grid-cols-1 w-full max-w-4xl h-max gap-4 border shadow-md p-6 rounded-md">
        <div className="flex justify-center gap-4 items-center w-full ">
          {selectedImage && (
            <Image
              src={selectedImage}
              width={400}
              height={400}
              alt=""
              className="w-full max-w-sm rounded-md aspect-video"
            />
          )}
          <input type="file" hidden id="file" onChange={addImagePreview} />
          <label
            htmlFor="file"
            className="w-10 h-10 border-2 border-blue-500 rounded-full flex justify-center items-center"
          >
            <BsFillCameraFill className="text-xl text-blue-500" />
          </label>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title for your story"
          className="outline-none border-2 border-blue-500 rounded-md py-1 text-center w-full max-w-xs mx-auto"
        />
        <p className="text-center py-1 px-4 border rounded-md shadow-md">
          add <b className="font-semibold text-blue-500">||</b> to go another
          paragraph (eg. It was very fun.
          <b className="font-semibold text-blue-500">||</b>You should try it )
        </p>
        <textarea
          value={textBody}
          onChange={(e) => setTextBody(e.target.value)}
          placeholder="Tell us about your story here..."
          className="outline-none border-2 border-blue-500 rounded-md py-1 pl-2 pt-2 w-full min-h-[20rem]"
        />
        <button
          disabled={status.loading}
          onClick={handlePublish}
          type="submit"
          className="flex items-center justify-center gap-2 font-bold duration-200 ease-out border-2 border-blue-500 bg-blue-500 text-white mx-auto py-[0.3rem] px-4 rounded-md hover:bg-transparent hover:text-blue-500 disabled:bg-gray-400 disabled:border-gray-400"
        >
          {status.loading ? (
            <>Publishing...</>
          ) : (
            <>
              Publish <FaRegPaperPlane />
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default createStory;
