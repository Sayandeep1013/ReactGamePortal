// import React, { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import styled, { keyframes } from "styled-components";
// import MenuBar from "./MenuBar";

// const Effects = () => {
//   const navigate = useNavigate();
//   const [isToggled, setIsToggled] = useState(false);

//   return (
//     <Container>
//       <MenuBar />
//       <BackButton onClick={() => navigate("/")}>
//         <ArrowLeft size={24} />
//       </BackButton>
//       <Title>React Effects Showcase</Title>
//       <EffectsGrid>
//         <EffectCard>
//           <PulsingButton>Pulsing Button</PulsingButton>
//         </EffectCard>
//         <EffectCard>
//           <SlidingText>Sliding Text Effect</SlidingText>
//         </EffectCard>
//         <EffectCard large>
//           <Parallax>
//             <ParallaxLayer depth={0.2}>Parallax</ParallaxLayer>
//             <ParallaxLayer depth={0.6}>Effect</ParallaxLayer>
//             <ParallaxLayer depth={1}>Demo</ParallaxLayer>
//           </Parallax>
//         </EffectCard>
//         <EffectCard>
//           <ShakeButton>Shake Me!</ShakeButton>
//         </EffectCard>
//         <EffectCard>
//           <GlowingText>Glowing Text</GlowingText>
//         </EffectCard>
//         <EffectCard>
//           <FloatingElement>🎈 Floating</FloatingElement>
//         </EffectCard>
//         <EffectCard>
//           <ToggleSwitch>
//             <input
//               type="checkbox"
//               checked={isToggled}
//               onChange={() => setIsToggled(!isToggled)}
//             />
//             <Slider />
//           </ToggleSwitch>
//         </EffectCard>
//         <EffectCard>
//           <TypewriterText>Typewriter effect...</TypewriterText>
//         </EffectCard>
//       </EffectsGrid>
//     </Container>
//   );
// };

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   min-height: 100vh;
//   background-color: #1a1a1a;
//   padding: 2rem;
//   position: relative;
// `;

// const BackButton = styled.button`
//   position: absolute;
//   top: 20px;
//   left: 20px;
//   padding: 10px;
//   background-color: #ffffff;
//   color: #1a1a1a;
//   border: none;
//   border-radius: 50%;
//   cursor: pointer;
//   transition: all 0.3s ease-in-out;

//   &:hover {
//     background-color: #1a1a1a;
//     color: #ffffff;
//     box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
//   }
// `;

// const Title = styled.h1`
//   font-size: 3rem;
//   margin-bottom: 2rem;
//   color: #ffffff;
//   text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
// `;

// const EffectsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//   gap: 2rem;
//   width: 100%;
//   max-width: 1200px;
// `;

// const EffectCard = styled.div`
//   background-color: #2a2a2a;
//   border-radius: 15px;
//   padding: 2rem;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 255, 255, 0.1);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: ${(props) => (props.large ? "350px" : "250px")};
//   grid-column: ${(props) => (props.large ? "span 2" : "span 1")};
//   transition: transform 0.3s ease-in-out;

//   &:hover {
//     transform: translateY(-5px);
//   }
// `;

// const pulse = keyframes`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.05); }
//   100% { transform: scale(1); }
// `;

// const PulsingButton = styled.button`
//   padding: 12px 24px;
//   font-size: 1.2rem;
//   background-color: #3498db;
//   color: white;
//   border: none;
//   border-radius: 30px;
//   cursor: pointer;
//   animation: ${pulse} 2s infinite;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #2980b9;
//   }
// `;

// const slide = keyframes`
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// `;

// const SlidingText = styled.div`
//   font-size: 1.8rem;
//   font-weight: bold;
//   color: #2ecc71;
//   white-space: nowrap;
//   overflow: hidden;
//   animation: ${slide} 5s linear infinite;
// `;

// const Parallax = styled.div`
//   perspective: 500px;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `;

