import React, { useState } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import { Tweet } from "../typings";
import TweetBox from "./TweetBox";
import TweetComponent from "./Tweet";
import { fetchTweets } from "../utils/fetchTweets";
import toast from "react-hot-toast";

interface Props {
  tweets: Tweet[];
}

function Feed({ tweets: tweetsProp }: Props) {
  const [tweets, setTweets] = useState<Tweet[]>(tweetsProp);

  const handleRefresh = async () => {
    const tweets: Tweet[] = await fetchTweets();
    const refreshToast = toast.loading("Refreshing...");

    setTweets(tweets);
    toast.success("Feed Updated!", {
      id: refreshToast,
    });
  };

  return (
    <div className="col-span-7 max-h-screen overflow-scroll scrollbar-hide lg:col-span-5 border-x">
      <div className="flex items-center justify-between">
        <h1 className="p-5 pb-0 text-xl font-bold">Home</h1>
        <RefreshIcon onClick={handleRefresh} className="mr-5 mt-5 w-8 h-8 cursor-pointer text-twitter transition-all duration-500 ease-out hover:rotate-180 active:scale-125" />
      </div>

      {/* TweetBox */}
      <div>
        <TweetBox setTweets={setTweets} />
      </div>

      {/* Feeds */}
      <div>
        {tweets.map(({ _id, _createdAt, image, profileImg, text, username }) => (
          <TweetComponent key={_id} _id={_id} _createdAt={_createdAt} image={image} profileImg={profileImg} text={text} username={username} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
