import { useRouter } from 'next/router';
import { AiFillHome } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';

const about = () => {
  const router = useRouter();
  return (
    <main className="flex justify-center items-center flex-col w-screen h-screen gap-[5rem] px-2 relative">
      <div
        onClick={() => router.push('/')}
        className="hover:brightness-125 ease-out duration-200 absolute top-5 left-5 text-blue-500 flex items-center justify-center gap-3  border-2 border-blue-500 rounded-md py-1 px-3 cursor-pointer"
      >
        <BsArrowLeft className="text-base font-bold" />{' '}
        <AiFillHome className="text-xl font-bold" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold">About Stories</h1>
      <h4 className="text-lg max-w-[70ch] text-center">
        This is just for a showcase. Not a real app but it has all features like
        (Authentication, CRUD Operations, Route Protecting). Made with{' '}
        <b>Firebase (firestore, authentication,storage)</b>, <b>Next JS</b>,{' '}
        <b>Tailwind CSS</b> and <b>Next Auth</b>
      </h4>
    </main>
  );
};

export default about;
