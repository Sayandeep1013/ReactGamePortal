import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import MenuBar from "./MenuBar";

const AppContainer = styled.div`
  text-align: center;
  padding: 40px;
  font-family: Arial, sans-serif;
  background-color: #f8f8ba;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  font-size: 4rem;
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #666;
  font-size: 1.5rem;
  margin-bottom: 60px;
`;

const GameSection = styled.section`
  position: relative;
  height: 550px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const GameCardsContainer = styled.div`
  display: flex;
  width: 2000px;
  transform: translateX(0);
  transition: transform 0.5s ease;
  scroll-snap-align: center mandatory;
`;

const GameCard = styled.div`
  flex: 0 0 33%;
  width: 300px;
  height: 450px;
  background-color: #f2f2f2;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease-in;
  transform: ${(props) => (props.focus ? "scale(1)" : "scale(0.9)")};
  // opacity: ${(props) => (props.onFocus ? 1 : 0.5)};
  margin: 15px 15px;
  // scroll-snap-align: center;
`;

const GameImage = styled.div`
  height: 300px;
  background-image: ${(props) =>
    props.image ? `url(${props.image})` : "none"};
  background-color: ${(props) =>
    props.image ? "transparent" : props.color || "#ddd"};
  background-size: cover;
  background-position: center;
  border-radius: 20px 20px 0 0;
`;

const GameInfo = styled.div`
  padding: 20px;
  text-align: left;
`;

const GameTitle = styled.h3`
  margin: 0 0 15px;
  font-size: 1.8rem;
  color: #333;
`;

const GameDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
`;

const underlineAnimation = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const GameLink = styled(Link)`
  color: #000;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  position: relative;

  &:after {
    content: " →";
    margin-left: 5px;
  }

  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: #000;
    visibility: hidden;
    transition: all 0.3s ease-in-out;
  }

  &:hover:before {
    visibility: visible;
    animation: ${underlineAnimation} 0.3s forwards;
  }
`;

const games = [
  {
    id: 1,
    title: "Snake and Ladder",
    description: "Classic board game",
    link: "/snake-and-ladder",
    color: "#FFD700",
    image: `/images/snakeladder.png`,
  },
  {
    id: 2,
    title: "Tic Tac Toe",
    description: "Strategy game for two players",
    link: "/tic-tac-toe",
    color: "#98FB98",
    image: `/images/tictactoe.png`,
  },
  {
    id: 3,
    title: "Bingo",
    description: "Fun number matching game",
    link: "/bingo",
    color: "#FF69B4",
    image: `/images/bingo.png`,
  },
  {
    id: 4,
    title: "Typing Game",
    description: "Typing game game",
    link: "/TypingGame",
    color: "purple",
    image: `/images/typingtest.png`,
  },

  {
    id: 5,
    title: "Hang-Man",
    description: "Iconic maze chase game",
    link: "/HangmanGame",
    color: "#FFD700",
    image: `/images/hangman.png`,
  },
  {
    id: 6,
    title: "Rock-Paper-Scissors",
    description: "Just plain old rock paper scissors game",
    link: "/RockPaperScissorsGame",
    color: "#FFD700",
    image: `/images/rockpaperscissors.png`,
  },
  {
    id: 6,
    title: "Chess",
    description: "Classic strategy board game",
    link: "#",
    color: "#8B4513",
  },
  {
    id: 7,
    title: "Sudoku",
    description: "Number-placement puzzle",
    link: "#",
    color: "#20B2AA",
  },
  {
    id: 8,
    title: "Minesweeper",
    description: "Logic puzzle game",
    link: "#",
    color: "#708090",
  },
  {
    id: 9,
    title: "Solitaire",
    description: "Single-player card game",
    link: "#",
    color: "#228B22",
  },
  {
    id: 10,
    title: "Crossword",
    description: "Word puzzle game",
    link: "#",
    color: "#CD853F",
  },
];

const GamePortalHomePage = () => {
  const [focusIndex, setFocusIndex] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const scrollLeft = container.scrollLeft;
        // const scrollRight = container.scrollRight;  //------------------------------------
        const cardWidth = 300 + 30;
        const newFocusIndex = Math.round(scrollLeft / cardWidth);
        setFocusIndex(newFocusIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <AppContainer>
      <MenuBar />
      <Title>Game Portal</Title>
      <Description>
        Welcome to our Game Portal! Explore a variety of exciting games and
        challenge yourself or play with friends.
      </Description>
      <GameSection ref={containerRef}>
        <GameCardsContainer>
          {games.map((game, index) => (
            <GameCard key={game.id} focus={index === focusIndex}>
              <GameImage color={game.color} image={game.image} />
              <GameInfo>
                <GameTitle>{game.title}</GameTitle>
                <GameDescription>{game.description}</GameDescription>
                <GameLink to={game.link}>Visit</GameLink>
              </GameInfo>
            </GameCard>
          ))}
        </GameCardsContainer>
      </GameSection>
    </AppContainer>
  );
};

export default GamePortalHomePage;
