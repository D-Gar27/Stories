import { useSession } from 'next-auth/react';
import MiniProfile from './MiniProfile';
import Stories from './Stories';

const Feed = ({ stories }) => {
  const { data } = useSession();
  return (
    <main
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:max-w-5xl xl:max-w-6xl mx-auto p-8
    ${!data && '!grid-cols-1 !max-w-3xl'}`}
    >
      {/* Stories */}
      <section className="w-full col-span-2">
        <Stories stories={stories} />
      </section>
      {/* Profile */}
      {data && (
        <section className="hidden xl:block">
          <div className="fixed">
            <MiniProfile />
          </div>
        </section>
      )}
    </main>
  );
};

export default Feed;
