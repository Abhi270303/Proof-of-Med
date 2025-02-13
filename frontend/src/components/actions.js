import { LineChart } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const Actions = () => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const [textPosition, setTextPosition] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);

  // Calculate the maximum scroll distance based on text and container widths
  useEffect(() => {
    if (textRef.current && containerRef.current) {
      const textWidth = textRef.current.offsetWidth;
      const containerWidth = containerRef.current.offsetWidth;
      const scrollDistance = textWidth - containerWidth;
      setMaxScroll(scrollDistance > 0 ? scrollDistance + 40 : 0); // Add padding
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updatePosition = () => {
      if (!isInView) return;

      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;

      setTextPosition((prev) => {
        const newPos = prev - scrollDiff * 1.2; // Increased multiplier for more movement
        return Math.max(Math.min(newPos, 0), -maxScroll); // Use calculated maxScroll
      });

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    if (isInView) {
      window.addEventListener("scroll", onScroll);
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, [isInView, maxScroll]);

  return (
    <div className="max-w-6xl mx-auto pt-28 px-8">
      <div className="text-[7rem] tracking-tight leading-tight">
        <p>
          Maximize <span className="text-muted-foreground/40">efficiency</span>
        </p>
        <p className="-translate-y-6">with our prescription</p>
      </div>
      <div className="grid grid-cols-2">
        <div className="relative flex items-center">
          <div className="relative w-36 h-36 bg-[#EA580B] text- rounded-full mr-[-2rem] flex flex-col items-center justify-center p-4">
            <div className="text-2xl font-bold">+30%</div>
            <div className="text-sm text-center mt-1">
              Speed up your onchain Medical Orders
            </div>
          </div>
          <div className="w-36 h-36 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <LineChart
                size={32}
                className="text-orange-500"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
        <div className="pl-20" ref={containerRef}>
          <div className="max-h-full w-full overflow-hidden bg-[#EA580B] rounded-[50px] text-background text-[7rem] text-nowrap">
            <p
              ref={textRef}
              className="transition-transform duration-75 ease-out inline-block"
              style={{
                transform: `translateX(${textPosition}px)`,
              }}
            >
              Analytics Service
            </p>
          </div>
        </div>
      </div>
      <div className="border-t mt-16 pt-16 grid grid-cols-12">
        <div className="col-span-6 text-muted-foreground font-light">
          Explore traffic sources, page behavior, conversions and more to gain
          deep insight into your audience. With us, your business doesn&apos;t
          just adapt - it evolves
        </div>
        <div className="col-span-2"></div>
        <div className="col-span-4 grid grid-cols-2 gap-4">
          <Button variant="secondary" className="rounded-xl">
            Request a demo
          </Button>
          <Button className="rounded-xl">Start for free</Button>
        </div>
      </div>
    </div>
  );
};

export default Actions;
