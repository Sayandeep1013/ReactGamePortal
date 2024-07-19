import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuBar from "./MenuBar";
import Confetti from "react-confetti";

const ROWS = 7;
const COLS = 7;
const EMPTY = null;
const PLAYER1 = "red";
const PLAYER2 = "yellow";

const ConnectFour = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(
    Array(ROWS)
      .fill()
      .map(() => Array(COLS).fill(EMPTY))
  );
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1);
  const [winner, setWinner] = useState(null);
  const [showRules, setShowRules] = useState(true);
  const [currentRule, setCurrentRule] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem("connectFourGame"));
    if (savedGame) {
      setBoard(savedGame.board);
      setCurrentPlayer(savedGame.currentPlayer);
      setWinner(savedGame.winner);
      setGameStarted(savedGame.gameStarted);
    }
  }, []);

  useEffect(() => {
    if (gameStarted) {
      localStorage.setItem(
        "connectFourGame",
        JSON.stringify({
          board,
          currentPlayer,
          winner,
          gameStarted,
        })
      );
    }
  }, [board, currentPlayer, winner, gameStarted]);

  const handleColumnClick = (col) => {
    if (winner || !gameStarted) return;

    const newBoard = [...board];
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === EMPTY) {
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        checkWinner(row, col, currentPlayer);
        setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1);
        break;
      }
    }
  };

  const checkWinner = (row, col, player) => {
    // Check horizontal, vertical, and diagonal lines
    if (
      checkLine(row, 0, 0, 1, player) ||
      checkLine(0, col, 1, 0, player) ||
      checkLine(Math.max(row - col, 0), Math.max(col - row, 0), 1, 1, player) ||
      checkLine(
        Math.max(row - (COLS - 1 - col), 0),
        Math.min(row + col, COLS - 1),
        1,
        -1,
        player
      )
    ) {
      setWinner(player);
    }
  };

  const checkLine = (
    startRow,
    startCol,
    rowIncrement,
    colIncrement,
    player
  ) => {
    let count = 0;
    for (let i = 0; i < ROWS; i++) {
      const row = startRow + i * rowIncrement;
      const col = startCol + i * colIncrement;
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) break;
      if (board[row][col] === player) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
    return false;
  };

  const resetGame = () => {
    setBoard(
      Array(ROWS)
        .fill()
        .map(() => Array(COLS).fill(EMPTY))
    );
    setCurrentPlayer(PLAYER1);
    setWinner(null);
    setGameStarted(true);
  };

  const handleNextRule = () => {
    if (currentRule < 3) {
      setCurrentRule(currentRule + 1);
    } else {
      setShowRules(false);
    }
  };

  const handlePreviousRule = () => {
    if (currentRule > 1) {
      setCurrentRule(currentRule - 1);
    }
  };

  const handleSkipRules = () => {
    setShowRules(false);
    setGameStarted(true);
  };

  return (
    <Container>
      <MenuBar />
      <BackButton onClick={() => navigate("/")}>
        <ArrowLeft size={24} />
      </BackButton>
      <GameContainer>
        <Title>Connect Four</Title>
        <CurrentPlayer>
          Current Player: {currentPlayer === PLAYER1 ? "Red" : "Yellow"}
        </CurrentPlayer>
        <Board>
          {board.map((row, rowIndex) => (
            <Row key={rowIndex}>
              {row.map((cell, colIndex) => (
                <Cell
                  key={colIndex}
                  onClick={() => handleColumnClick(colIndex)}
                  player={cell}
                />
              ))}
            </Row>
          ))}
        </Board>
        <GameButton onClick={resetGame}>
          {gameStarted ? "Restart A New Game" : "Start Game"}
        </GameButton>
        <ShowRulesButton
          onClick={() => {
            setCurrentRule(1);
            setShowRules(true);
          }}
        >
          Show Rules
        </ShowRulesButton>
      </GameContainer>
      {showRules && (
        <RulesModal>
          <RulesContent>
            <RulesImage
              src={`/connectfourrules/connectfourrules-${currentRule}.png`}
              alt={`Rule ${currentRule}`}
            />
            <RulesText>
              {currentRule === 1 &&
                "Players take turns dropping colored discs into a 7x7 grid."}
              {currentRule === 2 &&
                "The discs fall to the bottom of the column or on top of other discs."}
              {currentRule === 3 &&
                "The first player to connect four discs of their color vertically, horizontally, or diagonally wins!"}
            </RulesText>
            <RulesButtonContainer>
              <SkipButton onClick={handleSkipRules}>
                Skip All <ArrowRight size={16} />
              </SkipButton>
              {currentRule > 1 && (
                <PreviousButton onClick={handlePreviousRule}>
                  <ArrowLeft size={16} /> Previous
                </PreviousButton>
              )}
              {currentRule < 3 ? (
                <NextButton onClick={handleNextRule}>
                  Next Rule <ArrowRight size={16} />
                </NextButton>
              ) : (
                <StartGameButton onClick={handleSkipRules}>
                  Start Game <ArrowRight size={16} />
                </StartGameButton>
              )}
            </RulesButtonContainer>
          </RulesContent>
        </RulesModal>
      )}
      {winner && (
        <ModalOverlay>
          <ModalContent>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              colors={
                winner === PLAYER1
                  ? ["#FF0000", "#FF6666", "#FF3333"]
                  : ["#FFFF00", "#FFFF66", "#FFFF33"]
              }
              numberOfPieces={200}
              gravity={0.3}
            />
            <ModalText>
              {winner === PLAYER1 ? "Red" : "Yellow"} player wins!
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
  background-color: #e6f2ff;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  max-height: 80vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const CurrentPlayer = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const Board = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #3498db;
  padding: 10px;
  border-radius: 10px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
`;

const Cell = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.player === PLAYER1
      ? "red"
      : props.player === PLAYER2
      ? "yellow"
      : "white"};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.player ? props.player : "#f0f0f0")};
  }
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
    color: #000000;
    border: 1px solid black;
  }
`;

const GameButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;

  font-size: 1rem;
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
    border: 1px solid black;
  }
`;

const ShowRulesButton = styled(GameButton)`
  margin-top: 10px;
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
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
`;

const ModalText = styled.p`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const PlayAgainButton = styled(GameButton)`
  margin-top: 0;
`;

const RulesModal = styled(ModalOverlay)``;

const RulesContent = styled(ModalContent)`
  max-width: 80%;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RulesImage = styled.img`
  max-width: 50vw;
  max-height: 60vh;
  border-radius: 10px;
  border: 1px solid #000;
  object-fit: contain;
  margin-bottom: 20px;
`;

const RulesText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const RulesButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const RulesButton = styled(GameButton)`
  display: flex;
  align-items: center;
`;

const SkipButton = styled(RulesButton)``;
const NextButton = styled(RulesButton)``;
const PreviousButton = styled(RulesButton)`
  margin-left: 400px;
`;
const StartGameButton = styled(RulesButton)`
  background-color: lightblue;

  &:hover {
    background-color: #ffffff;
    color: lightblue;
    border: 1px solid lightblue;
  }
`;

export default ConnectFour;
