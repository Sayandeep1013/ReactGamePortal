import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { gsap } from "gsap";

const ParallaxContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const InteractiveArea = styled.div`
  width: 80vw;
  height: 80vh;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const BoxStack = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.2s ease;
`;

const Box = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.color};
  opacity: ${(props) => props.opacity};
  transform: translateZ(${(props) => props.depth}px)
    scale(${(props) => props.scale});
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const MouseFollower = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 192, 203, 0.3);
  border: 2px solid rgba(255, 192, 203, 0.8);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
`;

const ParallaxPage = () => {
  const interactiveAreaRef = useRef(null);
  const boxStackRef = useRef(null);
  const mouseFollowerRef = useRef(null);
  const [isMouseInside, setIsMouseInside] = useState(false);

  useEffect(() => {
    const interactiveArea = interactiveAreaRef.current;
    const boxStack = boxStackRef.current;
    const mouseFollower = mouseFollowerRef.current;

    let rafId;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const { left, top, width, height } =
        interactiveArea.getBoundingClientRect();
      mouseX = (e.clientX - left - width / 2) / (width / 2);
      mouseY = (e.clientY - top - height / 2) / (height / 2);

      setIsMouseInside(
        e.clientX >= left &&
          e.clientX <= left + width &&
          e.clientY >= top &&
          e.clientY <= top + height
      );

      gsap.to(mouseFollower, {
        duration: 0.1, // Reduced from 0.3 to 0.1 for quicker response
        x: e.clientX - left,
        y: e.clientY - top,
        ease: "power2.out",
      });
    };

    const updateBoxStack = () => {
      if (isMouseInside) {
        gsap.to(boxStack, {
          duration: 0.2,
          rotateY: mouseX * 20, // Increased from 15 to 20 for more sensitivity
          rotateX: -mouseY * 20,
          x: mouseX * 50, // Increased from 30 to 50 for more movement
          y: mouseY * 50,
          ease: "power2.out",
        });
      } else {
        gsap.to(boxStack, {
          duration: 0.5,
          rotateY: 0,
          rotateX: 0,
          x: 0,
          y: 0,
          ease: "power2.out",
        });
      }

      rafId = requestAnimationFrame(updateBoxStack);
    };

    document.addEventListener("mousemove", handleMouseMove);
    updateBoxStack();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isMouseInside]);

  const createBoxes = () => {
    const colors = [
      "#FFB3BA",
      "#BAFFC9",
      "#BAE1FF",
      "#FFFFBA",
      "#FFD9BA",
      "#E0BBE4",
      "#957DAD",
      "#D291BC",
      "#FEC8D8",
      "#FFDFD3",
    ];
    return colors.map((color, index) => (
      <Box
        key={index}
        color={color}
        opacity={1 - index * 0.05}
        depth={index * 20}
        scale={1 - index * 0.05}
      />
    ));
  };

  return (
    <ParallaxContainer>
      <InteractiveArea ref={interactiveAreaRef}>
        <BoxStack ref={boxStackRef}>{createBoxes()}</BoxStack>
        <MouseFollower ref={mouseFollowerRef} />
      </InteractiveArea>
    </ParallaxContainer>
  );
};

export default ParallaxPage;
