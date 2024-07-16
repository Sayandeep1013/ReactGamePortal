import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuBar from "./MenuBar";

const wordList = [
  {
    word: "guitar",
    hint: "A musical instrument with strings.",
  },
  // ... (include all the words from the original wordList)
];

const HangmanGame = () => {
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState("");
  const [hint, setHint] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const maxGuesses = 6;

  useEffect(() => {
    getRandomWord(false);
  }, []);

  const getRandomWord = (startGame = true) => {
    const { word, hint } =
      wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(word.toLowerCase());
    setHint(hint);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setShowModal(false);
    if (startGame) {
      setGameStarted(true);
    }
  };

  const startGame = () => {
    getRandomWord();
  };

  const handleGuess = (letter) => {
    if (!gameStarted || guessedLetters.includes(letter)) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!currentWord.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);
    }

    checkGameStatus(newGuessedLetters);
  };

  const checkGameStatus = (guessed) => {
    if (wrongGuesses + 1 >= maxGuesses) {
      setIsVictory(false);
      setShowModal(true);
    } else if (
      currentWord.split("").every((letter) => guessed.includes(letter))
    ) {
      setIsVictory(true);
      setShowModal(true);
    }
  };

  const renderWord = () => {
    return currentWord.split("").map((letter, index) => (
      <Letter
        key={index}
        className={guessedLetters.includes(letter) ? "guessed" : ""}
      >
        {guessedLetters.includes(letter) ? letter : ""}
      </Letter>
    ));
  };

  const renderKeyboard = () => {
    return "qwertyuiopasdfghjklzxcvbnm".split("").map((letter) => (
      <KeyboardButton
        key={letter}
        onClick={() => handleGuess(letter)}
        disabled={!gameStarted || guessedLetters.includes(letter)}
      >
        {letter}
      </KeyboardButton>
    ));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  return (
    <Container>
      <MenuBar />
      <BackButton onClick={() => navigate("/")}>
        <ArrowLeft size={24} />
      </BackButton>
      <GameContainer>
        <HangmanBox>
          <HangmanImage
            src={`/hangman/hangman-${wrongGuesses}.svg`}
            alt="hangman"
          />
          <h1>Hangman Game</h1>
        </HangmanBox>
        <GameBox>
          <WordDisplay>{renderWord()}</WordDisplay>
          <HintText>
            Hint: <b>{hint}</b>
          </HintText>
          <GuessesText>
            Incorrect guesses:{" "}
            <b>
              {wrongGuesses} / {maxGuesses}
            </b>
          </GuessesText>
          <Keyboard>{renderKeyboard()}</Keyboard>
        </GameBox>
      </GameContainer>
      <GameButton onClick={startGame}>
        {gameStarted ? "Restart Game" : "Start Game"}
      </GameButton>
      {showModal && (
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalContent>
            <ModalTitle>
              {isVictory ? "Congratulations!" : "Game Over!"}
            </ModalTitle>
            <ModalText>
              {isVictory ? "You found the word:" : "The correct word was:"}{" "}
              <b>{currentWord}</b>
            </ModalText>
            <GameButton onClick={getRandomWord}>Play Again</GameButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  align-items: center;
  justify-content: center;
  min-height: 94vh;
  background: #5e63ba;
`;

const BackButton = styled.button`
  position: absolute;
  top: 48px;
  left: 48px;
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

const GameContainer = styled.div`
  display: flex;
  width: 850px;
  gap: 70px;
  padding: 60px 40px;
  background: #fff;
  border-radius: 10px;
  align-items: flex-end;
  justify-content: space-between;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 782px) {
    flex-direction: column;
    padding: 30px 15px;
    align-items: center;
  }
`;

const HangmanBox = styled.div`
  text-align: center;

  h1 {
    font-size: 1.45rem;
    margin-top: 20px;
    text-transform: uppercase;

    @media (max-width: 782px) {
      display: none;
    }
  }
`;

const HangmanImage = styled.img`
  max-width: 270px;
  user-select: none;

  @media (max-width: 782px) {
    max-width: 200px;
  }
`;

const GameBox = styled.div``;

const WordDisplay = styled.ul`
  gap: 10px;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const Letter = styled.li`
  width: 28px;
  font-size: 2rem;
  text-align: center;
  font-weight: 600;
  margin-bottom: 40px;
  text-transform: uppercase;
  border-bottom: 3px solid #000;

  &.guessed {
    margin: -40px 0 35px;
    border-color: transparent;
  }

  @media (max-width: 782px) {
    margin-bottom: 35px;
    font-size: 1.7rem;

    &.guessed {
      margin: -35px 0 25px;
    }
  }
`;

const HintText = styled.h4`
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 15px;

  @media (max-width: 782px) {
    font-size: 1rem;
  }
`;

const GuessesText = styled.h4`
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 15px;

  b {
    color: #ff0000;
  }

  @media (max-width: 782px) {
    font-size: 1rem;
  }
`;

const Keyboard = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 40px;
  justify-content: center;
`;

const KeyboardButton = styled.button`
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
  background: #000000;
  padding: 7px;
  width: calc(100% / 9 - 5px);

  &:hover {
    background: grey;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.6;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 0 10px;
`;

const ModalContent = styled.div`
  padding: 30px;
  max-width: 420px;
  width: 100%;
  border-radius: 10px;
  background: #fff;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h4`
  font-size: 1.53rem;
`;

const ModalText = styled.p`
  font-size: 1.15rem;
  margin: 15px 0 30px;
  font-weight: 500;

  b {
    color: #000;
    font-weight: 600;
  }
`;

const GameButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  width: 300px;
  height: 50px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid black;
  }
`;

export default HangmanGame;
