
// First Draft Version svg manipulation and react parallax



import React from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useSpring, animated } from '@react-spring/web';
import styled from 'styled-components';

const Page = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #253237;
  color: #ffffff;
`;

const Title = styled.h1`
  font-size: 5rem;
  text-align: center;
`;

const SVGContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ParallaxPage = () => {
  const [{ rotate }, api] = useSpring(() => ({ rotate: 0 }));

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const moveX = clientX / window.innerWidth * 360 - 180;
    const moveY = clientY / window.innerHeight * 360 - 180;
    api.start({ rotate: moveX });
  };

  return (
    <Page onMouseMove={handleMouseMove}>
      <Parallax pages={3}>
        <ParallaxLayer offset={0} speed={0.5}>
          <Title>Welcome to Parallax World</Title>
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={2}>
          <SVGContainer>
            <animated.svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              style={{ transform: rotate.to(r => `rotate(${r}deg)`) }}
            >
              <circle cx="100" cy="100" r="80" fill="#5c6b73" />
              <circle cx="100" cy="100" r="40" fill="#9db4c0" />
              <path d="M100 20 L120 80 L180 80 L130 120 L150 180 L100 140 L50 180 L70 120 L20 80 L80 80 Z" fill="#c2dfe3" />
            </animated.svg>
          </SVGContainer>
        </ParallaxLayer>

        <ParallaxLayer offset={2} speed={0.5}>
          <Title>Scroll to Explore</Title>
        </ParallaxLayer>
      </Parallax>
    </Page>
  );
};

export default ParallaxPage; 