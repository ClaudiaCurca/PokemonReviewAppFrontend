import React, {Component,useState, useEffect} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";

class PokemonList extends Component{
    constructor(props){
        super(props)
        this.state = {
            pokemons:[],
            currentPage: 0, 
            pageCount: 1, 
            error:''
        };
    }
    componentDidMount(){
        this.fetchPokemons(this.state.currentPage + 1);
    }
    fetchPokemons = (page) => {
        axios
          .get(`https://localhost:7296/api/Pokemon?pageNumber=${page}&pageSize=10`)
          .then((response) => {
            console.log("API Response:", response.data);
            this.setState({
              pokemons: response.data.data,
              pageCount: response.data.totalPages || 1, // Assuming API returns totalPages
            });
          })
          .catch((error) => {
            console.error("Error fetching data:", error.message);
            this.setState({ errorMsg: "Error retrieving data" });
          });
      };

      handlePageClick = ({ selected }) => {
        this.setState({ currentPage: selected }, () => {
        this.fetchPokemons(selected + 1); 
        });
      };
    render(){
        const{pokemons, errorMsg, pageCount} = this.state;
        
        return(
            <div>
                <h2>List of Pokemons</h2>
                {
                    pokemons.length >0 ?
                    (pokemons.map(pokemon =><div key = {pokemon.id}><h3>{pokemon.id} - {pokemon.name} - {pokemon.dateOfBirth}</h3></div>)) :
                    (<p>No owners found</p>)
                }
                {
                    errorMsg ?
                    <div>{errorMsg}</div> :
                    null
                }
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
                
            </div>
        )
    }
    
}
export default PokemonList