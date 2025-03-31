import React, {Component} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
import "./PokemonStyle.css"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class PokemonList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemons: [],
            editingPokemon: null,
            addingPokemon: false,
            updatedName: "",
            updatedDateOfBirth: "",
            name: "", 
            ownerId: "",
            categoryId: "",
            currentPage: 0, 
            pageCount: 1, 
            error: "",
        };
    }

    componentDidMount() {
        this.fetchPokemons(this.state.currentPage + 1);
    }

    fetchPokemons = (page) => {
        axios
            .get(`https://localhost:7296/api/Pokemon?pageNumber=${page}&pageSize=10`)
            .then((response) => {
                console.log("API Response:", response.data);
                this.setState({
                    pokemons: response.data.data,
                    pageCount: response.data.totalPages || 1,
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error.message);
                this.setState({ error: "Error retrieving data" });
            });
    };

    handlePageClick = ({ selected }) => {
        this.setState({ currentPage: selected }, () => {
            this.fetchPokemons(selected + 1);
        });
    };

    startEditing = (pokemon) => {
        this.setState({
            editingPokemon: pokemon.id,
            updatedName: pokemon.name,
            updatedDateOfBirth: pokemon.dateOfBirth,
            addingPokemon: false,
        });
    };

    startAdding = () => {
        this.setState({
            addingPokemon: true,
            editingPokemon: null,
            name: "",
            ownerId: "",
            categoryId: ""
        });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    addPokemon = async(e) => {
        const { name, ownerId, categoryId} = this.state;
        
        try{
        await axios.post("https://localhost:7296/api/Pokemon",{name},{params:{ownerId,categoryId}});
                toast.success("Data added successfully!");
                this.setState({
                    name:"",
                    ownerId:"",
                    categoryId:""
                });
    
            this.fetchPokemons(this.state.currentPage + 1);
        } catch (error) {
            toast.error("Error adding data!");
            console.error("Error adding Pokémon:", error);
        }
    };

    updatePokemon = (id) => {
        const { updatedName, updatedDateOfBirth } = this.state;
        axios
            .put(`https://localhost:7296/api/Pokemon/${id}`, {
                id,
                name: updatedName,
                dateOfBirth: updatedDateOfBirth,
            })
            .then(() => {
                this.setState({
                    editingPokemon: null,
                    updatedName: "",
                    updatedDateOfBirth: "",
                });
                this.fetchPokemons(this.state.currentPage + 1);
            })
            .catch((error) => {
                console.error("Error updating pokemon:", error.message);
                this.setState({ errorMsg: "Error updating pokemon" });
            });
    };

    render() {
        const { pokemons, pageCount, editingPokemon, addingPokemon, updatedName, updatedDateOfBirth, name, ownerId, categoryId} = this.state;

        return (
            <div className='container'>
                <h1 className="text-center my-4">Pokemons</h1>

                <div className='row'>
                   {addingPokemon && (
                        <div className="col-md-4">
                            <div className="card pokemon-card">
                                <div className="card-body">
                                    <h5 className="card-title">Add New Pokemon</h5>
                                    <input type="text" className="form-control mb-2" name="name" placeholder="Name" value={name} onChange={this.handleChange} />
                                    <input type="text" className="form-control mb-2" name="ownerId" placeholder="Owner ID" value={ownerId} onChange={this.handleChange} />
                                    <input type="text" className="form-control mb-2" name="categoryId" placeholder="Category ID" value={categoryId} onChange={this.handleChange} />
                                    <button className="btn btn-success btn-sm me-2" onClick={this.addPokemon}>Add</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ addingPokemon: false })}>Cancel</button>
                                </div>
                            </div>
                            <ToastContainer position="top-right" autoClose={3000} />
                        </div> 
                    )}
                    {pokemons.length > 0 ? (
                        pokemons.map((pokemon) => (
                            <div key={pokemon.id} className="col-md-4">
                                <div className="card pokemon-card">
                                    <div className="card-body">
                                        {editingPokemon === pokemon.id ? (
                                            <>
                                                <input type="text" className="form-control mb-2" name="updatedName" placeholder="Update Name" value={updatedName} onChange={this.handleChange} />
                                                <input type="date" className="form-control mb-2" name="updatedDateOfBirth" value={updatedDateOfBirth} onChange={this.handleChange} />
                                                <button className="btn btn-success btn-sm me-2" onClick={() => this.updatePokemon(pokemon.id)}>Save</button>
                                                <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ editingPokemon: null })}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <h5 className="card-title">{pokemon.name}</h5>
                                                <h5 className="card-title">{pokemon.dateOfBirth}</h5>
                                                <button className="btn btn-primary btn-sm mt-2 me-2" onClick={() => this.startEditing(pokemon)}>Edit</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <ToastContainer position="top-right" autoClose={3000} />
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No pokemon found</p>
                    )}
                    
                </div>
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

                <div className="add-button-container">
                    <button className="btn btn-success mb-3" onClick={this.startAdding}>Add Pokemon</button>
                </div>

            </div>
        );
    }
}
export default PokemonList;
