const useLocalStorage = (key) => {
  const get = () => {
    return JSON.parse(localStorage.getItem(key)) || null;
  };

  const set = (data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  return { get, set };
};

export default useLocalStorage;
