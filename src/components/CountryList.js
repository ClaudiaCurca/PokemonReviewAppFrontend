import React, {Component} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
import "./CountryStyle.css"; 

class CountryList extends Component{
    constructor(props){
        super(props)
        this.state = {
            countries:[],
            currentPage: 0,
            pageCount: 1,
            error: "",
            editingCountry: null, 
            updatedName: "", 
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
        this.fetchCountry(selected + 1); 
        });
      };

  /*** Enable Editing Mode ***/
  startEditing = (country) => {
    this.setState({
    editingCountry: country.id,
    updatedName: country.name,
});
};

/*** Handle Input Change ***/
handleChange = (event) => {
this.setState({ [event.target.name]: event.target.value });
};

/*** Handle PUT Request ***/
updateCountry = (id) => {
const { updatedName } = this.state;
axios
  .put(`https://localhost:7296/api/Country/${id}`, {
    id: id,
    name: updatedName
  })
  .then((response) => {
    console.log("Updated successfully:", response.data);
    this.setState({
        editingCountry: null, // Exit editing mode
        updatedName: "",

    });
    this.fetchCountry(this.state.currentPage + 1); // Refresh data
  })
  .catch((error) => {
    console.error("Error updating country:", error.message);
    this.setState({ errorMsg: "Error updating country" });
  });
};



  render()
  {
      const{countries, errorMsg, pageCount,editingCountry,updatedName} = this.state;
      
      return(
          <div className="container">
              <h2 className="text-center my-4">List of Countries</h2>
              
              <div className='row'>
                  {countries.length>0?(
                      countries.map((country)=>(
                          <div key={country.id} className="col-md-4">
                              <div className="card country-card">
                                  <div className="card-body">
                                      {editingCountry=== country.id?(
                                          <>
                                              <input
                                                  type="text"
                                                  className="form-control mb-2"
                                                  name="updatedName"
                                                  value={updatedName}
                                                  onChange={this.handleChange}
                                              />
                                              
                                              <button className="btn btn-success btn-sm me-2" onClick={() => this.updateCountry(country.id)}>
                                                  Save
                                              </button>
                                              <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ editingCountry: null })}>
                                                  Cancel
                                              </button>
                                          </>
                                      ) : (
                                          <>
                                              <h5 className="card-title">{country.name}</h5>
                  
                                              
                                              <button className="btn btn-primary btn-sm mt-2" onClick={() => this.startEditing(country)}>
                                                  Edit
                                              </button>
                                          </>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <p className="text-center">No country found</p>
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
export default CountryList