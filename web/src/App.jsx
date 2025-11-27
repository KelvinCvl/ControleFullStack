import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Home from "./components/Home";
import CreerHistoire from "./components/CreerHistoire";
import ModifierHistoire from "./components/ModifierHistoire";
import GestionHistoire from "./components/GestionHistoire";
import GestionChoix from "./components/GestionChoix";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/home" element={<Home />} />
      <Route path="/creer-histoire" element={<CreerHistoire />} />
      <Route path="/modifier-histoire/:id" element={<ModifierHistoire />} />
      <Route path="/gestion-histoire/:id" element={<GestionHistoire />} />
      <Route path="/gestion-choix/:pageId" element={<GestionChoix />} />
    </Routes>
  );
}

export default App;
