import { Link as LinkIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const MainAction = () => {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className=" flex w-full items-center justify-center flex-col">
        <div className="grid place-items-center w-24 h-24 bg-primary rounded-3xl shadow-xl shadow-primary/40">
          <LinkIcon size={35} />
        </div>

        <p className=" text-[7rem]">Get Started</p>
        <p className="max-w-xs font-light text-center text-muted-foreground">
          Turn prescription into ZK Proof! Start using Proof of Med today. Sign up for
          a free trial.
        </p>
        <div className="w-full flex items-center gap-2 justify-center mt-8">
          <Button variant="secondary" className="rounded-xl text-xs">
            Request a demo
          </Button>
          <Button className="rounded-xl text-xs">Start for free</Button>
        </div>
      </div>
    </div>
  );
};

export default MainAction;
