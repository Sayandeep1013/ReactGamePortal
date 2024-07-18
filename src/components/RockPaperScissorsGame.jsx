import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuBar from "./MenuBar";
import Confetti from "react-confetti";

const choices = ["rock", "paper", "scissors"];

const RockPaperScissorsGame = () => {
  const navigate = useNavigate();
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [currentRule, setCurrentRule] = useState(1);
  const [gameMode, setGameMode] = useState("normal");

  useEffect(() => {
    if (userChoice && computerChoice) {
      const outcome = getGameResult(userChoice, computerChoice);
      setResult(outcome);
      if (outcome === "win") {
        setScore(score + 1);
        setShowModal(true);
      } else if (outcome === "lose") {
        setShowModal(true);
      }
    }
  }, [userChoice, computerChoice]);

  const getGameResult = (user, computer) => {
    if (user === computer) return "draw";
    if (
      (user === "rock" && computer === "scissors") ||
      (user === "paper" && computer === "rock") ||
      (user === "scissors" && computer === "paper")
    ) {
      return "win";
    }
    return "lose";
  };

  const handleUserChoice = (choice) => {
    setUserChoice(choice);
    let computerChoice;
    switch (gameMode) {
      case "hard":
        computerChoice = getHardModeChoice(choice);
        break;
      case "troll":
        computerChoice = getTrollModeChoice(choice);
        break;
      default:
        computerChoice = choices[Math.floor(Math.random() * 3)];
    }
    setComputerChoice(computerChoice);
  };

  const getHardModeChoice = (userChoice) => {
    const winningChoices = {
      rock: ["rock", "paper"],
      paper: ["paper", "scissors"],
      scissors: ["scissors", "rock"],
    };
    return winningChoices[userChoice][Math.floor(Math.random() * 2)];
  };

  const getTrollModeChoice = (userChoice) => {
    const winningChoices = {
      rock: "paper",
      paper: "scissors",
      scissors: "rock",
    };
    return winningChoices[userChoice];
  };

  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
    setShowModal(false);
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
  };

  return (
    <Container>
      <MenuBar />
      <BackButton onClick={() => navigate("/")}>
        <ArrowLeft size={24} />
      </BackButton>
      <GameContainer>
        <Title>Rock Paper Scissors</Title>
        <GameArea>
          <PlayerIcon>{userChoice ? `🧑‍🦱 ${userChoice}` : "🧑‍🦱"}</PlayerIcon>
          <span>VS</span>
          <ComputerIcon>
            {computerChoice ? `🤖 ${computerChoice}` : "🤖"}
          </ComputerIcon>
        </GameArea>
        <ChoiceButtons>
          <ChoiceButton onClick={() => handleUserChoice("rock")}>
            🪨
          </ChoiceButton>
          <ChoiceButton onClick={() => handleUserChoice("paper")}>
            📄
          </ChoiceButton>
          <ChoiceButton onClick={() => handleUserChoice("scissors")}>
            ✂️
          </ChoiceButton>
        </ChoiceButtons>
        <ModeSelector>
          <ModeButton
            selected={gameMode === "normal"}
            onClick={() => setGameMode("normal")}
          >
            Normal
          </ModeButton>
          <ModeButton
            selected={gameMode === "hard"}
            onClick={() => setGameMode("hard")}
          >
            Hard
          </ModeButton>
          <ModeButton
            selected={gameMode === "troll"}
            onClick={() => setGameMode("troll")}
          >
            Troll
          </ModeButton>
        </ModeSelector>
        <Score>Score: {score}</Score>
      </GameContainer>
      <ShowRulesButton onClick={() => setShowRules(true)}>
        Show Rules
      </ShowRulesButton>
      {showRules && (
        <RulesModal>
          <RulesContent>
            <RulesImage
              src={`/rpsrules/rpsrules-${currentRule}.png`}
              alt={`Rule ${currentRule}`}
            />
            <RulesText>
              {currentRule === 1 &&
                "Choose rock, paper, or scissors. Rock beats scissors, scissors beats paper, paper beats rock."}
              {currentRule === 2 &&
                "In Hard mode, the computer will never choose a losing move. It will either draw or win."}
              {currentRule === 3 &&
                "In Troll mode, the computer will always choose the winning move against your choice."}
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
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {result === "win" && (
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                colors={["#FFD700", "#FFA500", "#FF4500", "#FF6347", "#FF7F50"]}
                numberOfPieces={200}
                gravity={0.3}
              />
            )}
            <ModalText>
              {result === "win"
                ? "Congratulations! You won!"
                : "Oh no! You lost. Better luck next time!"}
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
  background-color: #ffe5b4;
  position: relative;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const GameArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  margin-bottom: 30px;
`;

const PlayerIcon = styled.div`
  font-size: 3rem;
  display: flex;
border: 1px solid green;
background-color: #ffe5b4;
border-radius: 10px;
`;

const ComputerIcon = styled.div`
  font-size: 3rem;
display: flex;
border: 1px solid red;
background-color: #ffe5b4;
border-radius: 10px;

`;

const ChoiceButtons = styled.div`
  display: flex;
  gap: 20px;
`;

const ChoiceButton = styled.button`
  font-size: 2.5rem;
  padding: 10px 20px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ModeSelector = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const ModeButton = styled.button`
  font-size: 1rem;
  padding: 5px 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: ${(props) => (props.selected ? "100%" : "0")};
    height: 2px;
    background-color: #000;
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }
`;

const Score = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 20px;
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

const ShowRulesButton = styled.button`
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
  &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;

const PreviousButton = styled(RulesButton)`
  margin-left: auto;
  margin-right: 10px;
    &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;

const StartGameButton = styled(RulesButton)`
  background-color: #ffd700;
  color: #000;

  &:hover {
    background-color: #fff;
    color: #ffd700;
    border: 1px solid #FFD700;
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
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalText = styled.p`
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const PlayAgainButton = styled.button`
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

export default RockPaperScissorsGame;
