import React from "react";
import TopGainer from "./top-gainer";
import TopLoser from "./top-loser";
import Top20Grid from "./top-20";

const Mindshare = () => {
  return (
    <div className="mt-8">
      <p className="px-4">Yapper Mindshare</p>

      <div className="grid grid-cols-12 w-full gap-4 px-4 mt-6">
        <div className="col-span-5">
          <TopGainer />
        </div>
        <div className="col-span-7 row-span-2">
          <Top20Grid />
        </div>
        <div className="col-span-5">
          <TopLoser />
        </div>
      </div>
    </div>
  );
};

export default Mindshare;
