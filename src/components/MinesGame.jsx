import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Coins, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { gsap } from "gsap";
import MenuBar from "./MenuBar";
import Confetti from "react-confetti";
import { BiFontSize } from "react-icons/bi";

const MinesGame = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(25).fill(false));
  const [minePositions, setMinePositions] = useState([]);
  const [betAmount, setBetAmount] = useState(10000);
  const [mineCount, setMineCount] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [currentRule, setCurrentRule] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const boardRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem("minesGame"));
    if (savedGame) {
      setBoard(savedGame.board);
      setMinePositions(savedGame.minePositions);
      setBetAmount(savedGame.betAmount);
      setMineCount(savedGame.mineCount);
      setGameOver(savedGame.gameOver);
      setScore(savedGame.score);
      setGameStarted(savedGame.gameStarted);
      setCurrentMultiplier(savedGame.currentMultiplier);
      setRevealedCount(savedGame.revealedCount);
    }
  }, []);

  useEffect(() => {
    if (gameStarted) {
      localStorage.setItem(
        "minesGame",
        JSON.stringify({
          board,
          minePositions,
          betAmount,
          mineCount,
          gameOver,
          score,
          gameStarted,
          currentMultiplier,
          revealedCount,
        })
      );
    }
  }, [
    board,
    minePositions,
    betAmount,
    mineCount,
    gameOver,
    score,
    gameStarted,
    currentMultiplier,
    revealedCount,
  ]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      updateMultiplier();
    }
  }, [betAmount, mineCount, revealedCount]);

  const placeMines = () => {
    const mines = [];
    while (mines.length < mineCount) {
      const position = Math.floor(Math.random() * 25);
      if (!mines.includes(position)) {
        mines.push(position);
      }
    }
    setMinePositions(mines);
  };

  const handleCellClick = (index) => {
    if (gameOver || board[index] || !gameStarted) return;

    const newBoard = [...board];
    newBoard[index] = true;
    setBoard(newBoard);

    gsap.to(`#cell-${index}`, {
      rotationY: 180,
      duration: 0.5,
      onComplete: () => {
        if (minePositions.includes(index)) {
          endGame(false);
        } else {
          const newRevealedCount = revealedCount + 1;
          setRevealedCount(newRevealedCount);
          updateMultiplier(newRevealedCount);

          if (newRevealedCount === 25 - mineCount) {
            endGame(true);
          }
        }
      },
    });
  };

  const updateMultiplier = (revealed = revealedCount) => {
    const baseMultiplier = 1.05;
    const safeTiles = 25 - mineCount;
    const riskFactor = mineCount / 24;
    const betFactor = Math.log(betAmount / 10000) / Math.log(100) + 1;

    const newMultiplier =
      baseMultiplier ** revealed * (1 + riskFactor) * betFactor;
    setCurrentMultiplier(newMultiplier);
  };

  const endGame = (won) => {
    setGameOver(true);
    if (won) {
      setScore(Math.floor(betAmount * currentMultiplier));
      setShowConfetti(true);
    } else {
      setScore(0);
    }
    setTimeout(() => {
      setShowModal(true);
      gsap.to(modalRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }, 500);
  };

  const resetGame = () => {
    setBoard(Array(25).fill(false));
    setMinePositions([]);
    setGameOver(false);
    setScore(0);
    setShowModal(false);
    setRevealedCount(0);
    setCurrentMultiplier(1);
    setGameStarted(false);
    setBetAmount(10000);
    setMineCount(1);
    setShowConfetti(false);

    gsap.to(boardRef.current.children, {
      rotationY: 0,
      duration: 0.5,
    });

    localStorage.removeItem("minesGame");
  };

  const handleCashOut = () => {
    if (revealedCount > 0) {
      endGame(true);
    }
  };

  const handleStartGame = () => {
    placeMines();
    setGameStarted(true);
  };

  const handleBetAmountChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setBetAmount(10000);
    } else if (value < 10000) {
      setBetAmount(10000);
    } else if (value > 1000000) {
      setBetAmount(1000000);
    } else {
      setBetAmount(value);
    }
  };

  const handleMineCountChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setMineCount(1);
    } else if (value < 1) {
      setMineCount(1);
    } else if (value > 24) {
      setMineCount(24);
    } else {
      setMineCount(value);
    }
  };

  const handleShowRules = () => {
    setCurrentRule(1);
    setShowRules(true);
  };

  const handleSkipRules = () => {
    setShowRules(false);
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

  return (
    <Container>
      <MenuBar />
      <BackButton onClick={() => navigate("/")}>
        <ArrowLeft size={24} />
      </BackButton>
      <GameContainer>
        <LeftSection>
          <Title>Mines Game</Title>
          <GameSetup>
            <SetupItem>
              <StyledLabel>Bet Amount:</StyledLabel>
              <StyledInput
                type="number"
                min="10000"
                max="1000000"
                value={betAmount}
                onChange={handleBetAmountChange}
                disabled={gameStarted}
              />
            </SetupItem>
            <SetupItem>
              <StyledLabel>Number of Mines:</StyledLabel>
              <StyledInput
                type="number"
                min="1"
                max="24"
                value={mineCount}
                onChange={handleMineCountChange}
                disabled={gameStarted}
              />
            </SetupItem>
          </GameSetup>
          <GameInfo>
            <InfoItem>
              <Coins size={24} />
              <span>{betAmount}</span>
            </InfoItem>
            <InfoItem>
              <span>Mines: {mineCount}</span>
            </InfoItem>
            <InfoItem>
              <span>Multiplier: {currentMultiplier.toFixed(2)}x</span>
            </InfoItem>
          </GameInfo>
        </LeftSection>
        <BoardContainer>
          <Board ref={boardRef}>
            {board.map((revealed, index) => (
              <Cell
                key={index}
                id={`cell-${index}`}
                onClick={() => handleCellClick(index)}
                revealed={revealed}
                isMine={revealed && minePositions.includes(index)}
              >
                <CellFront />
                <CellBack>
                  {revealed &&
                    (minePositions.includes(index) ? (
                      <img src="/MinesGame/mine.png" alt="Mine" />
                    ) : (
                      <img src="/MinesGame/coin.png" alt="Coin" />
                    ))}
                </CellBack>
              </Cell>
            ))}
          </Board>
          {!gameStarted && (
            <StartGameButton onClick={handleStartGame}>
              Start Game
            </StartGameButton>
          )}
        </BoardContainer>
        <RightSection>
          <Title>Cash Out Section </Title>
          {gameStarted && (
            <>
              <CashOutButton
                onClick={handleCashOut}
                disabled={revealedCount === 0}
              >
                Cash Out
              </CashOutButton>
              <CurrentScore>
                Current Score: {Math.floor(betAmount * currentMultiplier)}
              </CurrentScore>
            </>
          )}
        </RightSection>
      </GameContainer>
      <ShowRulesButton onClick={handleShowRules}>Show Rules</ShowRulesButton>
      {showRules && (
        <RulesModal>
          <RulesContent>
            <RulesImage
              src={`/minesrules/minesrules-${currentRule}.png`}
              alt={`Rule ${currentRule}`}
            />
            <RulesText>
              {currentRule === 1 &&
                "Choose your bet amount and the number of mines to place on the grid."}
              {currentRule === 2 &&
                "Click on cells to reveal them. Avoid mines and try to uncover as many safe cells as possible."}
              {currentRule === 3 &&
                "Your potential payout increases with each safe cell revealed. The more mines, the higher the risk and reward."}
              {currentRule === 4 &&
                "Cash out at any time to secure your winnings, or risk it all by continuing to play!"}
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
                <StartGameButtonV2 onClick={handleSkipRules}>
                  Start Game <ArrowRight size={16} />
                </StartGameButtonV2>
              )}
            </RulesButtonContainer>
          </RulesContent>
        </RulesModal>
      )}
      {showModal && (
        <ModalOverlay onClick={resetGame}>
          <ModalContent ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <ModalText>
              {score > 0 ? (
                <>
                  <WinIcon>
                    <DollarSign size={48} />
                  </WinIcon>
                  You won: {score} coins!
                </>
              ) : (
                "Oops! You hit a mine. Better luck next time!"
              )}
            </ModalText>
            <PlayAgainButton onClick={resetGame}>Play Again</PlayAgainButton>
          </ModalContent>
        </ModalOverlay>
      )}
      {showConfetti && <Confetti />}
    </Container>
  );
};