// const ParallaxLayer = styled.div`
//   position: absolute;
//   font-size: ${(props) => 3 - props.depth}rem;
//   color: rgba(255, 255, 255, ${(props) => 1 - props.depth * 0.5});
//   transform: translateZ(${(props) => props.depth * -100}px)
//     scale(${(props) => 1 + props.depth * 0.2});
// `;

// const shake = keyframes`
//   0%, 100% { transform: translateX(0); }
//   10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//   20%, 40%, 60%, 80% { transform: translateX(5px); }
// `;

// const ShakeButton = styled.button`
//   padding: 12px 24px;
//   font-size: 1.2rem;
//   background-color: #9b59b6;
//   color: white;
//   border: none;
//   border-radius: 30px;
//   cursor: pointer;

//   &:hover {
//     animation: ${shake} 0.5s ease-in-out;
//   }
// `;

// const glow = keyframes`
//   0% { text-shadow: 0 0 5px #ff00de, 0 0 10px #ff00de, 0 0 15px #ff00de, 0 0 20px #ff00de; }
//   50% { text-shadow: 0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 30px #ff00de, 0 0 40px #ff00de; }
//   100% { text-shadow: 0 0 5px #ff00de, 0 0 10px #ff00de, 0 0 15px #ff00de, 0 0 20px #ff00de; }
// `;

// const GlowingText = styled.h2`
//   font-size: 2.5rem;
//   color: #ffffff;
//   animation: ${glow} 2s ease-in-out infinite;
// `;

// const float = keyframes`
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-20px); }
//   100% { transform: translateY(0px); }
// `;

// const FloatingElement = styled.div`
//   font-size: 3rem;
//   animation: ${float} 3s ease-in-out infinite;
// `;

// const ToggleSwitch = styled.label`
//   position: relative;
//   display: inline-block;
//   width: 60px;
//   height: 34px;

//   input {
//     opacity: 0;
//     width: 0;
//     height: 0;
//   }
// `;

// const Slider = styled.span`
//   position: absolute;
//   cursor: pointer;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: #ccc;
//   transition: 0.4s;
//   border-radius: 34px;

//   &:before {
//     position: absolute;
//     content: "";
//     height: 26px;
//     width: 26px;
//     left: 4px;
//     bottom: 4px;
//     background-color: white;
//     transition: 0.4s;
//     border-radius: 50%;
//   }

//   input:checked + & {
//     background-color: #2196f3;
//   }

//   input:checked + &:before {
//     transform: translateX(26px);
//   }
// `;

// const typewriter = keyframes`
//   from { width: 0; }
//   to { width: 100%; }
// `;

// const TypewriterText = styled.div`
//   overflow: hidden;
//   border-right: 0.15em solid orange;
//   white-space: nowrap;
//   margin: 0 auto;
//   letter-spacing: 0.15em;
//   animation: ${typewriter} 3.5s steps(40, end),
//     blink-caret 0.75s step-end infinite;

//   @keyframes blink-caret {
//     from,
//     to {
//       border-color: transparent;
//     }
//     50% {
//       border-color: orange;
//     }
//   }
// `;

// export default Effects;

//------------------------------------
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import MenuBar from "./MenuBar";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    // box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  }

  body {
    background-color: #000;
  }
