import React, { useState } from 'react';
import './App.css';
import './FormStyles.css'
import './Navbar.css';
import OwnerList from './components/OwnerList';
import CountryList from './components/CountryList';
import PokemonList from './components/PokemonList';
import AddPokemonForm from './components/AddPokemonForm';
import ReviewList from './components/ReviewList';
import ReviewerList from './components/ReviewerList';
import CategoryList from './components/CategoryList';
import AddNewData from './components/AddNewData';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddCategoryForm from './components/AddCategoryForm';
import AddCountryForm from './components/AddCountryForm';
import AddOwnerForm from './components/AddOwnerForm';
import AddReviewForm from './components/AddReviewForm';
import AddReviewerForm from './components/AddReviewerForm';
import Home from './components/Home';

function App() {
  return (
   
    <Router>
        <div  className="container mt-5" >
          <nav className="navbar">
            <div className="container-fluid"></div>
            <div className="logo"><Link to="/Home">Pokemon Review Application</Link></div>
            
          
            <ul className="nav-links">
              <li className="nav-item me-3">
                <Link to="/ownerList">Owners</Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/countryList">Countries</Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/pokemonList">Pokemons</Link>
              </li>
              <li className="nav-item me-3">
                <Link to ="/reviewList">Reviews</Link>
              </li>
              <li className="nav-item me-3">
              <Link to ="/reviewerList">Reviewers</Link>
              </li>
              <li className="nav-item me-3">
              <Link to ="/categoryList">Categories</Link>
              </li>

              <li className="nav-item me-3">
              <Link to ="/addNewData">Add Data</Link>
              </li>

            </ul>

          </nav>

          <Routes>
            <Route path="/ownerList" element={<OwnerList />} />
            <Route path="/countryList" element={<CountryList />} />
            <Route path="/pokemonList" element={<PokemonList />} />
            <Route path="/reviewList" element={<ReviewList/>}/>
            <Route path="/reviewerList" element = {<ReviewerList/>}/>
            <Route path="/categoryList" element = {<CategoryList/>}/>
            <Route path="/addNewData" element={<AddNewData/>} />
            <Route path="/addPokemonForm" element={<AddPokemonForm/>} />
            <Route path="/addCategoryForm" element={<AddCategoryForm/>} />
            <Route path="/addCountryForm" element={<AddCountryForm/>} />
            <Route path="/addOwnerForm" element={<AddOwnerForm/>} />
            <Route path="/addReviewForm" element={<AddReviewForm/>}/>
            <Route path="/addReviewerForm" element={<AddReviewerForm/>}/>
            <Route path="/Home" element = {<Home/>}/>
            
          </Routes>
        </div>
        
      
    </Router>
  );
}

export default App;
