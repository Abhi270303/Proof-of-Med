import React from "react";

const Footer = () => {
  return (
    <div className="bg-muted/40 rounded-t-[70px]">
      <div className="min-h-[75vh] max-w-7xl mx-auto pt-24 px-10 mt-20">
        <div className="flex items-center justify-between w-full border-b pb-8">
          <div className="flex items-center gap-4 font-extralight text-muted-foreground">
            <p className="hover:text-primary cursor-pointer transition-colors">About</p>
            <p className="hover:text-primary cursor-pointer transition-colors">Why Us</p>
            <p className="hover:text-primary cursor-pointer transition-colors">Platform</p>
            <p className="hover:text-primary cursor-pointer transition-colors">Contacts</p>
          </div>
          <div>
            <p className="text-5xl">team@proofofmed.com</p>
          </div>
        </div>
        <div className="mt-10 flex w-full justify-between">
          <div className="flex">
            <div className="max-w-xs">
              <div>
                <p className="text-sm">Mumbai</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  125 N. Harrington StreetRaleigh, NC 27603919.833.6413
                </p>
              </div>
            </div>
            <div className="max-w-xs">
              <div>
                <p className="text-sm">Mumbai</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  125 N. Harrington StreetRaleigh, NC 27603919.833.6413
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 justify-end text-right">
            <div className="text-right hover:text-primary cursor-pointer transition-colors">LinkedIn</div>
            <div className="text-right hover:text-primary cursor-pointer transition-colors">Instagram</div>
            <div className="text-right hover:text-primary cursor-pointer transition-colors">Facebook</div>
          </div>
        </div>
        <div className="mt-10">
          <p className="text-[7rem]">ProofofMed.com</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;