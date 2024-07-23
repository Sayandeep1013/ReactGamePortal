// import React, { useState, useEffect, useMemo, useRef } from "react";
// import styled, { keyframes } from "styled-components";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import MenuBar from "./MenuBar";
// import Confetti from "react-confetti";
// import { gsap } from "gsap";

// const moveAnimation = keyframes`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.2); }
//   100% { transform: scale(1); }
// `;

// const GameWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   position: relative;
// `;

// const GameTitle = styled.h1`
//   font-size: 3rem;
//   font-weight: bold;
//   margin-bottom: 1rem;
//   position: absolute;
//   left: 30px;
//   top: 0px;
//   writing-mode: vertical-rl;
//   text-orientation: upright;
// `;

// const AppContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   height: 94vh;
//   background-color: #f0e68c;
//   color: #000000;
// `;

// const BackButton = styled.button`
//   position: absolute;
//   top: 48px;
//   left: 48px;
//   padding: 10px;
//   background-color: #000000;
//   color: white;
//   border: none;
//   border-radius: 50%;
//   cursor: pointer;
//   transition: background-color 0.3s ease-in-out;
//   z-index: 1000;

//   &:hover {
//     background-color: #ffffff;
//     color: #000000;
//     border: 1px solid black;
//   }
// `;

// const MainContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-grow: 1;
//   max-height: 96vh;
//   position: relative;
// `;

// const BoardContainer = styled.div`
//   display: flex;
//   aspect-ratio: 1;
//   height: calc(98vh - 60px);
//   max-height: calc(98vh - 60px);
// `;

// const LudoBoard = styled.div`
//   width: 100%;
//   height: 100%;
//   background-color: #ffffff;
//   display: grid;
//   grid-template-columns: repeat(15, 1fr);
//   grid-template-rows: repeat(15, 1fr);
//   gap: 1px;
//   border: 5px solid #000000;
// `;

// const Cell = styled.div`
//   border: 1px solid #000000;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   position: relative;
// `;

// const HomeBase = styled(Cell)`
//   background-color: ${(props) => props.color};
// `;

// const SafeCell = styled(Cell)`
//   background-color: #dcdcdc;
// `;

// const PlayerToken = styled.div`
//   width: 80%;
//   height: 80%;
//   border-radius: 50%;
//   background-color: ${(props) => props.color};
//   position: absolute;
//   transition: all 0.4s ease-in-out;
//   animation: ${(props) => (props.isMoving ? moveAnimation : "none")} 0.5s
//     ease-in-out infinite;
// `;

// const SidebarContainer = styled.div`
//   width: 350px;
//   background-color: #f0e68c;
//   padding: 35px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   height: calc(90vh - 60px);
// `;

// const PlayerInfoBox = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: ${(props) => props.color};
//   color: white;
//   padding: 10px;
//   margin-bottom: 15px;
//   border-radius: 5px;
//   font-weight: bold;
//   opacity: ${(props) => (props.isActive && props.gameStarted ? 1 : 0.6)};
//   transform: ${(props) =>
//     props.isActive && props.gameStarted ? "scale(1.17)" : "scale(1)"};
//   transition: all 0.3s ease-in-out;
// `;

// const Button = styled.button`
//   color: #ffffff;
//   padding: 10px 18px;
//   background: #000000;
//   border-radius: 5px;
//   min-width: 220px;
//   border: none;
//   font-size: 16px;
//   cursor: pointer;
//   transition: 0.4s background ease-in;
//   margin-bottom: 15px;

//   &:hover {
//     background-color: #ffffff;
//     border: 1px solid #000000;
//     color: #000000;
//   }
// `;

// const DiceContainer = styled.div`
//   width: 100px;
//   height: 100px;
//   margin: 20px auto;
//   cursor: pointer;
// `;

// const DiceImage = styled.img`
//   width: 100%;
//   height: 100%;
// `;

// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.7);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1000;
// `;

// const ModalContent = styled.div`
//   background-color: white;
//   padding: 20px;
//   border-radius: 10px;
//   text-align: center;
// `;

// const RulesModal = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1000;
// `;

// const RulesContent = styled.div`
//   background-color: white;
//   padding: 20px;
//   border-radius: 10px;
//   text-align: center;
//   max-width: 80%;
//   max-height: 80%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const RulesImage = styled.img`
//   max-width: 50vw;
//   max-height: 60vh;
//   border-radius: 10px;
//   border: 1px solid #000;
//   object-fit: contain;
//   margin-bottom: 20px;
// `;

