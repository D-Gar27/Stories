import Image from 'next/image';
import { HiMenuAlt3 } from 'react-icons/hi';
import { AiFillHome, AiOutlineCloseSquare } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { signInModalState } from '../atoms/signInModalAtom.js';
import { signOutModalState } from '../atoms/SignOutModalAtom.js';
import React, { useState } from 'react';

const Navbar = () => {
  const router = useRouter();
  const { data } = useSession();
  const [isSignnedIn, setIsSignnedIn] = useRecoilState(signInModalState);
  const [isSignningOut, setIsSignningOut] = useRecoilState(signOutModalState);
  const [menu, setMenu] = useState(false);

  return (
    <>
      <nav className="h-16 shadow-md relative z-40">
        {/* CONTAINER */}
        <div className="flex justify-between items-center h-full w-full max-w-screen-xl mx-auto px-4">
          {/* LEFT */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image src="/images/logo.png" width={24} height={24} alt="" />
            <h2 className=" text-blue-500 font-bold lobster text-lg">
              Stories
            </h2>
          </div>

          {/* RIGHT */}
          <div className="flex items-center md:gap-5 gap-3">
            <AiFillHome
              className="navlink text-lg"
              onClick={() => router.push('/')}
            />
            <div className="hidden md:flex items-center gap-5">
              <a
                className="navlink"
                onClick={() => {
                  if (data) {
                    setIsSignnedIn(false);
                    router.push('/create-story');
                  } else {
                    return setIsSignnedIn(true);
                  }
                }}
              >
                Create
              </a>
              <a
                className="navlink"
                onClick={() => {
                  if (data) {
                    setIsSignnedIn(false);
                    router.push('/about');
                  } else {
                    setIsSignnedIn(true);
                  }
                }}
              >
                About
              </a>
            </div>
            {data ? (
              <div onClick={() => setIsSignningOut(true)}>
                <Image
                  src={
                    data?.user?.image ? data.user.image : '/images/default.png'
                  }
                  width={30}
                  height={30}
                  className="rounded-full cursor-pointer"
                  alt=""
                />
              </div>
            ) : (
              <p
                onClick={() => router.push('/signin')}
                className="text-blue-500 text-sm font-semibold cursor-pointer hover:bg-blue-500 hover:text-white transition-all ease-out duration-200 py-1 px-4 rounded-3xl border border-blue-500"
              >
                Sign in
              </p>
            )}
            <HiMenuAlt3
              className="text-blue-500 md:hidden text-lg"
              onClick={() => setMenu(!menu)}
            />
          </div>
        </div>
      </nav>
      <div
        className={`flex items-center justify-center gap-6 flex-col ease-out duration-00 transition-all bg-white fixed h-[100vh] w-screen z-50 m-0 translate-x-full ${
          menu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <AiOutlineCloseSquare
          className="navlink absolute top-3 left-3 text-2xl font-semibold"
          onClick={() => setMenu(false)}
        />
        <a
          className="navlink !text-base"
          onClick={() => {
            if (data) {
              setIsSignnedIn(false);
              router.push('/create-story');
            } else {
              return setIsSignnedIn(true);
            }
          }}
        >
          Create
        </a>
        <a
          className="navlink !text-base"
          onClick={() => {
            if (data) {
              setIsSignnedIn(false);
              router.push('/about');
            } else {
              setIsSignnedIn(true);
            }
          }}
        >
          About
        </a>
      </div>
    </>
  );
};

export default Navbar;
