import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MenuBar from "./MenuBar";
import Confetti from "react-confetti";

const wordList = [
  {
    word: "guitar",
    hint: "A musical instrument with strings.",
  },
  {
    "word": "piano",
    "hint": "A large keyboard musical instrument."
  },
  {
    "word": "violin",
    "hint": "A string instrument played with a bow."
  },
  {
    "word": "trumpet",
    "hint": "A brass musical instrument with a flared bell."
  },
  {
    "word": "flute",
    "hint": "A woodwind instrument played by blowing across a hole."
  },
  {
    "word": "drums",
    "hint": "Percussion instruments played by striking with sticks."
  },
  {
    "word": "saxophone",
    "hint": "A woodwind instrument commonly used in jazz."
  },
  {
    "word": "harp",
    "hint": "A large stringed instrument played by plucking."
  },
  {
    "word": "cello",
    "hint": "A large string instrument played with a bow, held between the knees."
  },
  {
    "word": "clarinet",
    "hint": "A woodwind instrument with a single-reed mouthpiece."
  },
  {
    "word": "accordion",
    "hint": "A portable keyboard instrument with a bellows."
  },
  {
    "word": "mandolin",
    "hint": "A small string instrument with a pear-shaped body."
  },
  {
    "word": "trombone",
    "hint": "A brass instrument with a sliding tube."
  },
  {
    "word": "oboe",
    "hint": "A woodwind instrument with a double reed."
  },
  {
    "word": "bassoon",
    "hint": "A large woodwind instrument with a double reed."
  },
  {
    "word": "ukulele",
    "hint": "A small four-stringed Hawaiian guitar."
  },
  {
    "word": "banjo",
    "hint": "A string instrument with a round body and a long neck."
  },
  {
    "word": "harmonica",
    "hint": "A small wind instrument played by blowing and drawing air."
  },
  {
    "word": "xylophone",
    "hint": "A percussion instrument with wooden bars played with mallets."
  },
  {
    "word": "bagpipes",
    "hint": "A wind instrument with a bag and pipes, often associated with Scotland."
  },
  {
    "word": "tambourine",
    "hint": "A percussion instrument with a circular frame and jingles."
  },
  {
    "word": "maracas",
    "hint": "Percussion instruments filled with beads, shaken to make sound."
  },
  {
    "word": "sitar",
    "hint": "A plucked string instrument from India."
  },
  {
    "word": "didgeridoo",
    "hint": "An Australian Aboriginal wind instrument."
  },
  {
    "word": "lyre",
    "hint": "An ancient string instrument similar to a small harp."
  },
  {
    "word": "theremin",
    "hint": "An electronic instrument played without physical contact."
  },
  {
    "word": "car",
    "hint": "A vehicle with four wheels used for transportation."
  },
  {
    "word": "bicycle",
    "hint": "A two-wheeled vehicle powered by pedaling."
  },
  {
    "word": "airplane",
    "hint": "A vehicle designed for air travel that has wings."
  },
  {
    "word": "helicopter",
    "hint": "An aircraft with rotating blades on top."
  },
  {
    "word": "train",
    "hint": "A series of connected vehicles traveling on railways."
  },
  {
    "word": "computer",
    "hint": "An electronic device for storing and processing data."
  },
  {
    "word": "smartphone",
    "hint": "A mobile phone with advanced features and connectivity."
  },
  {
    "word": "tablet",
    "hint": "A portable touchscreen computer."
  },
  {
    "word": "television",
    "hint": "A device for viewing broadcasts and digital content."
  },
  {
    "word": "keyboard",
    "hint": "An input device with keys for typing."
  },
  {
    "word": "apple",
    "hint": "A fruit that can be red, green, or yellow."
  },
  {
    "word": "banana",
    "hint": "A long, curved fruit with a yellow peel."
  },
  {
    "word": "grape",
    "hint": "A small, round fruit that grows in clusters."
  },
  {
    "word": "strawberry",
    "hint": "A red fruit with tiny seeds on its surface."
  },
  {
    "word": "orange",
    "hint": "A citrus fruit with a tough skin and juicy interior."
  },
  {
    "word": "dog",
    "hint": "A domesticated animal known as man's best friend."
  },
  {
    "word": "cat",
    "hint": "A small domesticated carnivorous mammal."
  },
  {
    "word": "elephant",
    "hint": "A large mammal with a trunk and tusks."
  },
  {
    "word": "giraffe",
    "hint": "A tall mammal with a very long neck."
  },
  {
    "word": "lion",
    "hint": "A large wild cat known as the king of the jungle."
  },
  {
    "word": "tree",
    "hint": "A perennial plant with a trunk and branches."
  },
  {
    "word": "flower",
    "hint": "A plant's reproductive structure, often colorful and fragrant."
  },
  {
    "word": "mountain",
    "hint": "A large natural elevation of the earth's surface."
  },
  {
    "word": "river",
    "hint": "A large natural stream of water flowing to the sea."
  },
  {
    "word": "ocean",
    "hint": "A vast body of salt water covering most of the earth."
  },
  {
    "word": "book",
    "hint": "A set of written or printed pages, bound together."
  },
  {
    "word": "pencil",
    "hint": "A writing instrument with a graphite core."
  },
  {
    "word": "notebook",
    "hint": "A book of blank pages for writing notes."
  },
  {
    "word": "eraser",
    "hint": "An item used to remove pencil marks."
  },
  {
    "word": "backpack",
    "hint": "A bag carried on the back, used for storing items."
  }
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
  const [showRules, setShowRules] = useState(true);
  const [currentRule, setCurrentRule] = useState(1);
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
      <ShowRulesButton
        onClick={() => {
          setCurrentRule(1);
          setShowRules(true);
        }}
      >
        Show Rules
      </ShowRulesButton>
      {showModal && (
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalContent>
            {isVictory && (
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                colors={["#0000FF", "#1E90FF", "#00BFFF", "#87CEFA", "#4169E1"]}
                numberOfPieces={200}
                gravity={0.3}
              />
            )}
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
      {showRules && (
        <RulesModal>
          <RulesContent>
            <RulesImage
              src={`/hangmanrules/hangmanrules-${currentRule}.png`}
              alt={`Rule ${currentRule}`}
            />
            <RulesText>
              {currentRule === 1 &&
                "Guess letters to complete the hidden word. Each incorrect guess adds a part to the hangman."}
              {currentRule === 2 &&
                "You have 6 attempts to guess the word correctly. The game ends when the word is guessed or the hangman is completed."}
              {currentRule === 3 &&
                "Once you guesses the word correctly before the man hangs completely you win!"}
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
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;

const SkipButton = styled(RulesButton)`
  background-color: #000000;

  &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #000;
  }
`;

const NextButton = styled(RulesButton)`
  // width: 100px;
`;

const PreviousButton = styled(RulesButton)`
  margin-left: 520px;
`;

const StartGameButton = styled(RulesButton)`
  background-color: #5e63ba;

  &:hover {
    background-color: #fff;
    color: #5e63ba;
    border: 1px solid #5e63ba;
  }
`;

const ShowRulesButton = styled(RulesButton)`
  margin-top: 20px;
`;

export default HangmanGame;
