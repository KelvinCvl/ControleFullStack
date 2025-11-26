import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Home from "./components/Home";
import CreerHistoire from "./components/CreerHistoire";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/home" element={<Home />} />
      <Route path="/creer-histoire" element={<CreerHistoire />} />
    </Routes>
  );
}

export default App;
