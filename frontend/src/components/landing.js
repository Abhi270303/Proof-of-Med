import React from "react";

const Landing = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-0 relative">
            <div className="h-20 w-20 bg-white/10 rounded-full grid place-items-center relative z-10">
              <img src={"/icons/bolt.svg"} className="h-6" alt="bolt icon" />
            </div>
            <div className="h-20 w-20 -translate-x-6 bg-[#EA580B] rounded-full grid place-items-center relative z-20">
              <img src={"/icons/line-dotted.svg"} className="w-8" alt="dotted line" />
            </div>
            <div className="text-center leading-none -translate-x-4">
              <p className="text-[6rem] font-medium">Ensuring Onchain</p>
            </div>
          </div>
          <div className="text-[6rem] leading-none mt-2">
            <p className="flex items-center justify-center">
              <span></span>
              <span className="mx-4">
                Medicine Prescription
              </span>
            </p>
          </div>
          <div className="text-[6rem] leading-none mt-2">
            <p className="flex items-center justify-center gap-4">
              <span>Verification</span>
              <span className="h-20 w-20 bg-[#EA580B] rounded-full grid place-items-center mx-2">
                <img src={"/icons/lines.svg"} className="w-5" alt="lines" />
              </span>
              <span>with ZKPs</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Bento Grid Layout */}
      <div className="md:hidden min-h-screen p-4 flex items-center">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4">
            {/* Analytics Title Card */}
            <div className="col-span-2 bg-[#EA580B] rounded-3xl p-6 shadow-sm border">
              <div className="flex items-center justify-center gap-2">
                <div className="h-10 w-10 bg-muted rounded-full grid place-items-center">
                  <img src={"/icons/bolt.svg"} className="h-4" alt="bolt icon" />
                </div>
                <h1 className="text-3xl font-medium text-center">Ensuring Secure</h1>
              </div>
            </div>

            {/* That helps you Card */}
            <div className="col-span-1 bg-[#FF542C]/10 rounded-3xl p-6">
              <div className="h-full flex flex-col justify-between items-center text-center">
                <img src={"/icons/line-dotted.svg"} className="w-6" alt="dotted line" />
                <p className="text-xl font-medium mt-4">
                  & Private Prescription
                </p>
              </div>
            </div>

            {/* Shape the future Card */}
            <div className="col-span-2 bg-[#FFD629]/10 rounded-3xl p-6">
              <div className="flex items-center justify-center gap-4">
                <p className="text-2xl font-medium text-center">Verification with ZKPs</p>
                <div className="h-12 w-12 bg-[#FFD629] rounded-full grid place-items-center">
                  <img src={"/icons/lines.svg"} className="w-4" alt="lines" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;