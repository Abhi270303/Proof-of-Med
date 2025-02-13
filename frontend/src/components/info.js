import { CircleArrowUp, Layers } from "lucide-react";
import React from "react";

const Info = () => {
  return (
    <div className="min-h-screen max-w-screen-2xl mx-auto bg-muted rounded-[80px] pb-20">
      <div className="pt-32 px-20">
        <div className="grid grid-cols-12">
          <div className="text-5xl font-light col-span-8">
            <p>Your key to PRIVACY & Security through Onchain</p>
          </div>

          <div className="w-full flex items-center justify-end pr-12 text-lg text-muted-foreground col-span-4">
            <div>
              <p>Ready for exciting, instateneaous,</p>
              <p>all accessible prescriptions in real time?</p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-12 gap-4 pb-20">
          <div className="rounded-3xl w-full bg-background/50 shadow-xl col-span-7 p-10 pr-0">
            <div className="grid grid-cols-2">
              <div className="border-r pr-10">
                <div className="flex">
                  <div className="bg-[#EA580B] px-8 py-4 rounded-2xl shadow-[#EA580B]/20 shadow-lg text-xs text-background">
                    <p>Setting up reports</p>
                  </div>
                </div>

                <div className="mt-32">
                  <p className="text-3xl">Fast and easy access to prescriptions</p>
                </div>

                <div className="mt-6">
                  <p className=" text-muted-foreground text-sm">
                  Ensuring the authenticity of medical prescriptions using Zero-Knowledge Proofs (ZKPs) while maintaining patient privacy.
                  </p>
                </div>
              </div>

              <div className="pl-10">
                {" "}
                <img
                  src={"/icons/light.png"}
                  className="w-full h-full object-left object-cover rounded-l-lg"
                />
              </div>
            </div>
          </div>
          <div className="rounded-3xl w-full bg-background col-span-5 p-10">
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="border h-44 rounded-[2rem] shadow-md shadow-yellow-400/5 grid place-items-center">
                <div className="w-full grid place-items-center">
                  <Layers className="text-[#FED72C]/60" />
                  <div className="mt-4 flex translate-x-2">
                    <img
                      src={"/icons/vivek.png"}
                      className="w-12 h-12 object-left object-cover rounded-full border-2 border-black"
                    />
                    <img
                      src={"/icons/swayam.png"}
                      className="w-12 h-12 object-left object-cover rounded-full -translate-x-3 border-2 border-black"
                    />
                  </div>
                </div>
              </div>
              <div className="border h-44 rounded-[2rem] shadow-md shadow-yellow-400/5 p-8 py-6 grid gap-2">
                <div className="text-sm text-foreground/80">Prescriptions</div>
                <div className=" flex gap-1 text-sm justify-end text-green-500">
                  <CircleArrowUp size={20} />
                  <p>+14%</p>
                </div>
                <div>
                  <p className="text-6xl">10+</p>
                </div>
              </div>
            </div>

            <div>
              <p className="mt-6 mb-3 text-2xl text-center">Pharmacy Control</p>
              <p className=" text-sm text-muted-foreground text-center max-w-xs mx-auto">
              Ensuring the authenticity of medical prescriptions using Zero-Knowledge Proofs (ZKPs) while maintaining patient privacy.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
