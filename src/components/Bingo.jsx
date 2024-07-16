import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuBar from "./MenuBar";

const BingoGame = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(25).fill(false));
  const [turnsLeft, setTurnsLeft] = useState(8);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bingoLines, setBingoLines] = useState([]);

  const handleCellClick = (index) => {
    if (gameOver || board[index] || turnsLeft === 0) return;

    const newBoard = [...board];
    newBoard[index] = true;

    let randomIndex = getRandomCell(newBoard, index);
    newBoard[randomIndex] = true;

    setBoard(newBoard);
    setTurnsLeft(turnsLeft - 1);

    if (turnsLeft === 1) {
      endGame(newBoard);
    }
  };

  const getRandomCell = (currentBoard, excludeIndex) => {
    const availableCells = currentBoard.reduce((acc, cell, idx) => {
      if (!cell && idx !== excludeIndex) acc.push(idx);
      return acc;
    }, []);

    if (availableCells.length === 0) return -1; // No cells available
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  };

  const endGame = (finalBoard) => {
    const { bingos, lines } = countBingos(finalBoard);
    let points = 0;
    if (bingos >= 1) points = 1;
    if (bingos >= 2) points = 2;
    if (bingos >= 3) points = 3;
    if (bingos >= 4) points = 5;
    if (bingos >= 5) points = 10;
  
    setScore(points);
    setGameOver(true);
    setShowModal(true);
    setBingoLines(lines);
  };

  const countBingos = (board) => {
    let count = 0;
    let lines = [];

    // Check rows
    for (let i = 0; i < 25; i += 5) {
      if (board.slice(i, i + 5).every((cell) => cell)) {
        count++;
        lines.push({ start: i, end: i + 4, type: "row" });
      }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every((j) => board[i + j * 5])) {
        count++;
        lines.push({ start: i, end: i + 20, type: "column" });
      }
    }

    // Check diagonals
    if ([0, 6, 12, 18, 24].every((i) => board[i])) {
      count++;
      lines.push({ start: 0, end: 24, type: "diagonal" });
    }
    if ([4, 8, 12, 16, 20].every((i) => board[i])) {
      count++;
      lines.push({ start: 4, end: 20, type: "diagonal" });
    }

    return { bingos: count, lines };
  };

  const resetGame = () => {
    setBoard(Array(25).fill(false));
    setTurnsLeft(8);
    setGameOver(false);
    setScore(0);
    setShowModal(false);
    setBingoLines([]);
  };

  return (
    <Container>
      <MenuBar />
      <BackButton onClick={() => navigate("/")}>
        <ArrowLeft size={24} />
      </BackButton>
      <GameContainer>
        <BoardContainer>
          <Title>Bingo Game</Title>
          <Status>Turns left: {turnsLeft}/8</Status>
          <Board>
            {board.map((marked, index) => (
              <Cell
                key={index}
                onClick={() => handleCellClick(index)}
                marked={marked}
              />
            ))}
            {bingoLines.map((line, index) => (
              <BingoLine
                key={index}
                start={line.start}
                end={line.end}
                type={line.type}
              />
            ))}
          </Board>
          <ResetButton onClick={resetGame}>Start New Game</ResetButton>
        </BoardContainer>
        <RulesContainer>
          <RulesTitle>Rules</RulesTitle>
          <RulesList>
            <Rule>
              You have 8 turns to create as many Bingos as possible.
            </Rule>
            <Rule>Click on an empty cell to mark it.</Rule>
            <Rule>
              The computer will randomly mark another cell after your turn.
            </Rule>
            <Rule>
              A Bingo is a straight line of 5 marked cells (horizontal,
              vertical, or diagonal).
            </Rule>
            <Rule>
              Scoring:
              <ul>
                <li>1 Bingo = 1 point</li>
                <li>2 Bingos = 2 points</li>
                <li>3 Bingos = 3 points</li>
                <li>4 Bingos = 5 points</li>
                <li>5+ Bingos = 10 points</li>
              </ul>
            </Rule>
          </RulesList>
        </RulesContainer>
      </GameContainer>
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent>
            <ModalText>Game Over! Your score: {score} points</ModalText>
            <PlayAgainButton onClick={resetGame}>Play Again</PlayAgainButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #ffffff;
    border-radius: 50%;
    color: #000000;
    border: 1px solid black;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Status = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Cell = styled.button`
  width: 80px;
  height: 80px;
  font-size: 2rem;
  font-weight: bold;
  border: 2px solid #ddd;
  background-color: ${(props) => (props.marked ? "#2ecc71" : "white")};
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.marked ? "#2ecc71" : "#f5f5f5")};
  }
`;

const BingoLine = styled.div`
  position: absolute;
  background-color: #000000;
  opacity: 0.7;
  ${({ start, end, type }) => {
    const startRow = Math.floor(start / 5);
    const startCol = start % 5;
    const endRow = Math.floor(end / 5);
    const endCol = end % 5;

    if (type === "row") {
      return `
        top: ${startRow * 90 + 45}px;
        left: 18px;
        width: calc(100% - 38px);
        height: 5px;
      `;
    } else if (type === "column") {
      return `
        top: 18px;
        left: ${startCol * 90 + 50}px;
        width: 5px;
        height: calc(100% - 38px);
      `;
    } else if (type === "diagonal") {
      const angle = start === 0 ? 45 : -45;
      return `
        top: 50%;
        left: 50%;
        width: calc(135% - 40px);
        height: 5px;
        transform: translate(-50%, -50%) rotate(${angle}deg);
      `;
    }
  }}
`;

const ResetButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background-color: #000000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #000000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    outline: none;
    transition: 0.2s background ease-in;
  }
`;

const RulesContainer = styled.div`
  background-color: white;
  padding: 20px;
  margin-top: 7rem;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  height: 500px;
  overflow-y: auto;
  position: absolute;
  right: 140px;
  top: 100px;
`;

const RulesTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const RulesList = styled.ol`
  padding-left: 20px;
`;

const Rule = styled.li`
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalText = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const PlayAgainButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background-color: #000000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #000000;
  }
`;

export default BingoGame;
