import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Country from "./pages/Country";
import './App.css';
import State from "./pages/State";

export default function App() {
  return(
    <BrowserRouter>
      <Header />
      <main className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-country" element={<Country />} />
          <Route path="/edit-country/:id" element={<Country />} />
          <Route path="/state" element={<State />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}