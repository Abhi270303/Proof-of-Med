import React from "react";

const Landing = () => {
  return (
    <div>
      {/* Desktop Layout */}
      <div className="hidden md:grid h-screen place-items-center pt-20">
        <div className="-mt-20">
          <div className="flex items-center gap-0 relative">
            <div className="h-20 w-20 bg-white/10 rounded-full grid place-items-center relative z-10">
              <img src={"/icons/bolt.svg"} className="h-6" />
            </div>
            <div className="h-20 w-20 -translate-x-6 bg-[#EA580B] rounded-full grid place-items-center relative z-20">
              <img src={"/icons/line-dotted.svg"} className="w-8" />
            </div>
            <div className="text-center leading-none -translate-x-4">
              <p className="text-[6rem] font-medium">Ensuring Secure</p>
            </div>
            <div className="absolute w-60 rounded-b-2xl rounded-r-2xl h-48 top-0 bg-black right-0">
              <img
                src={"/icons/light.png"}
                className="w-full h-full object-fill"
              />
              <div className="absolute w-12 h-12 rounded-full grid place-items-center bg-[#EA580B] drop-shadow-lg text-white -top-6 -left-6">
                <img src="/icons/play.svg" className="w-3" />
              </div>
            </div>
          </div>
          <div className="min-w-full text-[6rem] leading-none mt-2">
            <p className="flex items-center -ml-24">
              <span>&</span>{" "}
              <span className="text-muted-foreground/30 mx-4">Private Prescription </span> 
            </p>
          </div>
          <div className="min-w-full text-[6rem] leading-none mt-2">
            <p className="flex items-center gap-4">
              <span>Verification</span>
              <span className="h-20 w-20 bg-[#EA580B] rounded-full grid place-items-center mx-2">
                <img src={"/icons/lines.svg"} className="w-5" />
              </span>
              <span>with ZKPs</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Bento Grid Layout */}
      <div className="md:hidden min-h-screen p-4">
        <div className="grid grid-cols-2 gap-4 mt-16">
          {/* Analytics Title Card */}
          <div className="col-span-2 bg-[#EA580B] rounded-3xl p-6 shadow-sm border">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-muted rounded-full grid place-items-center">
                <img src={"/icons/bolt.svg"} className="h-4" />
              </div>
              <h1 className="text-3xl font-medium">Ensuring Secure</h1>
            </div>
          </div>

          {/* That helps you Card */}
          <div className="col-span-1 bg-[#FF542C]/10 rounded-3xl p-6">
            <div className="h-full flex flex-col justify-between">
              <img src={"/icons/line-dotted.svg"} className="w-6" />
              <p className="text-xl font-medium mt-4"> & Private Prescription</p>
            </div>
          </div>

          {/* Video Preview Card */}
          <div className="col-span-1 bg-black rounded-3xl p-4 relative overflow-hidden">
            <img
              src={"/icons/light.png"}
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-full grid place-items-center bg-[#FF542C] drop-shadow-lg">
                <img src="/icons/play.svg" className="w-2.5" />
              </div>
            </div>
          </div>

          {/* Shape the future Card */}
          <div className="col-span-2 bg-[#FFD629]/10 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-medium">Verification with ZKPs</p>
              <div className="h-12 w-12 bg-[#FFD629] rounded-full grid place-items-center">
                <img src={"/icons/lines.svg"} className="w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
