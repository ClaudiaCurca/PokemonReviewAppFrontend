import React, {Component ,useState, useEffect} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
import "./ReviewerStyle.css"; 
class ReviewerList extends Component{
    constructor(props){
        super(props)
        this.state = {
            reviewers:[],
            currentPage: 0,
            pageCount: 1,
            error:"",
            editingReviewer: null,
            updatedFirstName:"",
            updatedLastName:"",
        };
    }
    componentDidMount(){
        this.fetchReviewer(this.state.currentPage + 1);
    }

    fetchReviewer = (page) => {
        axios
          .get(`https://localhost:7296/api/Reviewer?pageNumber=${page}&pageSize=10`)
          .then((response) => {
            console.log("API Response:", response.data);
            this.setState({
              reviewers: response.data.data,
              pageCount: response.data.totalPages || 1, 
            });
          })
          .catch((error) => {
            console.error("Error fetching data:", error.message);
            this.setState({ errorMsg: "Error retrieving data" });
          });
      };
      handlePageClick = ({ selected }) => {
        this.setState({ currentPage: selected }, () => {
        this.fetchReviewer(selected + 1); 
        });
      };

      /*** Enable Editing Mode ***/
        startEditing = (reviewer) => {
        this.setState({
        editingReviewer: reviewer.id,
        updatedLastName: reviewer.lastName,
        updatedFirstName: reviewer.firstName,
    });
  };

  /*** Handle Input Change ***/
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /*** Handle PUT Request ***/
  updateReviewer = (id) => {
    const { updatedLastName,updatedFirstName } = this.state;
    axios
      .put(`https://localhost:7296/api/Reviewer/${id}`, {
        id: id,
        lastName: updatedLastName,
        firstName: updatedFirstName
      })
      .then((response) => {
        console.log("Updated successfully:", response.data);
        this.setState({
            editingReviewer: null, // Exit editing mode
            updatedFirstName: "",
            updatedLastName: "",

        });
        this.fetchReviewer(this.state.currentPage + 1); // Refresh data
      })
      .catch((error) => {
        console.error("Error updating category:", error.message);
        this.setState({ errorMsg: "Error updating category" });
      });
  };
    render()
    {
        const{reviewers, errorMsg, pageCount,editingReviewer,updatedFirstName,updatedLastName} = this.state;
        
        return(
            <div className="container">
                <h2 className="text-center my-4">List of Reviewers</h2>
                
                <div className='row'>
                    {reviewers.length>0?(
                        reviewers.map((reviewer)=>(
                            <div key={reviewer.id} className="col-md-4">
                                <div className="card reviewer-card">
                                    <div className="card-body">
                                        {editingReviewer=== reviewer.id?(
                                            <>
                                                <input
                                                    type="text"
                                                    className="form-control mb-2"
                                                    name="updatedFirstName"
                                                    value={updatedFirstName}
                                                    onChange={this.handleChange}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-control mb-2"
                                                    name="updatedLastName"
                                                    value={updatedLastName}
                                                    onChange={this.handleChange}
                                                    
                                                />
                                                <button className="btn btn-success btn-sm me-2" onClick={() => this.updateReviewer(reviewer.id)}>
                                                    Save
                                                </button>
                                                <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ editingReviewer: null })}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <h5 className="card-title">{reviewer.firstName}</h5>
                                                <h5 className="card-title">{reviewer.lastName}</h5>
                                                
                                                <button className="btn btn-primary btn-sm mt-2" onClick={() => this.startEditing(reviewer)}>
                                                    Edit
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No reviewer found</p>
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
export default ReviewerList