// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import styled, { keyframes } from "styled-components";

// const MenuContainer = styled.div`
//   position: fixed;
//   top: 20px;
//   right: 20px;
//   z-index: 1000;
// `;

// const MenuButton = styled.button`
//   background: none;
//   border: none;
//   cursor: pointer;
//   width: 40px;
//   height: 34px;
//   position: relative;
//   z-index: 1001;
// `;

// // const LineAnimation = keyframes`
// //   0% { transform: rotate(0deg); }
// //   100% { transform: rotate(45deg); }
// // `;

// const Line = styled.span`
//   display: block;
//   width: 100%;
//   height: 3px;
//   background-color: #000;
//   margin: 5px 0;
//   transition: 0.4s;

//   ${({ isOpen }) =>
//     isOpen &&
//     `
//     &:nth-child(1) {
//       transform: rotate(45deg) translate(5px, 5px);
//     }
//     &:nth-child(2) {
//       opacity: 0;
//     }
//     &:nth-child(3) {
//       transform: rotate(-45deg) translate(7px, -7px);
//     }
//   `}
// `;

// const MenuOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   right: ${({ isOpen }) => (isOpen ? "0" : "-300px")};
//   width: 300px;
//   height: 100vh;
//   background-color: #f9e479;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   z-index: 999;
//   border-top-left-radius: 100% !important;
//   border-bottom-left-radius: 100% !important;

//   transition: right 0.3s ease-in-out;
// `;

// const underlineAnimation = keyframes`
//   from { width: 0; }
//   to { width: 100%; }
// `;

// const MenuItem = styled(Link)`
//   color: #000;
//   text-decoration: none;
//   font-size: 24px;
//   margin: 10px 0;
//   position: relative;

//   &::after {
//     content: "";
//     position: absolute;
//     bottom: -2px;
//     left: 0;
//     width: 0;
//     height: 2px;
//     background-color: #000;
//     transition: width 0.3s ease-in-out;
//   }

//   &:hover::after {
//     animation: ${underlineAnimation} 0.3s forwards;
//   }
// `;

// const MenuBar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <MenuContainer>
//       <MenuButton onClick={toggleMenu}>
//         <Line isOpen={isOpen} />
//         <Line isOpen={isOpen} />
//         <Line isOpen={isOpen} />
//       </MenuButton>
//       <MenuOverlay isOpen={isOpen}>
//         <MenuItem to="/" onClick={toggleMenu}>
//           Home
//         </MenuItem>
//         <MenuItem to="/snake-and-ladder" onClick={toggleMenu}>
//           Snake and Ladder
//         </MenuItem>
//         <MenuItem to="/bingo" onClick={toggleMenu}>
//           Bingo
//         </MenuItem>
//         <MenuItem to="/tic-tac-toe" onClick={toggleMenu}>
//           Tic Tac Toe
//         </MenuItem>
//         <MenuItem to="/typingGame" onClick={toggleMenu}>
//           Typing Test
//         </MenuItem>
//         <MenuItem to="/HangmanGame" onClick={toggleMenu}>
//           Hangman Game
//         </MenuItem>
//         <MenuItem to="/RockPaperScissorsGame" onClick={toggleMenu}>
//           Rock Paper Scissor
//         </MenuItem>
//       </MenuOverlay>
//     </MenuContainer>
//   );
// };

// export default MenuBar;

// Code implemented without Gsap ↑
// -----------------------------------------------------------------------------------
//Code implemented without Gsap ↓

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { gsap } from "gsap";

const MenuContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 34px;
  position: relative;
  z-index: 1001;
`;

const Line = styled.span`
  display: block;
  width: 100%;
  height: 3px;
  background-color: #000;
  margin: 5px 0;
  transition: 0.4s;

  ${({ isOpen }) =>
    isOpen &&
    `
    &:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    &:nth-child(2) {
      opacity: 0;
    }
    &:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }
  `}
`;

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background-color: rgba(255, 220, 10, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  // border-top-left-radius: 100% !important;
  // border-bottom-left-radius: 100% !important;
  backdrop-filter: blur(5px);
`;

const underlineAnimation = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const MenuItem = styled(Link)`
  color: #000;
  text-decoration: none;
  font-size: 24px;
  margin: 10px 0;
  position: relative;
  opacity: 0;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0px;
    width: 0;
    height: 2px;
    background-color: #000;
    transition: width 0.3s ease-in-out;
  }

  &:hover::after {
    animation: ${underlineAnimation} 0.3s forwards;
  }
`;

const MenuBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuOverlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    timelineRef.current = gsap.timeline({ paused: true });

    timelineRef.current
      .to(menuOverlayRef.current, {
        duration: 0.5,
        right: 0,
        ease: "power2.inOut",
      })
      .to(
        menuItemsRef.current,
        {
          duration: 0.5,
          x: -15,
          opacity: 1,
          stagger: 0.2,
          ease: "power2.out",
        },
        "-=0.3"
      );

    return () => {
      timelineRef.current.kill();
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      timelineRef.current.play();
    } else {
      timelineRef.current.reverse();
    }
  };

  return (
    <MenuContainer>
      <MenuButton onClick={toggleMenu}>
        <Line isOpen={isOpen} />
        <Line isOpen={isOpen} />
        <Line isOpen={isOpen} />
      </MenuButton>
      <MenuOverlay ref={menuOverlayRef}>
        {[
          { to: "/", text: "Home" },
          { to: "/snake-and-ladder", text: "Snake and Ladder" },
          { to: "/bingo", text: "Bingo" },
          { to: "/tic-tac-toe", text: "Tic Tac Toe" },
          { to: "/typingGame", text: "Typing Test" },
          { to: "/HangmanGame", text: "Hangman Game" },
          { to: "/RockPaperScissorsGame", text: "Rock Paper Scissor" },
          { to: "/ConnectFour", text: "Connect Four" },
          { to: "/MinesGame", text: "Mines Game" },
          { to: "/SudokuGame", text: "Sudoku Game" },
          { to: "/Effects", text: "Effects Exp" },
        ].map((item, index) => (
          <MenuItem
            key={item.to}
            to={item.to}
            onClick={toggleMenu}
            ref={(el) => (menuItemsRef.current[index] = el)}
          >
            {item.text}
          </MenuItem>
        ))}
      </MenuOverlay>
    </MenuContainer>
  );
};

export default MenuBar;
