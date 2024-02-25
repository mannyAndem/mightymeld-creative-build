import { useCoinsContext } from "./context/CoinsContext";
import * as icons from "react-icons/gi";

const CoinBalance = () => {
  const { coins } = useCoinsContext();
  return (
    <span className="text-xl flex items-center gap-2 text-yellow-400">
      <icons.GiTwoCoins />
      {coins}
    </span>
  );
};

export default CoinBalance;
