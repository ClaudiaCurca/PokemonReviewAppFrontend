import React, {Component} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
import "./CountryStyle.css"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class CountryList extends Component{
    constructor(props){
        super(props)
        this.state = {
            countries:[],
            editingCountry: null, 
            addingCountry:false,
            name:"",
            updatedName: "", 
            currentPage: 0,
            pageCount: 1,
            error: "",
        };
    }
    componentDidMount(){
        this.fetchCountry(this.state.currentPage + 1);
    }

    fetchCountry = (page) => {
        axios
          .get(`https://localhost:7296/api/Country?pageNumber=${page}&pageSize=10`)
          .then((response) => {
            console.log("API Response:", response.data);
            this.setState({
                countries: response.data.data,
                pageCount: response.data.totalPages || 1,
            });
          })
          .catch((error) => {
            console.error("Error fetching data:", error.message);
            this.setState({ error: "Error retrieving data" });

            toast.error(error.response?.data?.message || "Error retrieving data",);


          });

      };
      handlePageClick = ({ selected }) => {
        this.setState({ currentPage: selected }, () => {
        this.fetchCountry(selected + 1); 
        });
      };

  startEditing = (country) => 
    {
        this.setState({
        editingCountry: country.id,
        updatedName: country.name,
        });
    };


    startAdding =() =>
        {
            this.setState({
                addingCountry:true,
                editingCountry:null,
                name:"",
            });
        };


handleChange = (e) => {
this.setState({ [e.target.name]: e.target.value });
};

addCountry = async(e) => {
    const { name} = this.state;
    
    try{
    await axios.post("https://localhost:7296/api/Country",{name});
            toast.success("Data added successfully!");
            this.setState({
                name:"",
            });

        this.fetchCountry(this.state.currentPage + 1);
    } catch (error) {
        toast.error("Error adding data!");
        console.error("Error adding Country:", error);
    }
};
updateCountry = (id) => {
const { updatedName } = this.state;
axios
  .put(`https://localhost:7296/api/Country?id=${id}`, {
    id,
    name: updatedName,
  })
  .then(() => {
    this.setState({
        editingCountry: null,
        updatedName: "",

    });
    this.fetchCountry(this.state.currentPage + 1); 
  })
  .catch((error) => {
    console.error("Error updating country:", error.message);
    toast.error(error.response?.data?.message || "Error updating country");
  });
};

deleteCountry = (id) => {
    if (!window.confirm("Are you sure you want to delete this country?")) {
        return; 
    }

    axios
        .delete(`https://localhost:7296/api/Country/${id}`)
        .then(() => {
            toast.success("Country deleted successfully!");
            this.fetchCountry(this.state.currentPage + 1); 
        })
        .catch((error) => {
            console.error("Error deleting country:", error.message);
            toast.error("Error deleting country!");
        });
};



  render()
  {
      const{countries,name,addingCountry, pageCount,editingCountry,updatedName} = this.state;
      
      return(
          <div className="container">
              <h2 className="text-center my-4">List of Countries</h2>
              
            {addingCountry && (
               <div className="col-md-4">
                    <div className="card country-card">
                        <div className="card-body">
                            <h5 className="card-title">Add New Country</h5>
                            <input type="text" className="form-control mb-2" name="name" placeholder="Name" value={name} onChange={this.handleChange} />
                            <button className="btn btn-success btn-sm me-2" onClick={this.addCountry}>Add</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ addingCountry: false })}>Cancel</button>
                        </div>
                    </div>
                    <ToastContainer position="top-right" autoClose={3000} />
                </div> 
            )}


              <div className='row'>
                  {countries.length > 0 ? (
                      countries.map((country)=>(
                          <div key={country.id} className="col-md-4">
                              <div className="card country-card">
                                  <div className="card-body">
                                      {editingCountry=== country.id ? (
                                          <>
                                              <input type="text" className="form-control mb-2" name="updatedName" value={updatedName} onChange={this.handleChange}/>
                                              
                                              <button className="btn btn-success btn-sm me-2" onClick={() => this.updateCountry(country.id)}>Save</button>
                                              <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ editingCountry: null })}>Cancel </button>
                                          </>
                                      ) : (
                                          <>
                                              <h5 className="card-title">{country.name}</h5>
                                              <button className="btn btn-primary btn-sm mt-2 me-2" onClick={() => this.startEditing(country)}>
                                                  Edit
                                              </button>
                                              <button className="btn btn-danger btn-sm mt-2" onClick={() => this.deleteCountry(country.id)}>
                                                Delete</button>
                                          </>
                                      )}
                                  </div>
                              </div>
                              <ToastContainer position="top-right" autoClose={3000} />
                          </div>
                      ))
                  ) : (
                      <p className="text-center">No country found</p>
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
                    <button className="btn btn-success mb-3" onClick={this.startAdding}>Add Country</button>
            </div>
          </div>
      );
  }
} 
export default CountryList