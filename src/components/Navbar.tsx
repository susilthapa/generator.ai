import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-10 h-fit border-b border-zinc-300 py-2">
      <div className="flex items-center justify-center h-full gap-2 px-8 mx-auto sm:justify-between max-w-7xl">
        <Link href="/gallery" className="items-center hidden gap-2 sm:flex">
          <p className="rounded-lg border-2 border-r-4 border-black px-2 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
            Generator AI
          </p>
        </Link>
        <div className="flex items-center gap-8 text-sm">
          <Link href="/gallery">Gallery</Link>
          {session?.user && (
            <>
              <Link href="/create"> Create Course</Link>
              <Link href="/settings">Settings</Link>
            </>
          )}
          <div className="flex items-center">
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
