"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { navList } from "@/constants";
import { ThemeSwitcherBtn } from "../ThemeSwitcherBtn";
import { UserButton } from "@clerk/nextjs";
import { Logo, LogoMobile } from "../Logo";
import NavItem from "./NavItem";

function MobileNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[548px]" side="left">
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {navList.map((nav) => (
                <NavItem
                  key={nav.name}
                  link={nav.link}
                  label={nav.name}
                  onClick={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

export default MobileNavBar;
