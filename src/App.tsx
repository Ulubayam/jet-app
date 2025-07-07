import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import Favorites from "./pages/Favorites/Favorites";
import { Details } from "./pages/Details/Details";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/restaurant/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;
