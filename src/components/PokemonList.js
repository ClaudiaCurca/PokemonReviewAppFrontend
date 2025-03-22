import React, {Component} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
import "./PokemonStyle.css"; 
class PokemonList extends Component{
    constructor(props){
        super(props)
        this.state = {
            pokemons:[],
            currentPage: 0, 
            pageCount: 1, 
            error:"",
            editingPokemon:null,
            updatedName:"",
            updatedDateOfBirth:"",
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




       /*** Enable Editing Mode ***/
       startEditing = (pokemon) => {
        this.setState({
        editingPokemon: pokemon.id,
        updatedName: pokemon.name,
        updatedDateOfBirth: pokemon.dateOfBirth,
    });
  };

  /*** Handle Input Change ***/
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /*** Handle PUT Request ***/
  updatePokemon = (id) => {
    const { updatedName,updatedDateOfBirth } = this.state;
    axios
      .put(`https://localhost:7296/api/Pokemon/${id}`, {
        id: id,
        name: updatedName,
        dateOfBirth: updatedDateOfBirth
      })
      .then((response) => {
        console.log("Updated successfully:", response.data);
        this.setState({
            editingPokemon: null, // Exit editing mode
            updatedName: "",
            updatedDateOfBirth: "",

        });
        this.fetchPokemons(this.state.currentPage + 1); // Refresh data
      })
      .catch((error) => {
        console.error("Error updating pokemon:", error.message);
        this.setState({ errorMsg: "Error updating pokemon" });
      });
  };



    render(){
        const{pokemons, errorMsg, pageCount, editingPokemon,updatedName,updatedDateOfBirth} = this.state;
        
        return(
            <div className="container">
                <h2 className="text-center my-4">List of Pokemons</h2>
                
                <div className='row'>
                    {pokemons.length>0?(
                        pokemons.map((pokemon)=>(
                            <div key={pokemon.id} className="col-md-4">
                                <div className="card pokemon-card">
                                    <div className="card-body">
                                        {editingPokemon=== pokemon.id?(
                                            <>
                                                <input
                                                    type="text"
                                                    className="form-control mb-2"
                                                    name="updatedName"
                                                    value={updatedName}
                                                    onChange={this.handleChange}
                                                />
                                                <input
                                                    type="date"
                                                    className="form-control mb-2"
                                                    name="updatedDateOfBirth"
                                                    value={updatedDateOfBirth}
                                                    onChange={this.handleChange}
                                                    
                                                />
                                                <button className="btn btn-success btn-sm me-2" onClick={() => this.updatePokemon(pokemon.id)}>
                                                    Save
                                                </button>
                                                <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ editingPokemon: null })}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <h5 className="card-title">{pokemon.name}</h5>
                                                <h5 className="card-title">{pokemon.dateOfBirth}</h5>
                                                
                                                <button className="btn btn-primary btn-sm mt-2" onClick={() => this.startEditing(pokemon)}>
                                                    Edit
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No pokemon found</p>
                    )}
                </div>
                        
                {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

                <div className="pagination-container">
                    
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
                        renderOnZeroPageCount={null} 
                    />
                    
                </div>
            </div>
        );
    }
}
export default PokemonList