// Styled components (updated with new color scheme)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 94vh;
  background-color: #90ee90;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const LeftSection = styled.div`
  width: 250px;
  background-color: #ffb6c1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightSection = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #add8e6;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
`;

const GameSetup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const SetupItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 5px;
  font-size: 1rem;
  border: 1px solid #000000;
  border-radius: 5px;
  width: 100%;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`;

const StartGameButton = styled.button`
  color: #ffffff;
  padding: 10px 18px;
  font-size: 1rem;
  background: #000000;
  border-radius: 5px;
  min-width: 220px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: 0.4s background ease-in;
  margin-top: 20px;

  &:hover {
    background-color: #ffffff;
    border: 1px solid #000000;
    color: #000000;
  }
`;

const StartGameButtonV2 = styled.button`
  color: #ffffff;
  padding: 10px 18px;
  font-size: 1rem;
  background: green;
  border-radius: 5px;
  min-width: 220px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: 0.4s background ease-in;
  margin-top: 20px;

  &:hover {
    background-color: #ffffff;
    border: 1px solid green;
    color: green;
  }
`;

const GameInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;

  svg {
    margin-right: 0.5rem;
  }
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Cell = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  cursor: pointer;
  transition: transform 0.6s;
  transform-style: preserve-3d;
`;

const CellFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #2ecc71;
  border: 1px solid #000;
  border-radius: 5px;
`;

const CellBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: white;
  border: 1px solid #000;
  border-radius: 5px;
  transform: rotateY(180deg);
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 80%;
    max-height: 80%;
  }
`;

const CashOutButton = styled.button`
  color: #ffffff;
  padding: 10px 18px;
  font-size: 1rem;
  background: #000000;
  border-radius: 5px;
  min-width: 220px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: 0.4s background ease-in;
  margin-top: 20px;

  &:hover {
    background-color: #ffffff;
    border: 1px solid #000000;
    color: #000000;
  }

  &:disabled {
    // background-color: #95a5a6;
    // cursor: not-allowed;
  }
`;

const CurrentScore = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
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
  color: #ffffff;
  padding: 10px 18px;
  font-size: 1rem;
  background: #000000;
  border-radius: 5px;
  min-width: 220px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: 0.4s background ease-in;
  margin-top: 20px;

  &:hover {
    background-color: #ffffff;
    border: 1px solid #000000;
    color: #000000;
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
  color: #ffffff;
  padding: 10px 18px;
  font-size: 1rem;
  background: #000000;
  border-radius: 5px;
  min-width: 220px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: 0.4s background ease-in;
  margin-top: 20px;

  &:hover {
    background-color: #ffffff;
    border: 1px solid #000000;
    color: #000000;
  }
`;

const SkipButton = styled(RulesButton)`
  background-color: #000;

  &:hover {
    background-color: #fff;
  }
`;

const NextButton = styled(RulesButton)`
  background-color: #000;

  &:hover {
    background-color: #fff;
  }
`;

const PreviousButton = styled(RulesButton)`
  background-color: #000;

  &:hover {
    background-color: #fff;
  }
`;

const ShowRulesButton = styled(RulesButton)`
  margin-top: 20px;
  background-color: #000;

  &:hover {
    background-color: #fff;
  }
`;

const WinIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  color: #000;
`;

export default MinesGame;
