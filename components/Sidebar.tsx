import React, { SVGProps } from "react";
import { BellIcon, BookmarkIcon, CollectionIcon, DotsCircleHorizontalIcon, HashtagIcon, HomeIcon, MailIcon, UserIcon } from "@heroicons/react/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import SidebarRow from "./SidebarRow";

const sidebarContent: Array<{ Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element; title?: string; altTitle?: string }> = [
  { Icon: HomeIcon, title: "Home" },
  { Icon: HashtagIcon, title: "Explore" },
  { Icon: BellIcon, title: "Notifications" },
  { Icon: MailIcon, title: "Messages" },
  { Icon: BookmarkIcon, title: "Bookmarks" },
  { Icon: CollectionIcon, title: "Lists" },
  { Icon: UserIcon, title: "Sign In", altTitle: "Sign Out" },
  { Icon: DotsCircleHorizontalIcon, title: "More" },
];

function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col col-span-2 items-center px-4 md:items-start">
      <img src="https://links.papareact.com/drq" alt="Twitter logo" className="h-10 w-10 m-3" />

      {sidebarContent.map(({ Icon, title, altTitle }, index) => (
        <SidebarRow key={index} Icon={Icon} title={Icon === UserIcon && session ? altTitle : title} onClick={session ? signOut : signIn} />
      ))}
    </div>
  );
}

export default Sidebar;
