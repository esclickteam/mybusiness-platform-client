import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/** Thin reading-progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div className="pm-progress" style={{ scaleX }} aria-hidden="true" />
  );
}
