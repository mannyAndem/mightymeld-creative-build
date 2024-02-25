import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

/**
 * The coins context will hold the amount of coins a user/player currently has as well as functions to add and subtract said coins.
 * The "coins" will be the primary in-game currency allowing the player to purchase powerups to make the gaming experience much more entertaining as well as themes and whatnot.
 *
 *  */
const CoinsContext = createContext(null);

const CoinsContextProvider = ({ children }) => {
  const { get, set } = useLocalStorage("coins");

  // Setting this value for testing, will change back before pushing to prod.
  const [coins, setCoins] = useState(get() || 0);

  const addCoins = (amount) => {
    setCoins((prev) => prev + amount);
  };

  const deductCoins = (amount) => {
    setCoins((prev) => {
      //If amount to be deducted is greater than coin amount, just don't do anything, in other words, fail silently
      if (amount > coins) {
        return coins;
      }
      return prev - amount;
    });
  };

  // Whenever coins state changes, update same in localStorage
  useEffect(() => {
    set(coins);
  }, [coins]);

  return (
    <CoinsContext.Provider value={{ coins, addCoins, deductCoins }}>
      {children}
    </CoinsContext.Provider>
  );
};

export default CoinsContextProvider;

export const useCoinsContext = () => {
  return useContext(CoinsContext);
};
