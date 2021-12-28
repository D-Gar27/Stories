import Link from 'next/link';

const NotFound = () => {
  return (
    <main className="w-screen h-screen bg-white flex justify-center items-center flex-col gap-6">
      <h1 className="text-red-500 text-6xl md:text-7xl font-bold">404</h1>
      <h3 className="font-semibold text-xl text-center">
        Looks like we need to make a page for this one
      </h3>
      <Link href={'/'} passHref>
        <button className="font-medium text-base border-2 border-blue-500 bg-blue-500 text-white py-1 px-6 rounded-md duration-200 ease-out transition-all hover:bg-white hover:text-blue-500">
          Home
        </button>
      </Link>
    </main>
  );
};

export default NotFound;
