import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import About from "./pages/About";
import Home from "./pages/Home";
import TradingPage from "./pages/trading";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/trading" element={<TradingPage />} />
      </Routes>
      <Toaster closeButton />
    </>
  );
}

export default App;
