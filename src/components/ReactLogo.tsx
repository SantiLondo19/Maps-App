import ReacLogo from "../assets/react.svg";
export const ReactLogo = () => {
  return (
    <img
      src={ReacLogo}
      alt="Vite Logo"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "5px",
        width: "80px",
      }}
    ></img>
  );
};
