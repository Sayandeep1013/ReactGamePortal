import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MenuBar from "./MenuBar";
import Confetti from "react-confetti";

const SudokuGame = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(
    Array(9)
      .fill()
      .map(() => Array(9).fill(0))
  );
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mode, setMode] = useState("Easy");
  const [inputMode, setInputMode] = useState("Normal");
  const [candidates, setCandidates] = useState(
    Array(9)
      .fill()
      .map(() => Array(9).fill(new Set()))
  );
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [currentRule, setCurrentRule] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [highScores, setHighScores] = useState({
    Easy: [],
    Medium: [],
    Hard: [],
  });

  useEffect(() => {
    fetchNewBoard();
    loadHighScores();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const fetchNewBoard = async () => {
    try {
      const response = await fetch(
        `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution,difficulty}}}`
      );
      const data = await response.json();
      const newBoard = data.newboard.grids[0].value;
      const newSolution = data.newboard.grids[0].solution;
      const difficulty = data.newboard.grids[0].difficulty;
      setBoard(newBoard);
      setSolution(newSolution);
      setMode(difficulty);
      setIsRunning(true);
    } catch (error) {
      console.error("Error fetching Sudoku board:", error);
    }
  };

  const handleCellClick = (row, col) => {
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    const newBoard = [...board];
    if (inputMode === "Normal") {
      newBoard[row][col] = number;
      setBoard(newBoard);
    } else {
      const newCandidates = [...candidates];
      if (newCandidates[row][col].has(number)) {
        newCandidates[row][col].delete(number);
      } else {
        newCandidates[row][col].add(number);
      }
      setCandidates(newCandidates);
    }
    checkGameOver(newBoard);
  };

  const checkGameOver = (currentBoard) => {
    if (JSON.stringify(currentBoard) === JSON.stringify(solution)) {
      setGameOver(true);
      setIsRunning(false);
      updateHighScores();
    }
  };

  const updateHighScores = () => {
    const newHighScores = [...highScores[mode], timer]
      .sort((a, b) => a - b)
      .slice(0, 5);
    setHighScores({ ...highScores, [mode]: newHighScores });
    localStorage.setItem(
      "sudokuHighScores",
      JSON.stringify({ ...highScores, [mode]: newHighScores })
    );
  };

  const loadHighScores = () => {
    const savedHighScores = JSON.parse(
      localStorage.getItem("sudokuHighScores")
    );
    if (savedHighScores) {
      setHighScores(savedHighScores);
    }
  };

  const resetGame = () => {
    fetchNewBoard();
    setSelectedCell(null);
    setCandidates(
      Array(9)
        .fill()
        .map(() => Array(9).fill(new Set()))
    );
    setTimer(0);
    setGameOver(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
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
  };

  return (
    <Container>
      <MenuBar />
      <BackButton onClick={() => navigate("/")}>
        <ArrowLeft size={24} />
      </BackButton>
      <GameContainer>
        <LeftSection>
          <Title>Sudoku</Title>
          <Timer>Time: {formatTime(timer)}</Timer>
          <Board>
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  selected={
                    selectedCell &&
                    selectedCell[0] === rowIndex &&
                    selectedCell[1] === colIndex
                  }
                  borderRight={(colIndex + 1) % 3 === 0 && colIndex !== 8}
                  borderBottom={(rowIndex + 1) % 3 === 0 && rowIndex !== 8}
                >
                  {cell !== 0 ? cell : ""}
                  {inputMode === "Candidate" &&
                    candidates[rowIndex][colIndex].size > 0 && (
                      <CandidateContainer>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <CandidateNumber
                            key={num}
                            visible={candidates[rowIndex][colIndex].has(num)}
                          >
                            {num}
                          </CandidateNumber>
                        ))}
                      </CandidateContainer>
                    )}
                </Cell>
              ))
            )}
          </Board>
        </LeftSection>
        <RightSection>
          <InputModeSelector>
            <InputModeButton
              onClick={() => setInputMode("Normal")}
              active={inputMode === "Normal"}
            >
              Normal
            </InputModeButton>
            <InputModeButton
              onClick={() => setInputMode("Candidate")}
              active={inputMode === "Candidate"}
            >
              Candidate
            </InputModeButton>
          </InputModeSelector>
          <NumberInput>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <NumberButton key={num} onClick={() => handleNumberInput(num)}>
                {num}
              </NumberButton>
            ))}
            <NumberButton onClick={() => handleNumberInput(0)}>×</NumberButton>
          </NumberInput>
          <ModeSelector>
            {["Easy", "Medium", "Hard"].map((m) => (
              <ModeButton
                key={m}
                onClick={() => setMode(m)}
                active={mode === m}
              >
                {m}
                {mode === m && <Arrow>→</Arrow>}
              </ModeButton>
            ))}
          </ModeSelector>
          <ResetButton onClick={resetGame}>New Game</ResetButton>
          <ShowRulesButton onClick={() => setShowRules(true)}>
            Show Rules
          </ShowRulesButton>
        </RightSection>
      </GameContainer>
      <HighScoresContainer>
        <HighScoresTitle>High Scores</HighScoresTitle>
        {Object.entries(highScores).map(([difficulty, scores]) => (
          <HighScoreSection key={difficulty}>
            <HighScoreDifficulty>{difficulty}</HighScoreDifficulty>
            {scores.map((score, index) => (
              <HighScoreEntry key={index}>{formatTime(score)}</HighScoreEntry>
            ))}
          </HighScoreSection>
        ))}
      </HighScoresContainer>
      {showRules && (
        <RulesModal>
          <RulesContent>
            <RulesImage
              src={`/sudokurules/sudokurules-${currentRule}.png`}
              alt={`Rule ${currentRule}`}
            />
            <RulesText>
              {currentRule === 1 &&
                "Fill in the empty cells with numbers from 1 to 9."}
              {currentRule === 2 &&
                "Each row, column, and 3x3 box must contain all numbers from 1 to 9 without repetition."}
              {currentRule === 3 &&
                "Use the candidate mode to mark possible numbers for each cell."}
              {currentRule === 4 &&
                "Complete the puzzle as quickly as possible to set a high score!"}
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
      {gameOver && (
        <GameOverModal>
          <GameOverContent>
            <Confetti width={window.innerWidth} height={window.innerHeight} />
            <h2>Congratulations!</h2>
            <p>You solved the Sudoku puzzle in {formatTime(timer)}!</p>
            <PlayAgainButton onClick={resetGame}>Play Again</PlayAgainButton>
          </GameOverContent>
        </GameOverModal>
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
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
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

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 1px;
  background-color: #000;
  padding: 1px;
  width: 450px;
  height: 450px;
`;

const Cell = styled.div`
  background-color: ${(props) => (props.selected ? "#e0e0e0" : "white")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  border-right: ${(props) =>
    props.borderRight ? "2px solid #000" : "1px solid #ccc"};
  border-bottom: ${(props) =>
    props.borderBottom ? "2px solid #000" : "1px solid #ccc"};
`;

const CandidateContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  font-size: 10px;
`;

const CandidateNumber = styled.span`
  display: ${(props) => (props.visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

const InputModeSelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const InputModeButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.active ? "white" : "black")};
  background-color: ${(props) => (props.active ? "black" : "white")};
  border: 1px solid black;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:first-child {
    border-radius: 5px 0 0 5px;
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
  }

  &:hover {
    background-color: ${(props) => (props.active ? "#333" : "#f0f0f0")};
  }
`;

const NumberInput = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
`;

const NumberButton = styled.button`
  padding: 15px;
  font-size: 20px;
  font-weight: bold;
  color: black;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ModeSelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ModeButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.active ? "white" : "black")};
  background-color: ${(props) => (props.active ? "black" : "white")};
  border: 1px solid black;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:first-child {
    border-radius: 5px 0 0 5px;
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
  }

  &:hover {
    background-color: ${(props) => (props.active ? "#333" : "#f0f0f0")};
  }
`;

const Arrow = styled.span`
  margin-left: 5px;
  color: orange;
`;

const Timer = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #333;
  }
`;

const ShowRulesButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
//   margin-bottom: 10px;

  &:hover {
    background-color: #333;
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
  background-color: #000;

  &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;

const PreviousButton = styled(RulesButton)`
  background-color: #000;

  &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;

const StartGameButton = styled(RulesButton)`
  background-color: #2ecc71;

  &:hover {
    background-color: #fff;
    color: #2ecc71;
    border: 1px solid #2ecc71;
  }
`;

const HighScoresContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const HighScoresTitle = styled.h3`
  margin-bottom: 10px;
`;

const HighScoreSection = styled.div`
  margin-bottom: 10px;
`;

const HighScoreDifficulty = styled.h4`
  margin-bottom: 5px;
`;

const HighScoreEntry = styled.p`
  margin: 2px 0;
`;

const GameOverModal = styled.div`
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

const GameOverContent = styled.div`
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

const PlayAgainButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #333;
  }
`;

export default SudokuGame;
