import React from "react";

import { navList } from "@/constants";
import NavItem from "./NavItem";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcherBtn } from "../ThemeSwitcherBtn";
import { Logo } from "../Logo";

function DesktopNavBar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />

          <div className="flex h-full">
            {navList.map((nav) => (
              <NavItem key={nav.name} link={nav.link} label={nav.name} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

export default DesktopNavBar;
