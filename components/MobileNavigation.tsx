"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { avatarPlaceholder, navItems } from "@/constants";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signoutUser } from "@/lib/actions/user.actions";

interface props {
  ownerId: string;
  accountId: string;
  email: string;
  fullName: string;
  avatar: string;
}

const MobileNavigation = ({
  email,
  fullName,
  avatar,
  ownerId,
  accountId,
}: props) => {
  const [open, SetOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="mobile-header">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />
      <Sheet open={open} onOpenChange={SetOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="hamburger"
            width={30}
            height={30}
            className=""
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetHeader>
            <SheetTitle>
              <div className="header-user">
                <Image
                  src={avatar}
                  alt="user"
                  width={44}
                  height={44}
                  className="header-user-avatar "
                />
                <div className="sm:hidden lg:block">
                  <p className="subtitle-2 capitalize">{fullName}</p>
                  <p className="caption">{email}</p>
                </div>
              </div>
              <Separator className="mb-4 bg-light-200/0" />
            </SheetTitle>
            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
                {navItems.map(({ url, icon, name }) => (
                  <Link href={url} key={url}>
                    <li
                      className={cn(
                        "mobile-nav-item",
                        pathname === url && "shad-active "
                      )}
                    >
                      <Image
                        src={icon}
                        alt={name}
                        height={24}
                        width={24}
                        className={cn(
                          "nav-icon",
                          pathname === url && "nav-icon-active"
                        )}
                      />
                      <p>{name}</p>
                    </li>
                  </Link>
                ))}
              </ul>
            </nav>
            <Separator className="my-5 bg-light-200/0" />
            <div className="flex flex-col justify-between gap-5 pb-5">
              <FileUploader/>
              <Button type="submit" className="mobile-sign-out-button"
              onClick={async()=>await signoutUser()}>
                <Image
                  src="/assets/icons/logout.svg"
                  alt="logo"
                  width={24}
                  height={24}
                 
                />
                <p>logout</p>
              </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
