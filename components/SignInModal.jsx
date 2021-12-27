import { useRecoilState } from 'recoil';
import { signInModalState } from '../atoms/signInModalAtom';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/router';

const SignInModal = () => {
  const [isSignnedIn, setIsSignnedIn] = useRecoilState(signInModalState);
  const router = useRouter();
  return (
    <Transition.Root show={isSignnedIn} as={Fragment}>
      <Dialog
        as={'div'}
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => setIsSignnedIn(false)}
      >
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter=" duration-300 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="duration-150 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter=" duration-300 ease-out"
            enterFrom="translate-y-4 sm:translate-y-0 sm:scale-95 opacity-0"
            enterTo="translate-y-0 sm:scale-100 opacity-100"
            leave=" duration-200 ease-in"
            leaveFrom="translate-y-0 sm:scale-100 opacity-100"
            leaveTo="translate-y-4 sm:translate-y-0 sm:scale-95 opacity-0"
          >
            <div className="inline-block align-bottom bg-white rounded-lg p-4 text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <h1 className="font-bold ">
                You need to create account or sign in
              </h1>
              <button
                onClick={() => router.push('/signin')}
                className="outline-none py-2 px-6 rounded-md mt-4 mx-auto text-blue-500 hover:text-white hover:bg-blue-500 text-sm bg-transparent border-2 border-blue-500 duration-200"
              >
                Sign In
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SignInModal;
