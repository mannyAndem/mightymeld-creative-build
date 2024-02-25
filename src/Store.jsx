import CoinBalance from "./CoinBalance";
import { useCoinsContext } from "./context/CoinsContext";
import { useThemeContext } from "./context/ThemeContext";
import { themes } from "./themes";

/**
 * The store is where users can buy themes for the game
 * Themes can be applied to change the game's look
 */

const Store = ({ goHome }) => {
  const { theme } = useThemeContext();

  if (theme.name === "default") {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-5">
        <div className="w-full flex items-center justify-between lg:w-1/3">
          <button className="self-start text-pink-400" onClick={goHome}>
            Back home
          </button>

          <CoinBalance />
        </div>
        <div className="w-full bg-pink-50 p-5 rounded-md shadow-sm lg:w-1/3">
          <div className="text-center text-3xl mb-4 font-bold text-pink-400">
            Store
          </div>
          <div className="w-full grid grid-cols-2 gap-4 ">
            {themes.map((theme) => (
              <StoreItem theme={theme} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-5">
      <div className="w-full flex items-center justify-between lg:w-1/3">
        <button
          style={{ color: theme.colors.accent }}
          className="self-start"
          onClick={goHome}
        >
          Back home
        </button>

        <CoinBalance />
      </div>
      <div
        style={{
          background: theme.colors.background,
          color: theme.colors.primary,
        }}
        className="w-full p-5  rounded-md shadow-sm lg:w-1/3"
      >
        <div className="text-center text-3xl mb-4 font-bold">Store</div>
        <div className="w-full grid grid-cols-2 gap-4 ">
          {themes.map((theme) => (
            <StoreItem theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;

const StoreItem = ({ theme }) => {
  const {
    purchasedThemes,
    buyTheme,
    setTheme,
    theme: currentTheme,
  } = useThemeContext();
  const { coins, deductCoins } = useCoinsContext();
  const isPurchased = Boolean(
    purchasedThemes?.find((item) => item.name === theme.name)
  );

  console.log(purchasedThemes);
  const handleBuy = () => {
    deductCoins(theme.price);
    buyTheme(theme);
  };

  const handleUse = () => {
    setTheme(theme);
  };

  return (
    <div
      style={{ background: theme.colors.accent }}
      className="text-sm text-white  p-3 rounded-md border-2 flex flex-col gap-3 items-center text-center"
    >
      <span className="text-base font-medium">{theme.name}</span>
      <span className="font-bold">${theme.price}</span>
      {isPurchased ? (
        <button
          style={{ background: theme.colors.accent2 }}
          onClick={handleUse}
          className="rounded-3xl px-4 py-2  text-white font-medium"
        >
          {currentTheme.name === theme.name ? "In use" : "Use"}
        </button>
      ) : (
        <button
          style={{ background: theme.colors.accent2 }}
          onClick={handleBuy}
          disabled={coins < theme.price}
          className="rounded-3xl px-4 py-2  text-white font-medium disabled:opacity-60"
        >
          Buy
        </button>
      )}
    </div>
  );
};
