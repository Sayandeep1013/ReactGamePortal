import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

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

// const LineAnimation = keyframes`
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(45deg); }
// `;

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
  right: ${({ isOpen }) => (isOpen ? "0" : "-300px")};
  width: 300px;
  height: 100vh;
  background-color: #F9E479;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  border-top-left-radius: 100% !important;
  border-bottom-left-radius: 100% !important;

  transition: right 0.3s ease-in-out;
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

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MenuContainer>
      <MenuButton onClick={toggleMenu}>
        <Line isOpen={isOpen} />
        <Line isOpen={isOpen} />
        <Line isOpen={isOpen} />
      </MenuButton>
      <MenuOverlay isOpen={isOpen}>
        <MenuItem to="/" onClick={toggleMenu}>
          Home
        </MenuItem>
        <MenuItem to="/snake-and-ladder" onClick={toggleMenu}>
          Snake and Ladder
        </MenuItem>
        <MenuItem to="/bingo" onClick={toggleMenu}>
          Bingo
        </MenuItem>
        <MenuItem to="/tic-tac-toe" onClick={toggleMenu}>
          Tic Tac Toe
        </MenuItem>
        <MenuItem to="/typingGame" onClick={toggleMenu}>
          Typing Test
        </MenuItem>
        <MenuItem to="/HangmanGame" onClick={toggleMenu}>
          Hangman Game
        </MenuItem>
      </MenuOverlay>
    </MenuContainer>
  );
};

export default MenuBar;