// const RulesText = styled.p`
//   font-size: 1.2rem;
//   margin-bottom: 20px;
// `;

// const RulesButtonContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
// `;

// const RulesButton = styled.button`
//   padding: 10px 20px;
//   font-size: 1rem;
//   color: white;
//   background-color: #000000;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   transition: background-color 0.3s ease-in-out;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   &:hover {
//     background-color: #ffffff;
//     color: #000000;
//     border: 1px solid black;
//   }
// `;

// const LudoGame = () => {
//   const navigate = useNavigate();
//   const [gameState, setGameState] = useState({
//     players: 4,
//     currentPlayer: 0,
//     playerPositions: [
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//     ],
//     gameStarted: false,
//     diceValue: null,
//     winners: [],
//     movingPlayer: null,
//   });

//   const [showWinModal, setShowWinModal] = useState(false);
//   const [showRules, setShowRules] = useState(true);
//   const [currentRule, setCurrentRule] = useState(1);

//   const playerColors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71"];
//   const diceRef = useRef(null);
//   const rulesModalRef = useRef(null);

//   useEffect(() => {
//     const savedGame = JSON.parse(localStorage.getItem("ludoGame"));
//     if (savedGame) {
//       setGameState(savedGame);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("ludoGame", JSON.stringify(gameState));
//   }, [gameState]);

//   const updateGameState = (newState) => {
//     setGameState((prevState) => ({ ...prevState, ...newState }));
//   };

//   const rollDice = () => {
//     if (!gameState.gameStarted) return;

//     const newValue = Math.floor(Math.random() * 6) + 1;
//     let currentPlayer = gameState.currentPlayer;

//     // Animate dice roll
//     gsap.to(diceRef.current, {
//       rotation: 360,
//       duration: 0.5,
//       ease: "power2.inOut",
//       onComplete: () => {
//         gsap.set(diceRef.current, { rotation: 0 });
//       },
//     });

//     // Update player positions (simplified for this example)
//     const newPositions = [...gameState.playerPositions];
//     newPositions[currentPlayer] = newPositions[currentPlayer].map((pos) =>
//       pos === 0 && newValue === 6
//         ? 1
//         : pos > 0
//         ? Math.min(pos + newValue, 57)
//         : pos
//     );

//     let nextPlayer = (currentPlayer + 1) % gameState.players;

//     updateGameState({
//       diceValue: newValue,
//       currentPlayer: nextPlayer,
//       playerPositions: newPositions,
//       movingPlayer: currentPlayer,
//     });

//     setTimeout(() => {
//       updateGameState({ movingPlayer: null });
//       checkWinCondition();
//     }, 500);
//   };

//   const checkWinCondition = () => {
//     const winners = gameState.playerPositions
//       .map((positions, index) =>
//         positions.every((pos) => pos === 57) ? index : null
//       )
//       .filter((winner) => winner !== null);

//     if (winners.length > 0) {
//       updateGameState({ winners });
//       setShowWinModal(true);
//     }
//   };

//   const resetGame = () => {
//     updateGameState({
//       currentPlayer: 0,
//       playerPositions: [
//         [0, 0, 0, 0],
//         [0, 0, 0, 0],
//         [0, 0, 0, 0],
//         [0, 0, 0, 0],
//       ],
//       gameStarted: false,
//       diceValue: null,
//       winners: [],
//       movingPlayer: null,
//     });
//   };

//   const startGame = () => {
//     updateGameState({ gameStarted: true });
//   };

//   const handleNextRule = () => {
//     if (currentRule < 4) {
//       setCurrentRule(currentRule + 1);
//     } else {
//       handleSkipRules();
//     }
//   };

//   const handlePreviousRule = () => {
//     if (currentRule > 1) {
//       setCurrentRule(currentRule - 1);
//     }
//   };

//   const handleSkipRules = () => {
//     gsap.to(rulesModalRef.current, {
//       y: "-100%",
//       duration: 0.5,
//       ease: "power2.inOut",
//       onComplete: () => setShowRules(false),
//     });
//   };

