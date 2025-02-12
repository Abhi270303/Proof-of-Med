"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <div className="fixed z-50 w-full">
      <div className="mx-auto max-w-screen-2xl">
        {/* max-w-screen-2xl : Note */}
        <div className="relative px-4 flex items-center justify-between">
          <Link href={"/"} className="flex items-center gap-2 p-4">
            <img src="/icons/logo.svg" className="w-16" />
            <p className="-mt-1 text-xl font-large">Proof of Med</p>
          </Link>

          <Link
            href={"/app"}
            className={cn(buttonVariants(), "rounded-2xl px-6 py-6 text-sm")}
          >
            Open App
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
