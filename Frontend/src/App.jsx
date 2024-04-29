import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./utils/general.js";
import Todos from "./components/Todos";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Todos />
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
