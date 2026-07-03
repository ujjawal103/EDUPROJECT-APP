import useThemeStore from "../store/theme.store";
import { COLORS } from "../constants/colors";

const useTheme = () => {
  const mode = useThemeStore((state) => state.mode);

  return COLORS[mode];
};

export default useTheme;


// use like this in your component
// import useTheme from "../hooks/useTheme";

// const colors = useTheme();