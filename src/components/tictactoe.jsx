import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuBar from "./MenuBar";

const TicTacToe = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setShowModal(true);

      // Automatically close modal after 3 seconds
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    } else if (!board.includes(null)) {
      // It's a draw
      setShowModal(true);
    }
  }, [board]);

  const calculateWinner = (squares) => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line: WINNING_COMBINATIONS[i] };
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningLine(null);
    setShowModal(false);
  };

  const renderCell = (i) => {
    const isWinningCell = winningLine && winningLine.includes(i);
    return (
      <Cell key={i} onClick={() => handleClick(i)} isWinning={isWinningCell}>
        {board[i]}
      </Cell>
    );
  };

  // const getLineType = (line) => {
  //   if (line[0] % 3 === 0 && line[2] % 3 === 2) return "row";
  //   if (line[2] - line[0] === 6) return "column";
  //   return "diagonal";
  // };

  return (
    <Container>
      <MenuBar />
      <BackButton onClick={() => navigate("/")}>
        <ArrowLeft size={24} />
      </BackButton>
      <Title>Tic Tac Toe</Title>
      <Status>
        {winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? "X" : "O"}`}
      </Status>
      <BoardContainer>
        <Board>{[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderCell(i))}</Board>
        {winningLine && (
          <WinningLine start={winningLine[0]} end={winningLine[2]} />
        )}
      </BoardContainer>
      <ResetButton onClick={resetGame}>Reset Game</ResetButton>
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent>
            <ModalText>
              {winner ? `Winner: ${winner}` : "It's a draw!"}
            </ModalText>
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
  min-height: 94vh;
  background-color: #8FD8D4;
  position: relative;
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

const BoardContainer = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  // border: 1px solid #000;
  gap: 10px;
  width: 100%;
  height: 100%;
`;

const Cell = styled.button`
  aspect-ratio: 1 / 1;
  font-size: 2.5rem;
  font-weight: bold;
  border: 1px solid #000;
  background-color: ${(props) => (props.isWinning ? "#2ecc71" : "white")};
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  outline: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const WinningLine = styled.div`
  position: absolute;
  background-color: #000000;
  opacity: 0.7;
  ${({ start, end }) => {
    const startRow = Math.floor(start / 3);
    const startCol = start % 3;
    const endRow = Math.floor(end / 3);
    const endCol = end % 3;

    if (startRow === endRow) {
      // Horizontal line
      return `
        top: calc(${startRow * 33.33}% + 16.665%);
        left: 5px;
        width: calc(100% - 10px);
        height: 5px;
      `;
    } else if (startCol === endCol) {
      // Vertical line
      return `
        top: 5px;
        left: calc(${startCol * 33.33}% + 16.665%);
        width: 5px;
        height: calc(100% - 10px);
      `;
    } else {
      // Diagonal line
      const angle = start === 0 ? 45 : -45;
      return `
        top: 50%;
        left: 50%;
        width: 135%;
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

    &:active {
      background-color: #000000;
      color: white;
      border: 2px solid #000000;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      outline: none;

      &:focus {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        outline: none;
      }
    }
  }
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

export default TicTacToe;
