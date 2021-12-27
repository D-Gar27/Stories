import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { signup } from '../firebase';
import Image from 'next/image';
import { AiOutlineLogin } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/router';

const Signin = ({ providers }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [same, setSame] = useState(true);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    success: false,
    msg: '',
  });

  const router = useRouter();

  useEffect(() => {
    setShowMessage(true);
    const timeId = setTimeout(() => {
      setShowMessage(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [status]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password || !confirm) {
      setStatus({ success: false, msg: 'Please provide value' });
      setSame(false);
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setStatus({ success: false, msg: 'Password not match' });
      setSame(false);
      setLoading(false);
      return;
    }
    setSame(true);
    try {
      await signup(email, password);
      setLoading(false);
      router.reload();
    } catch (error) {
      if (error?.code === 'auth/email-already-in-use') {
        setStatus({ success: false, msg: 'Email already in use' });
      }
      if (error?.code === 'auth/weak-password') {
        setStatus({
          success: false,
          msg: 'Password should be at least 6 characters',
        });
      }
      setLoading(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      setStatus({ success: false, msg: 'Please provide value' });
      setLoading(false);
      return;
    }
    try {
      const credentials = {
        email,
        password,
      };

      const res = await signIn(providers?.credentials?.id, {
        ...credentials,
        redirect: false,
      });
      if (res.error) {
        throw new Error(res.error);
      }
      setLoading(false);
      router.push('/');
    } catch (error) {
      setStatus({ success: false, msg: 'Email or password is not correct' });
      setLoading(false);
    }
  };
  return (
    <div
      className="w-screen h-screen grid place-content-center place-items-center "
      style={{
        backgroundImage: "url('/images/bg.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="border rounded-md shadow-lg p-8 w-full sm:w-96 bg-white">
        <div className="flex items-center gap-2 justify-center w-full">
          <Image src={'/images/logo.png'} width={40} height={30} alt="" />
          <h1 className="text-3xl lobster text-blue-500 font-bold">Stories</h1>
        </div>
        <form className="flex flex-col gap-4 mt-10 relative">
          {showMessage ? (
            <p
              className={`absolute scale-0 top-1/2 text-center left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md py-1 px-2 z-40 w-full border-2 bg-white shadow-lg ${
                status.success ? '' : 'border-red-500'
              } ${status.msg !== '' && '!scale-100'}`}
            >
              {status.msg !== '' && status.msg}
            </p>
          ) : (
            ''
          )}
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none text-base ring-0 py-1 pl-2 border-b-[1px] border-b-blue-500"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full text-base outline-none ring-0 py-1 pl-2 border-b-[1px] ${
              !same ? '!border-b-red-500' : 'border-b-blue-500'
            }`}
          />
          {!isSignIn && (
            <input
              required
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full text-base outline-none ring-0 py-1 pl-2 border-b-[1px] ${
                !same ? '!border-b-red-500' : 'border-b-blue-500'
              }`}
            />
          )}
          {isSignIn ? (
            <button
              type="submit"
              disabled={loading}
              onClick={handleSignin}
              className="text-sm disabled:bg-gray-300 disabled:border-gray-300 font-semibold py-2 w-full bg-blue-500 hover:bg-transparent text-white hover:text-blue-500 ease-out transition-all border border-blue-500 rounded-md flex items-center justify-center gap-2"
            >
              {loading ? 'Siginning in...' : 'Sign in'}
              <AiOutlineLogin className="font-bold text-xl" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              onClick={handleSignUp}
              className="text-sm font-semibold disabled:bg-gray-300 disabled:border-gray-300 py-2 w-full bg-blue-500 hover:bg-transparent text-white hover:text-blue-500 ease-out transition-all border border-blue-500 rounded-md flex items-center justify-center gap-2"
            >
              {loading ? 'Signning up...' : 'Sign up'}
            </button>
          )}
        </form>
        {!isSignIn ? (
          <h5 className="my-2 text-sm text-center">
            Already have one?{' '}
            <b
              className="text-blue-500 cursor-pointer"
              onClick={() => setIsSignIn(true)}
            >
              Sign in
            </b>{' '}
            now
          </h5>
        ) : (
          <h5 className="my-2 text-sm text-center">
            Dont have an account?{' '}
            <b
              className="text-blue-500 cursor-pointer"
              onClick={() => setIsSignIn(false)}
            >
              Sign up
            </b>{' '}
            for free
          </h5>
        )}
        <h4 className="mb-4 text-gray-500 font-semibold text-center">Or</h4>
        <div
          key={providers?.google?.name}
          className="flex justify-center items-center"
        >
          <button
            onClick={() => signIn(providers?.google?.id, { callbackUrl: '/' })}
            className="flex items-center gap-2 py-2 w-full border justify-center rounded-md hover:text-blue-500 hover:border-blue-500 ease-out transition-all"
          >
            Sign in with{' '}
            <span>
              <FcGoogle className="text-xl" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
export default Signin;
