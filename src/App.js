import { createTheme, ThemeProvider } from "@mui/material";
import "./App.css";
import Home from "./pages/home";

function App() {
  const theme = createTheme({
    typography: {
      button: {
        textTransform: "none",
      },
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </>
  );
}

export default App;
