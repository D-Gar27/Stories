import Head from 'next/head';
import Feed from '../components/Feed';
import Navbar from '../components/Navbar';
import SignInModal from '../components/SignInModal';
import ProfileModal from '../components/ProfileModal';

export default function Home() {
  return (
    <div className="scrollbar-thin scrollbar-track-black">
      <Head>
        <title>Stories</title>
        <meta
          name="description"
          content="Stories is a simple blog made for people who want to share their stories with the world"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Feed />

      {/* Is User Signned In Modal */}
      <SignInModal />
      <ProfileModal />
    </div>
  );
}