//   const showRulesModal = () => {
//     setShowRules(true);
//     gsap.fromTo(
//       rulesModalRef.current,
//       { y: "-100%" },
//       { y: 0, duration: 0.5, ease: "power2.inOut" }
//     );
//   };

//   useEffect(() => {
//     if (showRules) {
//       showRulesModal();
//     }
//   }, [showRules]);

//   const renderBoard = () => {
//     // Simplified board rendering
//     return Array(15 * 15)
//       .fill(null)
//       .map((_, index) => {
//         const row = Math.floor(index / 15);
//         const col = index % 15;

//         if (
//           (row < 6 && col < 6) ||
//           (row < 6 && col > 8) ||
//           (row > 8 && col < 6) ||
//           (row > 8 && col > 8)
//         ) {
//           return (
//             <HomeBase
//               key={index}
//               color={playerColors[Math.floor(index / (6 * 6))]}
//             />
//           );
//         }

//         return <Cell key={index} />;
//       });
//   };

//   return (
//     <AppContainer>
//       <MenuBar />
//       <BackButton onClick={() => navigate("/")}>
//         <ArrowLeft size={24} />
//       </BackButton>
//       <MainContainer>
//         <GameWrapper>
//           <GameTitle>LUDO</GameTitle>
//           <BoardContainer>
//             <LudoBoard>
//               {renderBoard()}
//               {gameState.playerPositions.map((positions, playerIndex) =>
//                 positions.map(
//                   (pos, tokenIndex) =>
//                     pos > 0 && (
//                       <PlayerToken
//                         key={`player-${playerIndex}-token-${tokenIndex}`}
//                         color={playerColors[playerIndex]}
//                         style={{
//                           top: `${Math.floor((pos - 1) / 15) * (100 / 15)}%`,
//                           left: `${((pos - 1) % 15) * (100 / 15)}%`,
//                         }}
//                         isMoving={playerIndex === gameState.movingPlayer}
//                       />
//                     )
//                 )
//               )}
//             </LudoBoard>
//           </BoardContainer>
//         </GameWrapper>
//         <SidebarContainer>
//           {[...Array(gameState.players)].map((_, index) => (
//             <PlayerInfoBox
//               key={index}
//               color={playerColors[index]}
//               isActive={index === gameState.currentPlayer}
//               gameStarted={gameState.gameStarted}
//             >
//               Player {index + 1}
//             </PlayerInfoBox>
//           ))}

//           <Button onClick={resetGame}>Reset Game</Button>
//           <Button onClick={showRulesModal}>Show Rules</Button>

//           <DiceContainer onClick={rollDice}>
//             <DiceImage
//               ref={diceRef}
//               src={`/dices/dice-${gameState.diceValue || 1}.svg`}
//               alt={`Dice value: ${gameState.diceValue || 1}`}
//             />
//           </DiceContainer>

//           {!gameState.gameStarted && (
//             <Button onClick={startGame}>Start Game</Button>
//           )}
//         </SidebarContainer>
//       </MainContainer>

//       {showRules && (
//         <RulesModal ref={rulesModalRef}>
//           <RulesContent>
//             <RulesImage
//               src={`/ludorules/ludorule-${currentRule}.png`}
//               alt={`Rule ${currentRule}`}
//             />
//             <RulesText>
//               {currentRule === 1 &&
//                 "Each player has 4 tokens. Roll a 6 to start moving a token."}
//               {currentRule === 2 &&
//                 "Move your tokens clockwise around the board."}
//               {currentRule === 3 &&
//                 "Land on an opponent's token to send it back to start."}
//               {currentRule === 4 && "Get all your tokens to the center to win!"}
//             </RulesText>
//             <RulesButtonContainer>
//               <RulesButton onClick={handleSkipRules}>
//                 Skip All <ArrowRight size={16} />
//               </RulesButton>
//               {currentRule > 1 && (
//                 <RulesButton onClick={handlePreviousRule}>
//                   <ArrowLeft size={16} /> Previous
//                 </RulesButton>
//               )}
//               {currentRule < 4 ? (
//                 <RulesButton onClick={handleNextRule}>
//                   Next Rule <ArrowRight size={16} />
//                 </RulesButton>
//               ) : (
//                 <RulesButton onClick={handleSkipRules}>
//                   Start Game <ArrowRight size={16} />
//                 </RulesButton>
//               )}
//             </RulesButtonContainer>
//           </RulesContent>
//         </RulesModal>
//       )}

