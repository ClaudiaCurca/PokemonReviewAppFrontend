import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';


const AddNewData = () => {

  
    return (
      
       
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
          <Link to ="/addPokemonForm">Add Pokemons</Link>
          </li>
          <li>
          <Link to ="/addCategoryForm">Add Category</Link>
          </li>
          <li>
          <Link to ="/addCountryForm">Add Country</Link>
          </li>
          <li>
          <Link to ="/addOwnerForm">Add Owner</Link>
          </li>
          <li>
          <Link to ="/addReviewForm">Add Review</Link>
          </li>
          <li>
          <Link to ="/addReviewerForm">Add Reviewer</Link>
          </li>

        </ul>
        
       
    );
};

export default AddNewData;