import React, { Dispatch, MouseEvent, SetStateAction, SVGProps, useRef, useState } from "react";
import { CalendarIcon, EmojiHappyIcon, LocationMarkerIcon, PhotographIcon, SearchCircleIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { Tweet, TweetBody } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";
import toast from "react-hot-toast";

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}

const tweetBoxIcons: Array<(props: SVGProps<SVGSVGElement>) => JSX.Element> = [PhotographIcon, SearchCircleIcon, EmojiHappyIcon, CalendarIcon, LocationMarkerIcon];

function TweetBox({ setTweets }: Props) {
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const { data: session } = useSession();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleOpenBox = () => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen);

  const addImageToTweet = (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();

    if (!imageInputRef.current?.value) return;

    setImage(imageInputRef.current.value);
    imageInputRef.current.value = "";
    setImageUrlBoxIsOpen(false);
  };

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || "Unknown User",
      profileImg: session?.user?.image || "https://links.papareact.com/gll",
      image: image,
    };

    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetInfo),
      method: "POST",
    });

    const json = await result.json();

    const newTweets = await fetchTweets();
    setTweets(newTweets);

    toast("Tweet Posted", {
      icon: "✅",
    });

    return json;
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.preventDefault();

    postTweet();

    setInput("");
    setImage("");
    setImageUrlBoxIsOpen(false);
  };

  return (
    <div className="flex space-x-2 p-5">
      <img src={session?.user?.image || "https://links.papareact.com/gll"} alt="TweetBox pics" className="h-14 w-14 object-cover rounded-full mt-4" />

      <div className="flex flex-1 items-center pl-2">
        <form className="flex flex-1 flex-col">
          <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="What's Happening?" className="h-24 w-full text-xl outline-none placeholder:text-xl" />
          <div className="flex items-center">
            <div className="flex flex-1 space-x-2 text-twitter">
              {tweetBoxIcons.map((Icon, index) => (
                <Icon key={index} onClick={Icon === PhotographIcon ? () => handleOpenBox() : undefined} className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150" />
              ))}
            </div>

            <button onClick={handleSubmit} disabled={!input || !session} className="bg-twitter px-5 py-2 font-bold text-white rounded-full disabled:opacity-40">
              Tweet
            </button>
          </div>

          {imageUrlBoxIsOpen && (
            <form className="mt-5 rounded-lg flex bg-twitter/80 py-2 px-4">
              <input ref={imageInputRef} type="text" placeholder="Enter Image Url..." className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white" />
              <button onClick={addImageToTweet} className="font-bold text-white">
                Add Image
              </button>
            </form>
          )}

          {image && <img src={image} alt="Users tweet images" className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg" />}
        </form>
      </div>
    </div>
  );
}

export default TweetBox;
