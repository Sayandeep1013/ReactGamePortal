import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuBar from "./MenuBar";
import Confetti from "react-confetti";

const BingoGame = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(25).fill(false));
  const [maxTurns, setMaxTurns] = useState(8);
  const [turnsLeft, setTurnsLeft] = useState(maxTurns);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bingoLines, setBingoLines] = useState([]);
  const [showRules, setShowRules] = useState(true);
  const [currentRule, setCurrentRule] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem("bingoGame"));
    if (savedGame) {
      setBoard(savedGame.board);
      setMaxTurns(savedGame.maxTurns);
      setTurnsLeft(savedGame.turnsLeft);
      setGameOver(savedGame.gameOver);
      setScore(savedGame.score);
      setBingoLines(savedGame.bingoLines);
      setGameStarted(savedGame.gameStarted);
    }
  }, []);

  useEffect(() => {
    if (gameStarted) {
      localStorage.setItem(
        "bingoGame",
        JSON.stringify({
          board,
          maxTurns,
          turnsLeft,
          gameOver,
          score,
          bingoLines,
          gameStarted,
        })
      );
    }
  }, [board, maxTurns, turnsLeft, gameOver, score, bingoLines, gameStarted]);

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

    if (availableCells.length === 0) return -1;
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
    setTurnsLeft(maxTurns);
    setGameOver(false);
    setScore(0);
    setShowModal(false);
    setBingoLines([]);
    setGameStarted(true);
  };

  const handleNextRule = () => {
    if (currentRule < 4) {
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
        <BoardContainer>
          <Title>Bingo Game</Title>
          {!gameStarted ? (
            <TurnSelector>
              <StyledLabel htmlFor="turnSelect">
                Select number of turns:{" "}
              </StyledLabel>
              <StyledSelect
                id="turnSelect"
                value={maxTurns}
                onChange={(e) => setMaxTurns(parseInt(e.target.value))}
              >
                {[5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </StyledSelect>
              <StartGameButton
                onClick={() => {
                  resetGame();
                  setGameStarted(true);
                }}
              >
                Start Game
              </StartGameButton>
            </TurnSelector>
          ) : (
            <>
              <Status>
                Turns left: {turnsLeft}/{maxTurns}
              </Status>
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
            </>
          )}
        </BoardContainer>
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
              src={`/bingorules/bingorules-${currentRule}.png`}
              alt={`Rule ${currentRule}`}
            />
            <RulesText>
              {currentRule === 1 &&
                "Click on an empty cell to mark it. The computer will randomly mark another cell after your turn."}
              {currentRule === 2 &&
                "A Bingo is a straight line of 5 marked cells (horizontal, vertical, or diagonal)."}
              {currentRule === 3 &&
                "You have a limited number of turns to create as many Bingos as possible."}
              {currentRule === 4 &&
                "Scoring: 1 Bingo = 1 point, 2 Bingos = 2 points, 3 Bingos = 3 points, 4 Bingos = 5 points, 5+ Bingos = 10 points"}
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
              {currentRule < 4 ? (
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
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              colors={[
                // "#000000",
                // "#FFFFFF",
                "#888888",
                "#7FFFD4",
                "#AAFF00",
                "#AFE1AF",
                "#097969",
                "#50C878",
                "#90EE90",
              ]}
              numberOfPieces={200}
              gravity={0.3}
            />
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
  min-height: 94vh;
  background-color: #c5f6c5;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  border: 1px solid #000;
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

const RulesModal = styled.div`
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

const RulesContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
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

const RulesButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #000000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #333333;
  }
`;

const SkipButton = styled(RulesButton)`
  background-color: #000;

    &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;

const NextButton = styled(RulesButton)`
  // width: 100px;
    &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;

const PreviousButton = styled(RulesButton)`
  margin-left: 500px;
    &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;

const ShowRulesButton = styled(RulesButton)`
  margin-top: 20px;

  &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;

const TurnSelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  label {
    margin-right: 10px;
    font-size: 1.2rem;
  }

  select {
    padding: 5px 10px;
    font-size: 1rem;
    border-radius: 5px;
  }
`;

const StyledLabel = styled.label`
  margin-right: 10px;
  font-size: 1.2rem;
  font-weight: bold;
`;

const StyledSelect = styled.select`
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #000000;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  background-size: 20px auto;
  padding-right: 30px;

  &:focus {
    outline: none;
    border-color: #2ecc71;
  }
`;

const StartGameButton = styled(RulesButton)`
  margin-left: 20px;
  background-color: #2ecc71;

   &:hover {
    background-color: #fff;
    color: #2ecc71;
    border: 1px solid #2ecc71;
  }
`;

export default BingoGame;
