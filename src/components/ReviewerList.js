import React, {Component} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
import "./ReviewerStyle.css"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class ReviewerList extends Component{
    constructor(props){
        super(props)
        this.state = {
            reviewers:[],
            editingReviewer: null,
            addingReviewer:false,
            updatedFirstName:"",
            updatedLastName:"",
            firstName:"",
            lastName:"",
            currentPage: 0,
            pageCount: 1,
            error:"",
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

      handlePageClick = ({ selected }) => 
        {
            this.setState({ currentPage: selected }, () => {
            this.fetchReviewer(selected + 1); 
            });
        };


        startEditing = (reviewer) => 
        {
            this.setState({
            editingReviewer: reviewer.id,
            updatedLastName: reviewer.lastName,
            updatedFirstName: reviewer.firstName,
            });
        };

        startAdding = () =>
        {
            this.setState
            ({
                addingReviewer:true,
                editingReviewer:null,
                firstName:"",
                lastName:"",
            });
        };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  addReviewer = async(e) => {
    const { firstName, lastName} = this.state;
    
    try{
    await axios.post("https://localhost:7296/api/Reviewer",{firstName,lastName});
            toast.success("Data added successfully!");
            this.setState({
                firstName:"",
                lastName:"",
            });

        this.fetchReviewer(this.state.currentPage + 1);
    } catch (error) {
        toast.error("Error adding data!");
        console.error("Error adding Reviewer:", error);
    }
};

  updateReviewer = (id) => {
    const { updatedLastName,updatedFirstName } = this.state;
    axios
      .put(`https://localhost:7296/api/Reviewer/${id}`, {
        id: id,
        lastName: updatedLastName,
        firstName: updatedFirstName
      })
      .then(() => {
        this.setState({
            editingReviewer: null,
            updatedFirstName: "",
            updatedLastName: "",

        });
        this.fetchReviewer(this.state.currentPage + 1); // Refresh data
      })
      .catch((error) => {
        toast.error("Error adding data!");
        console.error("Error updating reviewer:", error);
        
      });
  };
    render()
    {
        const{reviewers, pageCount, editingReviewer, updatedFirstName, updatedLastName, addingReviewer,firstName,lastName} = this.state;
        
        return(
            <div className="container">
                <h2 className="text-center my-4">Reviewers</h2>
                
                <div className='row'>
                {addingReviewer && (
                        <div className="col-md-4">
                            <div className="card reviewer-card">
                                <div className="card-body">
                                    <h5 className="card-title">Add New Reviewer</h5>
                                    <input type="text" className="form-control mb-2" name="firstName" placeholder="First Name" value={firstName} onChange={this.handleChange} />
                                    <input type="text" className="form-control mb-2" name="lastName" placeholder="Last Name" value={lastName} onChange={this.handleChange} />
                                    <button className="btn btn-success btn-sm me-2" onClick={this.addReviewer}>Add</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ addingReviewer: false })}>Cancel</button>
                                </div>
                            </div>
                        </div> 
                    )}

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
                                <ToastContainer position="top-right" autoClose={3000} />
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No reviewer found</p>
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
                    <button className="btn btn-success mb-3" onClick={this.startAdding}>Add Reviewer</button>
                </div>
            </div>
        );
    }
} 
export default ReviewerList