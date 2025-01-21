import React, { useEffect, useRef } from "react";
import { AnimationControls, motion, useAnimation } from "framer-motion";
import { Outlet } from "react-router-dom";
import { getRandomPosition } from "../utils/animation";

export default function AuthLayout() {
  const blueControls = useAnimation();
  const redControls = useAnimation();
  const blobRadius = 200;

  // Refs to store current positions
  const bluePosition = useRef({ x: -blobRadius * 2, y: -blobRadius * 2 });
  const redPosition = useRef({ x: -blobRadius * 2, y: -blobRadius * 2 });

  const animateBlob = (
    controls: AnimationControls,
    positionRef: React.MutableRefObject<{ x: number; y: number }>,
    otherPositionRef: React.MutableRefObject<{ x: number; y: number }>
  ) => {
    const animate = async () => {
      const target = getRandomPosition(blobRadius, otherPositionRef.current);
      positionRef.current = target;
      await controls.start({
        x: target.x,
        y: target.y,
        transition: {
          duration: 2, // Reduced duration to increase velocity
          ease: "easeInOut",
        },
      });
      requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    // Calculate the bounds and offsets once
    const boundWidth = (window.innerWidth * 2) / 3;
    const boundHeight = (window.innerHeight * 2) / 3;
    const offsetX = (window.innerWidth - boundWidth) / 2;
    const offsetY = (window.innerHeight - boundHeight) / 2;

    // Set initial positions randomly within the bounds
    bluePosition.current = {
      x: offsetX + Math.random() * boundWidth,
      y: offsetY + Math.random() * boundHeight,
    };
    redPosition.current = {
      x: offsetX + Math.random() * boundWidth,
      y: offsetY + Math.random() * boundHeight,
    };

    blueControls.set(bluePosition.current);
    redControls.set(redPosition.current);

    animateBlob(blueControls, bluePosition, redPosition);
    animateBlob(redControls, redPosition, bluePosition);
  }, [blueControls, redControls]);

  return (
    <div className="fixed inset-0 bg-dark5 overflow-hidden">
      {/* Blue blob */}
      <motion.div
        className="absolute rounded-full bg-blue-500/60 blur-[100px]"
        animate={blueControls}
        style={{
          width: `${blobRadius * 2}px`,
          height: `${blobRadius * 2}px`,
        }}
      />

      {/* Red blob */}
      <motion.div
        className="absolute rounded-full bg-red-500/60 blur-[100px]"
        animate={redControls}
        style={{
          width: `${blobRadius * 2}px`,
          height: `${blobRadius * 2}px`,
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center text-white">
        <Outlet />
      </div>
    </div>
  );
}
