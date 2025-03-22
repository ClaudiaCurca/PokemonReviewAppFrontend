import React, {Component ,useState, useEffect} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
import "./OwnerStyle.css"; 

class OwnerList extends Component{
    constructor(props){
        super(props)
        this.state = {
            owners:[],
            currentPage: 0, 
            pageCount: 1, 
            error:"",
            editingOwner:null,
            updatedName:"",
            updatedGym:"",
        };
    }
    componentDidMount(){
        this.fetchOwners(this.state.currentPage + 1);
    }

    fetchOwners = (page) => {
        axios
          .get(`https://localhost:7296/api/Owner?pageNumber=${page}&pageSize=10`)
          .then((response) => {
            console.log("API Response:", response.data);
            this.setState({
                owners: response.data.data,
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
        this.fetchOwners(selected + 1); 
        });
      };

      /*** Enable Editing Mode ***/
      startEditing = (owner) => {
        this.setState({
        editingOwner: owner.id,
        updatedName: owner.name,
        updatedGym: owner.gym,
    });
  };

  /*** Handle Input Change ***/
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /*** Handle PUT Request ***/
  updateOwner = (id) => {
    const { updatedName,updatedGym } = this.state;
    axios
      .put(`https://localhost:7296/api/Owner/${id}`, {
        id: id,
        name: updatedName,
        gym: updatedGym
      })
      .then((response) => {
        console.log("Updated successfully:", response.data);
        this.setState({
            editingOwner: null, // Exit editing mode
            updatedName: "",
            updatedGym: "",

        });
        this.fetchOwners(this.state.currentPage + 1); // Refresh data
      })
      .catch((error) => {
        console.error("Error updating owner:", error.message);
        this.setState({ errorMsg: "Error updating owner" });
      });
  };

 
  render()
  {
      const{owners, errorMsg, pageCount,editingOwner,updatedName,updatedGym} = this.state;
      
      return(
          <div className="container">
              <h2 className="text-center my-4">List of Owners</h2>
              
              <div className='row'>
                  {owners.length>0?(
                      owners.map((owner)=>(
                          <div key={owner.id} className="col-md-4">
                              <div className="card owner-card">
                                  <div className="card-body">
                                      {editingOwner=== owner.id?(
                                          <>
                                              <input
                                                  type="text"
                                                  className="form-control mb-2"
                                                  name="updatedName"
                                                  value={updatedName}
                                                  onChange={this.handleChange}
                                              />
                                              <input
                                                  type="text"
                                                  className="form-control mb-2"
                                                  name="updatedGym"
                                                  value={updatedGym}
                                                  onChange={this.handleChange}
                                                  
                                              />
                                              <button className="btn btn-success btn-sm me-2" onClick={() => this.updateOwner(owner.id)}>
                                                  Save
                                              </button>
                                              <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ editingOwner: null })}>
                                                  Cancel
                                              </button>
                                          </>
                                      ) : (
                                          <>
                                              <h5 className="card-title">{owner.name}</h5>
                                              <h5 className="card-title">{owner.gym}</h5>
                                              
                                              <button className="btn btn-primary btn-sm mt-2" onClick={() => this.startEditing(owner)}>
                                                  Edit
                                              </button>
                                          </>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <p className="text-center">No owner found</p>
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
export default OwnerList