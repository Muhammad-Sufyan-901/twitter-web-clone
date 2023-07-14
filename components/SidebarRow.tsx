import { UserIcon } from "@heroicons/react/outline";
import React, { SVGProps } from "react";

interface Props {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  onClick?: () => {};
  title?: string;
}

function SidebarRow({ Icon, onClick, title }: Props) {
  return (
    <div onClick={Icon === UserIcon ? () => onClick?.() : undefined} className="group flex max-w-fit cursor-pointer items-center space-x-2 px-4 py-3 rounded-full transition-all duration-200 hover:bg-gray-100">
      <Icon className="h-6 w-6" />
      <p className="hidden text-base font-light group-hover:text-twitter md:inline-flex lg:text-xl">{title}</p>
    </div>
  );
}

export default SidebarRow;
