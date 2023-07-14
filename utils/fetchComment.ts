import { Comment } from "../typings";

export const fetchComment = async (tweetId: string) => {
  const res = await fetch(`/api/getComments?tweetId=${tweetId}`);

  const comment: Comment[] = await res.json();

  return comment;
};