`;

const Effects = () => {
  const navigate = useNavigate();
  const [isToggled, setIsToggled] = useState(false);

  return (
    <>
      <GlobalStyle />
      <Container>
        <MenuIconBackground />
        <StyledMenuBar />
        <BackButton onClick={() => navigate("/")}>
          <ArrowLeft size={24} color="white" />
        </BackButton>
        <Title>React Effects Showcase</Title>
        <EffectsGrid>
          <EffectCard>
            <PulsingButton>Pulsing Button</PulsingButton>
          </EffectCard>
          <EffectCard>
            <SlidingTextContainer>
              <SlidingText>Sliding Text Effect</SlidingText>
            </SlidingTextContainer>
          </EffectCard>
          <EffectCard large>
            <Parallax>
              <ParallaxLayer depth={0.2}>
                <Circle color="#ff6b6b" />
              </ParallaxLayer>
              <ParallaxLayer depth={0.6}>
                <Square color="#4ecdc4" />
              </ParallaxLayer>
              <ParallaxLayer depth={1}>
                <Triangle color="#45b7d1" />
              </ParallaxLayer>
            </Parallax>
          </EffectCard>
          <EffectCard>
            <ShakeButton>Shake Me!</ShakeButton>
          </EffectCard>
          <EffectCard>
            <GlowingText>Glowing Text</GlowingText>
          </EffectCard>
          <EffectCard>
            <FloatingElement>🎈 Floating</FloatingElement>
          </EffectCard>
          <EffectCard>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={isToggled}
                onChange={() => setIsToggled(!isToggled)}
              />
              <Slider />
            </ToggleSwitch>
          </EffectCard>
          <EffectCard>
            <TypewriterText>Typewriter effect...</TypewriterText>
          </EffectCard>
        </EffectsGrid>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #000000;
  padding: 1rem;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
`;

const StyledMenuBar = styled(MenuBar)`
  .MenuBar-Line {
    color: white;
    border: 1px solid white;
  }
`;

const MenuIconBackground = styled.div`
  position: fixed;
  top: 12px;
  right: 14px;
  width: 50px;
  height: 50px;
  //   background-color: #ffffff;
  border-radius: 50%;
  z-index: 999;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px;
  background-color: #010101;
  color: #1a1a1a;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #1a1a1a;
    color: #ffffff;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const EffectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const EffectCard = styled.div`
  background-color: #2a2a2a;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${(props) => (props.large ? "350px" : "250px")};
  grid-column: ${(props) => (props.large ? "span 2" : "span 1")};
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const PulsingButton = styled.button`
  padding: 12px 24px;
  font-size: 1.2rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  animation: ${pulse} 2s infinite;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const slide = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const SlidingTextContainer = styled.div`
  width: 100%;
  overflow: hidden;
`;

const SlidingText = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #2ecc71;
  white-space: nowrap;
  display: inline-block;
  padding-left: 100%;
  animation: ${slide} 15s linear infinite;

  @keyframes ${slide} {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-100%, 0);
    }
  }
`;

const Parallax = styled.div`
  perspective: 500px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ParallaxLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateZ(${(props) => props.depth * -500}px)
    scale(${(props) => 1 + props.depth * 0.5});
`;

const Circle = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
`;

const Square = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${(props) => props.color};
`;

const Triangle = styled.div`
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid ${(props) => props.color};
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const ShakeButton = styled.button`
  padding: 12px 24px;
  font-size: 1.2rem;
  background-color: #9b59b6;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;

  &:hover {
    animation: ${shake} 0.5s ease-in-out;
  }
`;

const glow = keyframes`
  0% { text-shadow: 0 0 5px #ff00de, 0 0 10px #ff00de, 0 0 15px #ff00de, 0 0 20px #ff00de; }
  50% { text-shadow: 0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 30px #ff00de, 0 0 40px #ff00de; }
  100% { text-shadow: 0 0 5px #ff00de, 0 0 10px #ff00de, 0 0 15px #ff00de, 0 0 20px #ff00de; }
`;

const GlowingText = styled.h2`
  font-size: 2.5rem;
  color: #ffffff;
  animation: ${glow} 2s ease-in-out infinite;
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const FloatingElement = styled.div`
  font-size: 3rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + & {
    background-color: #2196f3;
  }

  input:checked + &:before {
    transform: translateX(26px);
  }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const TypewriterText = styled.div`
  overflow: hidden;
  border-right: 0.15em solid orange;
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: 0.15em;
  animation: ${typewriter} 3.5s steps(40, end),
    blink-caret 0.75s step-end infinite;

  @keyframes blink-caret {
    from,
    to {
      border-color: transparent;
    }
    50% {
      border-color: orange;
    }
  }
`;

export default Effects;
