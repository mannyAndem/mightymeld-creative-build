import { useState } from "react";
import { StartScreen, PlayScreen } from "./Screens";
import CoinsContextProvider from "./context/CoinsContext";
import Store from "./Store";
import ThemeContextProvider from "./context/ThemeContext";

function App() {
  const [gameState, setGameState] = useState("start");

  return (
    <CoinsContextProvider>
      <ThemeContextProvider>
        {gameState === "start" ? (
          <StartScreen
            start={() => setGameState("play")}
            store={() => setGameState("store")}
          />
        ) : gameState === "play" ? (
          <PlayScreen end={() => setGameState("start")} />
        ) : (
          <Store goHome={() => setGameState("start")} />
        )}
      </ThemeContextProvider>
    </CoinsContextProvider>
  );
}

export default App;
