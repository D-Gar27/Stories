import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaCog, FaUser } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import { signOutModalState } from '../atoms/SignOutModalAtom.js';

const MiniProfile = () => {
  const { data } = useSession();
  const [isStignningOut, setIsSignningOut] = useRecoilState(signOutModalState);
  return (
    <section className="w-full mx-auto mt-6 flex justify-between items-center p-6 border shadow-md ml-10 rounded-md">
      <div className="flex items-center gap-2">
        <Image
          src={data?.user?.image ? data.user.image : '/images/default.png'}
          width={40}
          height={40}
          className="rounded-full"
          alt=""
        />

        <div>
          <h3 className="text-base font-semibold text-gray-500">
            {data?.user?.name ? data?.user?.name : data?.user.email}
          </h3>
        </div>
      </div>

      <div
        className="user-mini relative flex items-center justify-center text-blue-500 cursor-pointer"
        onClick={() => setIsSignningOut(true)}
      >
        <FaUser className="text-xl" />{' '}
        <FaCog className="text-xs user-cog ease-out transition-all duration-300" />
      </div>
    </section>
  );
};

export default MiniProfile;
