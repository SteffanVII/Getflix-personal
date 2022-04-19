import { useLayoutEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/app.css';

import Header from './components/header.js';
import Footer from "./components/footer";

//pages
import Home from './components/pages/home/home.js';
import SearchMovie from "./components/pages/search/search";
import Movie from "./components/pages/movie/movie";
import Discover from "./components/pages/discover/discover";

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/search" element={<SearchMovie/>}/>
          <Route path="/movie" element={<Movie/>}></Route>
          <Route path="/discover" element={<Discover/>}></Route>
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
