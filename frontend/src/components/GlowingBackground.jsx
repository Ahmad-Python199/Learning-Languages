import React from "react";

const GlowingBackground = () => {
  return (
    <>
      <div className="glow-orb glow-orb-1 pulse-glow" />
      <div className="glow-orb glow-orb-2 pulse-glow" style={{ animationDelay: "-2s" }} />
    </>
  );
};

export default GlowingBackground;
