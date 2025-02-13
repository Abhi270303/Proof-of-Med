"use client";
import Actions from "@/components/actions";
import Footer from "@/components/footer";
import Info from "@/components/info";
import Landing from "@/components/landing";
import MainAction from "@/components/main-action";
import Navbar from "@/components/navbar";
import { TweetGridDemo } from "@/components/tweet-demo";

export default function Page() {
  return (
    <div>
      <Navbar />
      <Landing />
      <div className="hidden md:block">
        <Info />
        {/* <Actions /> */}
        {/* <TweetGridDemo /> */}
        <MainAction />
        <Footer />
      </div>
    </div>
  );
}
