import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import SnakeAndLadderGame from "./components/SnakeAndLadderGame";
import TicTacToe from "./components/tictactoe";
import BingoGame from "./components/Bingo";
import TypingGame from "./components/TypingGame";
import GamePortalHomePage from "./components/GamePortalHomePage";
import HangmanGame from "./components/HangmanGame";

const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const App = () => {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<GamePortalHomePage />} />
          <Route path="/snake-and-ladder" element={<SnakeAndLadderGame />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/bingo" element={<BingoGame />} />
          <Route path="/TypingGame" element={<TypingGame />} />
          <Route path="/HangmanGame" element={<HangmanGame />} />
          

          // Add more routes for other games here
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
