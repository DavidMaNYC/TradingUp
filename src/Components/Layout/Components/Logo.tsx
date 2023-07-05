import { Typography } from "@mui/material";

const Logo = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#707070"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.44 11.05l-9.19 9.2a6 6 0 01-8.49 0 6 6 0 010-8.49l9.19-9.2a4 4 0 015.66 0 4 4 0 010 5.66l-9.2 9.2a2 2 0 01-2.83 0 2 2 0 010-2.83l6.59-6.59"></path>
      </svg>
      <Typography
        variant="h5"
        component="h1"
        style={{
          marginTop: "5px",
          color: "#707070",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
        }}
      >
        TradingUp
      </Typography>
    </div>
  );
};

export default Logo;
