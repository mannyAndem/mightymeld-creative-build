import { useThemeContext } from "./context/ThemeContext";

export function Tile({ content: Content, flip, state }) {
  const { theme } = useThemeContext();
  switch (state) {
    case "start":
      return theme.name === "default" ? (
        <Back
          className="flip-animation inline-block w-full aspect-square rounded-md p-3 shadow-sm bg-indigo-300 text-center"
          flip={flip}
        />
      ) : (
        <Back
          style={{
            backgroundColor: theme.colors.primary,
          }}
          className="flip-animation inline-block w-full aspect-square rounded-md p-3 shadow-sm text-center"
          flip={flip}
        />
      );
    case "flipped":
      return theme.name === "default" ? (
        <Front className="flip-animation inline-block w-full aspect-square rounded-md p-3 shadow-sm bg-blue-500 text-white">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      ) : (
        <Front
          style={{ backgroundColor: theme.colors.accent }}
          className="flip-animation inline-block w-full aspect-square rounded-md p-3 shadow-sm text-white"
        >
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      );
    case "matched":
      return theme.name === "default" ? (
        <Matched className="inline-block w-full aspect-square rounded-md p-3 text-indigo-200">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      ) : (
        <Matched
          style={{ color: theme.colors.accent2 }}
          className="inline-block w-full aspect-square rounded-md p-3 "
        >
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
      b;
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip, style }) {
  return <div style={style} onClick={flip} className={className}></div>;
}

function Front({ className, children, style }) {
  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
}

function Matched({ className, children, style }) {
  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
}
