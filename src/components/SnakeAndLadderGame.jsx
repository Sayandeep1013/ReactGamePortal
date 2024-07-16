import React, { useState, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuBar from "./MenuBar";

const moveAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const GameWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const GameTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  position: absolute;
  left: 10px;
  top: 0px;
  writing-mode: vertical-rl;
  text-orientation: upright;
`;

const TitleAnd = styled.span`
  font-size: 2rem;
  font-weight: normal;
`;

const moveToken = keyframes`
  0% { transform: translate(0, 0); }
  100% { transform: translate(var(--moveX), var(--moveY)); }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
  color: #000000;
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
  z-index: 1000;

  &:hover {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid black;
  }
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  position: relative;
`;

const BoardContainer = styled.div`
  display: flex;
  aspect-ratio: 1;
  height: calc(100vh - 60px);
  max-height: calc(100vh - 60px);
`;

const BoardTable = styled.table`
  border: 5px solid #000000;
  display: inline-flex;
  flex-direction: column-reverse;
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  max-width: calc(100vh - 80px);
  max-height: calc(100vh - 80px);
  aspect-ratio: 1;
`;

const TableRow = styled.tr`
  display: flex;
  &:nth-child(even) {
    flex-direction: row-reverse;
  }
`;

const TableCell = styled.th`
  width: calc(100% / 10);
  aspect-ratio: 1;
  border: 1px solid #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 1.2vmin;
  color: #000000;

  &.snake {
    background: #ff6b6b;
  }

  &.ladder {
    background: #4ecdc4;
  }
`;

const PlayerToken = styled.div`
  width: 40%;
  height: 40%;
  border-radius: 50%;
  position: absolute;
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
  transition: all 0.4s ease-in-out;
  // animation: ${(props) => (props.isActive ? moveAnimation : "none")} 0.6s
  //     ease-in-out infinite,
  ${(props) =>
    props.isMoving ? moveAnimation : "none"} 0.5s ease-in-out infinite;
`;

const Destination = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.8vmin;
  color: #000000;
  background-color: rgba(255, 255, 255, 0);
  padding: 1px 3px;
  border-radius: 3px;
`;

const SidebarContainer = styled.div`
  width: 350px;
  background-color: #ffffff;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 60px);
`;

const PlayerSelectorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const PlayerSelectorButton = styled.button`
  padding: 5px 10px;
  font-size: 20px;
  background-color: ${(props) => (props.active ? "#000000" : "white")};
  color: ${(props) => (props.active ? "white" : "#000000")};
  border: 1px solid #000000;
  transition: 0.3s all ease-in;
`;

const PlayerInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
  color: white;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  font-weight: bold;
  opacity: ${(props) => (props.isActive && props.gameStarted ? 1 : 0.6)};
  transform: ${(props) =>
    props.isActive && props.gameStarted ? "scale(1.17)" : "scale(1)"};
  transition: all 0.3s ease-in-out;
`;

const Button = styled.button`
  color: #ffffff;
  padding: 10px 18px;
  background: #000000;
  border-radius: 5px;
  min-width: 220px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: 0.4s background ease-in;
  margin-bottom: 15px;

  &:hover {
    background-color: #ffffff;
    border: 1px solid #000000;
    color: #000000;
  }
`;

const DiceContainer = styled.div`
  width: 100px;
  height: 100px;
  margin: 20px auto;
  cursor: pointer;
`;

const DiceImage = styled.img`
  width: 100%;
  height: 100%;
`;

const PlayerStartArea = styled.div`
  width: 180px;
  height: 20%;
  display: flex;
  background-color: #fffaf0;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-radius: 100px;
  border: 1px solid #000000;
  margin-right: 20px;
  align-self: flex-start;
  margin-top: 75%;
`;

const StartToken = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  opacity: ${(props) => (props.started ? 0 : 1)};
  transition: opacity 0.5s ease-in-out;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// const ModalContent = styled.div`
//   background-color: white;
//   padding: 20px;
//   border-radius: 10px;
//   text-align: center;
// `;

const defaultSnakesAndLadders = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
  7: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 97,
};

