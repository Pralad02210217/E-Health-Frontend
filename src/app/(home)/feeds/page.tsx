import React from 'react';
import CreateFeedPage from './_components/CreateFeed';
import FeedDisplay from './_components/DisplayFeed';

function Page() {
  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* Create Feed at the Top */}
    <div className="w-[300px] ml-auto ">
      <CreateFeedPage />
    </div>

      {/* Feed Display Below */}
      <div className="w-full max-w-2xl">
        <FeedDisplay />
      </div>
    </div>
  );
}

export default Page;