//       {showWinModal && (
//         <ModalOverlay onClick={() => setShowWinModal(false)}>
//           <ModalContent onClick={(e) => e.stopPropagation()}>
//             <Confetti
//               width={window.innerWidth}
//               height={window.innerHeight}
//               colors={[
//                 "#e74c3c",
//                 "#3498db",
//                 "#f1c40f",
//                 "#2ecc71",
//                 "#9b59b6",
//                 "#1abc9c",
//               ]}
//               numberOfPieces={200}
//               gravity={0.3}
//             />
//             <h2>Game Over</h2>
//             <p>Player {gameState.winners[0] + 1} wins!</p>
//             <Button
//               onClick={() => {
//                 setShowWinModal(false);
//                 resetGame();
//               }}
//             >
//               Start New Game
//             </Button>
//           </ModalContent>
//         </ModalOverlay>
//       )}
//     </AppContainer>
//   );
// };

// export default LudoGame;




//---------------------------------------------


import React, { useState, useEffect, useMemo, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuBar from "./MenuBar";
import Confetti from "react-confetti";
import { gsap } from "gsap";

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
  left: 30px;
  top: 0px;
  writing-mode: vertical-rl;
  text-orientation: upright;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 94vh;
  background-color: #f0e68c;
  color: #000000;
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
  max-height: 96vh;
  position: relative;
`;

const BoardContainer = styled.div`
  display: flex;
  aspect-ratio: 1;
  height: calc(98vh - 60px);
  max-height: calc(98vh - 60px);
`;

const LudoBoard = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  grid-template-rows: repeat(15, 1fr);
  gap: 1px;
  border: 5px solid #000000;
`;

const Cell = styled.div`
  border: 1px solid #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const HomeBase = styled(Cell)`
  background-color: ${(props) => props.color};
`;

const SafeCell = styled(Cell)`
  background-color: #dcdcdc;
`;

const PlayerToken = styled.div`
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  position: absolute;
  transition: all 0.4s ease-in-out;
  animation: ${(props) => (props.isMoving ? moveAnimation : "none")} 0.5s
    ease-in-out infinite;
`;

const SidebarContainer = styled.div`
  width: 350px;
  background-color: #f0e68c;
  padding: 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(90vh - 60px);
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

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
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
  color: white;
  background-color: #000000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid black;
  }
