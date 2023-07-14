import React, { SVGProps, useEffect, useState } from "react";
import { Comment, CommentBody } from "../typings";
import { ChatAlt2Icon, HeartIcon, SwitchHorizontalIcon, UploadIcon } from "@heroicons/react/outline";
import { fetchComment } from "../utils/fetchComment";
import { useSession } from "next-auth/react";
import TimeAgo from "react-timeago";
import toast from "react-hot-toast";

interface Props {
  _id: string;
  _createdAt: string;
  image?: string;
  profileImg: string;
  text: string;
  username: string;
}

const tweetIcons: Array<(props: SVGProps<SVGSVGElement>) => JSX.Element> = [ChatAlt2Icon, SwitchHorizontalIcon, HeartIcon, UploadIcon];

function Tweet({ _id, _createdAt, image, profileImg, text, username }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxIsopen, setCommentBoxIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const { data: session } = useSession();

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComment(_id);
    setComments(comments);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentToast = toast.loading("Posting Comments...");

    const comment: CommentBody = {
      comment: input,
      tweetId: _id,
      username: session?.user?.name || "Unknown User",
      profileImg: session?.user?.image || "https://links.papareact.com/gll",
    };

    const result = await fetch(`api/addComment`, {
      body: JSON.stringify(comment),
      method: "POST",
    });

    toast.success("Comment Posted!", {
      id: commentToast,
    });

    setInput("");
    setCommentBoxIsOpen(false);
    refreshComments();
  };

  const handleOpenBox = () => setCommentBoxIsOpen(!commentBoxIsopen);

  const userName = (username: string) => `@${username.replace(/\s+/g, "").toLocaleLowerCase()}`;

  useEffect(() => {
    refreshComments();
  }, []);

  return (
    <div className="flex flex-col space-x-3 border-y p-5 border-gray-100">
      <div className="flex space-x-3">
        <img src={profileImg} alt="Users profile" className="h-10 w-10 rounded-full object-cover" />

        <div>
          <div className="flex items-start space-x-1">
            <p className="mr-1 font-bold">{username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">{userName(username)} ·</p>

            <TimeAgo date={_createdAt} className="text-gray-500 text-sm" />
          </div>

          <p className="pt-1">{text}</p>

          {image && <img src={image} alt="Users posts" className="m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm" />}
        </div>
      </div>

      <div className="flex justify-between mt-5">
        {tweetIcons.map((Icon, index) => (
          <div onClick={Icon === ChatAlt2Icon ? () => session && handleOpenBox() : undefined} key={index} className="flex cursor-pointer items-center space-x-3 text-gray-400">
            <Icon className="h-5 w-5" />
            {Icon === ChatAlt2Icon && <p>{comments.length}</p>}
          </div>
        ))}
      </div>

      {commentBoxIsopen && (
        <form onSubmit={handleSubmit} className="mt-3 flex space-x-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Write a Comment..." className="flex-1 rounded-lg bg-gray-100 p-2 outline-none" />
          <button disabled={!input} type="submit" className="text-twitter disabled:text-gray-200">
            Post
          </button>
        </form>
      )}

      {comments.length > 0 && (
        <div className="my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5">
          {comments.map(({ _id, _createdAt, comment, profileImg, username }) => (
            <div key={_id} className="relative flex space-x-2">
              <hr className="absolute left-5 top-10 h-8 border-x border-twitter/30" />
              <img src={profileImg} alt="Users profile" className="mt-2 w-7 h-7 object-cover rounded-full" />
              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold">{username}</p>
                  <p className="hidden text-sm text-gray-400 sm:inline">{userName(username)} ·</p>

                  <TimeAgo date={_createdAt} className="text-sm text-gray-500" />
                </div>

                <p>{comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tweet;