const SnakeAndLadderGame = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    players: 2,
    currentPlayer: 0,
    playerPositions: [0, 0, 0, 0],
    gameStarted: false,
    diceValue: null,
    snakesAndLadders: defaultSnakesAndLadders,
    hit: 0,
    winners: [],
    isRandomGame: false,
    playerStarted: [false, false, false, false],
    movingPlayer: null,
  });

  const [showWinModal, setShowWinModal] = useState(false);

  const playerColors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71"];

  const memoizedValue = useMemo(() => {
    const arr = Array.from({ length: 100 }, (_, i) => i + 1);
    const newArr = [];
    while (arr.length) newArr.push(arr.splice(0, 10));
    return newArr;
  }, []);

  const updateGameState = (newState) => {
    setGameState((prevState) => ({ ...prevState, ...newState }));
  };

  const rollDice = () => {
    if (!gameState.gameStarted) return;

    let nextPlayer = (gameState.currentPlayer + 1) % gameState.players;

    // Skip players who have finished
    while (gameState.playerPositions[nextPlayer] === 100) {
      nextPlayer = (nextPlayer + 1) % gameState.players;
    }

    const newValue = Math.floor(Math.random() * 6) + 1;
    let newPosition = gameState.playerPositions[gameState.currentPlayer];

    if (!gameState.playerStarted[gameState.currentPlayer] && newValue === 1) {
      newPosition = 1;
      const newPlayerStarted = [...gameState.playerStarted];
      newPlayerStarted[gameState.currentPlayer] = true;
      updateGameState({ playerStarted: newPlayerStarted });
    } else if (gameState.playerStarted[gameState.currentPlayer]) {
      newPosition += newValue;
    }

    if (newPosition <= 100) {
      if (gameState.snakesAndLadders[newPosition]) {
        newPosition = gameState.snakesAndLadders[newPosition];
      }

      const newPositions = [...gameState.playerPositions];
      newPositions[gameState.currentPlayer] = newPosition;

      let newWinners = [...gameState.winners];
      if (
        newPosition === 100 &&
        !newWinners.includes(gameState.currentPlayer)
      ) {
        newWinners.push(gameState.currentPlayer);
      }

      updateGameState({
        diceValue: newValue,
        currentPlayer: nextPlayer,
        playerPositions: newPositions,
        hit: gameState.hit + 1,
        winners: newWinners,
        movingPlayer: gameState.currentPlayer,
      });

      setTimeout(() => {
        updateGameState({ movingPlayer: null });
        if (
          newWinners.length === gameState.players - 1 ||
          (gameState.players === 2 && newWinners.length === 1)
        ) {
          setShowWinModal(true);
        }
      }, 500);
    } else {
      updateGameState({
        diceValue: newValue,
        currentPlayer: nextPlayer,
        hit: gameState.hit + 1,
      });
    }
  };

  const resetCurrentGame = () => {
    updateGameState({
      gameStarted: false,
      playerPositions: Array(gameState.players).fill(0),
      currentPlayer: 0,
      diceValue: null,
      hit: 0,
      winners: [],
      isRandomGame: false,
      playerStarted: Array(gameState.players).fill(false),
    });
  };

  const generateRandomGame = () => {
    const newSnakesAndLadders = {};
    const usedCells = new Set();

    const addConnection = (start, end) => {
      if (start !== end && !usedCells.has(start) && !usedCells.has(end)) {
        newSnakesAndLadders[start] = end;
        usedCells.add(start);
        usedCells.add(end);
        return true;
      }
      return false;
    };

    for (let i = 0; i < 10; i++) {
      let start, end;
      do {
        start = Math.floor(Math.random() * 99) + 1;
        end = Math.floor(Math.random() * (100 - start)) + start + 1;
      } while (!addConnection(start, end));
    }

    for (let i = 0; i < 10; i++) {
      let start, end;
      do {
        start = Math.floor(Math.random() * 98) + 2;
        end = Math.floor(Math.random() * (start - 1)) + 1;
      } while (!addConnection(start, end));
    }

    updateGameState({
      snakesAndLadders: newSnakesAndLadders,
      isRandomGame: true,
    });
  };

  const startGame = () => {
    updateGameState({ gameStarted: true });
  };

  const ModalContent = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  `;

  const WinnerText = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  `;

  const RunnerUpText = styled.p`
    font-size: 18px;
    margin-bottom: 5px;
  `;

  const LoserText = styled.p`
    font-size: 16px;
  `;

  const getWinnerText = () => {
    const { winners, players } = gameState;
    if (players === 2) {
      return (
        <>
          <WinnerText>Player {winners[0] + 1} wins!</WinnerText>
        </>
      );
    } else if (players === 3) {
      return (
        <>
          <WinnerText>Winner: Player {winners[0] + 1}</WinnerText>
          <RunnerUpText>Runner-up: Player {winners[1] + 1}</RunnerUpText>
        </>
      );
    } else if (players === 4) {
      return (
        <>
          <WinnerText>Winner: Player {winners[0] + 1}</WinnerText>
          <RunnerUpText>1st Runner-up: Player {winners[1] + 1}</RunnerUpText>
          <RunnerUpText>2nd Runner-up: Player {winners[2] + 1}</RunnerUpText>
          <LoserText>Loser: Player {winners[3] + 1}</LoserText>
        </>
      );
    }
  };

  return (
    <AppContainer>
      <MenuBar />
      <BackButton onClick={() => navigate("/")}>
        <ArrowLeft size={24} />
      </BackButton>
      <MainContainer>
        <GameWrapper>
          <GameTitle>
            SNAKES
            <TitleAnd>and</TitleAnd>
            LADDERS
          </GameTitle>
          <PlayerStartArea>
            {[...Array(gameState.players)].map((_, index) => (
              <StartToken
                key={index}
                color={playerColors[index]}
                started={gameState.playerStarted[index]}
              />
            ))}
          </PlayerStartArea>

          <BoardContainer>
            <BoardTable>
              {memoizedValue.map((row, rowIndex) => (
                <TableRow key={`row-${rowIndex}`}>
                  {row.map((cell) => (
                    <TableCell
                      key={`cell-${cell}`}
                      className={`
                      ${
                        gameState.snakesAndLadders[cell] &&
                        gameState.snakesAndLadders[cell] < cell
                          ? "snake"
                          : ""
                      }
                      ${
                        gameState.snakesAndLadders[cell] &&
                        gameState.snakesAndLadders[cell] > cell
                          ? "ladder"
                          : ""
                      }
                    `}
                    >
                      {cell}
                      {gameState.playerPositions.map((pos, index) =>
                        pos === cell && index < gameState.players ? (
                          <PlayerToken
                            key={`player-${index}`}
                            style={{
                              backgroundColor: playerColors[index],
                              "--moveX": `${((cell - 1) % 10) * 10}%`,
                              "--moveY": `${
                                -Math.floor((cell - 1) / 10) * 10
                              }%`,
                            }}
                            top={(index % 2) * 40 + 10}
                            left={(Math.floor(index / 2) % 2) * 40 + 10}
                            isActive={
                              index === gameState.currentPlayer &&
                              gameState.gameStarted
                            }
                            isMoving={index === gameState.movingPlayer}
                          />
                        ) : null
                      )}
                      {gameState.snakesAndLadders[cell] && (
                        <Destination>
                          {gameState.snakesAndLadders[cell]}
                        </Destination>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </BoardTable>
          </BoardContainer>
        </GameWrapper>
        <SidebarContainer>
          <PlayerSelectorContainer>
            {[2, 3, 4].map((num) => (
              <PlayerSelectorButton
                key={num}
                active={gameState.players === num}
                disabled={gameState.gameStarted}
                onClick={() =>
                  !gameState.gameStarted &&
                  updateGameState({
                    players: num,
                    playerPositions: Array(num).fill(0),
                    playerStarted: Array(num).fill(false),
                  })
                }
              >
                {num}
              </PlayerSelectorButton>
            ))}
          </PlayerSelectorContainer>

          {[...Array(gameState.players)].map((_, index) => (
            <PlayerInfoBox
              key={index}
              color={playerColors[index]}
              isActive={index === gameState.currentPlayer}
              gameStarted={gameState.gameStarted}
            >
              Player {index + 1}: Position {gameState.playerPositions[index]}
            </PlayerInfoBox>
          ))}

          <Button onClick={resetCurrentGame}>Reset Current Game</Button>
          <Button onClick={generateRandomGame} disabled={gameState.gameStarted}>
            Generate Random Game
          </Button>

          <DiceContainer onClick={rollDice}>
            <DiceImage
              src={`/dice-${gameState.diceValue || 1}.svg`}
              alt={`Dice value: ${gameState.diceValue || 1}`}
            />
          </DiceContainer>

          {!gameState.gameStarted && (
            <Button onClick={startGame}>Start Game</Button>
          )}
        </SidebarContainer>
      </MainContainer>

      {showWinModal && (
        <ModalOverlay onClick={() => setShowWinModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Game Over</h2>
            <p>{getWinnerText()}</p>
            <Button
              onClick={() => {
                setShowWinModal(false);
                resetCurrentGame();
              }}
            >
              Start New Game
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </AppContainer>
  );
};

export default SnakeAndLadderGame;