`;

const LudoGame = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    players: 4,
    currentPlayer: 0,
    playerPositions: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    gameStarted: false,
    diceValue: null,
    winners: [],
    movingPlayer: null,
  });

  const [showWinModal, setShowWinModal] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [currentRule, setCurrentRule] = useState(1);

  const playerColors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71"];
  const diceRef = useRef(null);

  useEffect(() => {
    const savedGame = localStorage.getItem("ludoGame");
    if (savedGame) {
      setGameState(JSON.parse(savedGame));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ludoGame", JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (newState) => {
    setGameState((prevState) => ({ ...prevState, ...newState }));
  };

  const rollDice = () => {
    if (!gameState.gameStarted) return;

    const newValue = Math.floor(Math.random() * 6) + 1;
    let currentPlayer = gameState.currentPlayer;

    // Update player positions (simplified)
    const newPositions = [...gameState.playerPositions];
    newPositions[currentPlayer] = newPositions[currentPlayer].map((pos) =>
      pos === 0 && newValue === 6
        ? 1
        : pos > 0
        ? Math.min(pos + newValue, 57)
        : pos
    );

    let nextPlayer = (currentPlayer + 1) % gameState.players;

    updateGameState({
      diceValue: newValue,
      currentPlayer: nextPlayer,
      playerPositions: newPositions,
      movingPlayer: currentPlayer,
    });

    setTimeout(() => {
      updateGameState({ movingPlayer: null });
      checkWinCondition();
    }, 500);
  };

  const checkWinCondition = () => {
    const winners = gameState.playerPositions
      .map((positions, index) =>
        positions.every((pos) => pos === 57) ? index : null
      )
      .filter((winner) => winner !== null);

    if (winners.length > 0) {
      updateGameState({ winners });
      setShowWinModal(true);
    }
  };

  const resetGame = () => {
    updateGameState({
      currentPlayer: 0,
      playerPositions: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      gameStarted: false,
      diceValue: null,
      winners: [],
      movingPlayer: null,
    });
  };

  const startGame = () => {
    updateGameState({ gameStarted: true });
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

  const renderBoard = () => {
    return Array(15 * 15)
      .fill(null)
      .map((_, index) => {
        const row = Math.floor(index / 15);
        const col = index % 15;

        if (
          (row < 6 && col < 6) ||
          (row < 6 && col > 8) ||
          (row > 8 && col < 6) ||
          (row > 8 && col > 8)
        ) {
          return (
            <HomeBase
              key={index}
              color={playerColors[Math.floor(index / (6 * 6))]}
            />
          );
        }

        return <Cell key={index} />;
      });
  };

  return (
    <AppContainer>
      <MenuBar />
      <BackButton onClick={() => navigate("/")}>
        <ArrowLeft size={24} />
      </BackButton>
      <MainContainer>
        <GameWrapper>
          <GameTitle>LUDO</GameTitle>
          <BoardContainer>
            <LudoBoard>
              {renderBoard()}
              {gameState.playerPositions.map((positions, playerIndex) =>
                positions.map(
                  (pos, tokenIndex) =>
                    pos > 0 && (
                      <PlayerToken
                        key={`player-${playerIndex}-token-${tokenIndex}`}
                        color={playerColors[playerIndex]}
                        style={{
                          top: `${Math.floor((pos - 1) / 15) * (100 / 15)}%`,
                          left: `${((pos - 1) % 15) * (100 / 15)}%`,
                        }}
                        isMoving={playerIndex === gameState.movingPlayer}
                      />
                    )
                )
              )}
            </LudoBoard>
          </BoardContainer>
        </GameWrapper>
        <SidebarContainer>
          {[...Array(gameState.players)].map((_, index) => (
            <PlayerInfoBox
              key={index}
              color={playerColors[index]}
              isActive={index === gameState.currentPlayer}
              gameStarted={gameState.gameStarted}
            >
              Player {index + 1}
            </PlayerInfoBox>
          ))}

          <Button onClick={resetGame}>Reset Game</Button>
          <Button onClick={() => setShowRules(true)}>Show Rules</Button>

          <DiceContainer onClick={rollDice}>
            <DiceImage
              ref={diceRef}
              src={`/dices/dice-${gameState.diceValue || 1}.svg`}
              alt={`Dice value: ${gameState.diceValue || 1}`}
            />
          </DiceContainer>

          {!gameState.gameStarted && (
            <Button onClick={startGame}>Start Game</Button>
          )}
        </SidebarContainer>
      </MainContainer>

      {showRules && (
        <RulesModal>
          <RulesContent>
            <RulesImage
              src={`/ludorules/ludorule-${currentRule}.png`}
              alt={`Rule ${currentRule}`}
            />
            <RulesText>
              {currentRule === 1 &&
                "Each player has 4 tokens. Roll a 6 to start moving a token."}
              {currentRule === 2 &&
                "Move your tokens clockwise around the board."}
              {currentRule === 3 &&
                "Land on an opponent's token to send it back to start."}
              {currentRule === 4 && "Get all your tokens to the center to win!"}
            </RulesText>
            <RulesButtonContainer>
              <RulesButton onClick={() => setShowRules(false)}>
                Skip All <ArrowRight size={16} />
              </RulesButton>
              {currentRule > 1 && (
                <RulesButton onClick={handlePreviousRule}>
                  <ArrowLeft size={16} /> Previous
                </RulesButton>
              )}
              {currentRule < 4 ? (
                <RulesButton onClick={handleNextRule}>
                  Next Rule <ArrowRight size={16} />
                </RulesButton>
              ) : (
                <RulesButton onClick={() => setShowRules(false)}>
                  Start Game <ArrowRight size={16} />
                </RulesButton>
              )}
            </RulesButtonContainer>
          </RulesContent>
        </RulesModal>
      )}

      {showWinModal && (
        <ModalOverlay onClick={() => setShowWinModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              colors={[
                "#e74c3c",
                "#3498db",
                "#f1c40f",
                "#2ecc71",
                "#9b59b6",
                "#1abc9c",
              ]}
              numberOfPieces={200}
              gravity={0.3}
            />
            <h2>Game Over</h2>
            <p>Player {gameState.winners[0] + 1} wins!</p>
            <Button
              onClick={() => {
                setShowWinModal(false);
                resetGame();
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

export default LudoGame;
