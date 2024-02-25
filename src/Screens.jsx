import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import { useCoinsContext } from "./context/CoinsContext";
import CoinBalance from "./CoinBalance";
import { useThemeContext } from "./context/ThemeContext";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start, store }) {
  const { theme } = useThemeContext();

  console.log(theme);

  if (theme.name === "default") {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <div className="w-full flex flex-col items-center text-center py-16 px-5 bg-pink-50 rounded-md shadow-sm gap-16 lg:w-1/3">
          <h1 className="text-4xl font-bold text-pink-600">Memory</h1>
          <div className="text-xl font-medium text-pink-500">
            Flip over tiles looking for pairs
          </div>
          <div className="w-full flex items-center gap-4">
            <button
              onClick={start}
              className="text-xl font-medium text-white bg-gradient-to-b from-pink-400 to-pink-600 rounded-3xl w-full py-3 shadow-sm hover:from-pink-600 hover:to-pink-400 transition-all duration-200 ease-out"
            >
              Play
            </button>
            <button
              onClick={store}
              className="text-xl font-medium border-pink-600 border text-pink-600 rounded-3xl w-full py-3 shadow-sm hover:from-pink-600 hover:to-pink-400 transition-all duration-200 ease-out"
            >
              Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-5`}>
      <div
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.primary,
        }}
        className={`w-full flex flex-col items-center text-center py-16  px-5 rounded-md shadow-sm gap-16 lg:w-1/3`}
      >
        <h1 className="text-4xl font-bold">Memory</h1>
        <div className="text-xl font-medium">
          Flip over tiles looking for pairs
        </div>
        <div className="w-full flex items-center gap-4">
          <button
            style={{
              color: theme.colors.accent2,
              backgroundColor: theme.colors.accent,
            }}
            onClick={start}
            className={`text-xl font-medium rounded-3xl w-full py-3 shadow-sm  transition-all duration-200 ease-out`}
          >
            Play
          </button>
          <button
            style={{
              color: theme.colors.accent2,
              border: `1px solid ${theme.colors.accent}`,
            }}
            onClick={store}
            className={`text-xl font-medium  rounded-3xl w-full py-3 shadow-sm transition-all duration-200 ease-out`}
          >
            Store
          </button>
        </div>
      </div>
    </div>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const { coins, addCoins, deductCoins } = useCoinsContext();

  const { theme } = useThemeContext();

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  // This is a function which flips all the tiles to reveal their contents for a fixed amount of time before restoring the board to its original state pre-flip
  const flipAll = () => {
    const stateBeforeFlip = tiles;
    deductCoins(25);

    setTiles((prev) =>
      prev.map((tile) => ({
        ...tile,
        state: tile.state === "matched" ? "matched" : "flipped",
      }))
    );

    setTimeout(() => {
      setTiles(stateBeforeFlip);
    }, 1500);
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
        addCoins(10);
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  if (theme.name === "default") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-5">
        <div className="w-full flex items-center justify-between p-4 lg:w-1/3">
          <span className="text-blue-500 text-xl">
            Tries{" "}
            <span className="bg-indigo-200 px-2 rounded-md">{tryCount}</span>
          </span>

          <CoinBalance />
        </div>
        <div className="w-full grid grid-cols-4 gap-4 p-4 bg-blue-50 rounded-md shadow-sm lg:w-1/3">
          {getTiles(16).map((tile, i) => (
            <Tile key={i} flip={() => flip(i)} {...tile} />
          ))}
        </div>
        <button
          onClick={flipAll}
          disabled={coins < 25}
          className="bg-blue-300 text-white px-16 py-3 rounded-3xl font-medium flex items-center gap-4 disabled:opacity-70"
        >
          <span>Peek</span>
          <span className="text-yellow-400 flex items-center gap-1">
            <icons.GiTwoCoins />
            25
          </span>
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-5">
      <div className="w-full flex items-center justify-between p-4 lg:w-1/3">
        <span style={{ color: theme.colors.primary }} className="text-xl">
          Tries{" "}
          <span
            style={{ backgroundColor: theme.colors.accent }}
            className="px-2 rounded-md"
          >
            {tryCount}
          </span>
        </span>

        <CoinBalance />
      </div>
      <div
        style={{
          background: theme.colors.background,
          color: theme.colors.primary,
        }}
        className="w-full grid grid-cols-4 gap-4 p-4 rounded-md shadow-sm lg:w-1/3"
      >
        {getTiles(16).map((tile, i) => (
          <Tile key={i} flip={() => flip(i)} {...tile} />
        ))}
      </div>
      <button
        style={{
          background: theme.colors.accent,
          color: theme.colors.accent2,
        }}
        onClick={flipAll}
        disabled={coins < 25}
        className=" px-16 py-3 rounded-3xl font-medium flex items-center gap-4 disabled:opacity-70"
      >
        <span>Peek</span>
        <span className="text-yellow-400 flex items-center gap-1">
          <icons.GiTwoCoins />
          25
        </span>
      </button>
    </div>
  );
}
