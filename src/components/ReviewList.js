import React, {Component,useState, useEffect} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
import "./ReviewStyle.css"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class ReviewList extends Component{
    constructor(props){
        super(props)
        this.state = {
            reviews:[],
            editingReview: null,
            addingReview: false,
            updatedTitle:"",
            updatedText:"",
            title:"",
            text:"",
            reviewerId:"",
            pokemonId:"",
            currentPage: 0,
            pageCount: 1,
            error:"",
        };
    }

    componentDidMount(){
        this.fetchReview(this.state.currentPage + 1);
    }

    fetchReview = (page) => {
        axios
          .get(`https://localhost:7296/api/Review?pageNumber=${page}&pageSize=10`)
          .then((response) => {
            console.log("API Response:", response.data);
            this.setState({
              reviews: response.data.data,
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
            this.fetchReview(selected + 1); 
            });
        };
    
        startEditing = (review) =>
        {
            this.setState({
                editingReview: review.id,
                updatedTitle: review.title,
                updatedText: review.text,
            });
        };

        startAdding = () =>
        {
            this.setState({
                addingReview:true,
                editingReview:null,
                title:"",
                text:"",
                reviewerId:"",
                pokemonId:"",
            });
        };

    handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  addReview = async(e) => 
    {
        const { title, text, reviewerId,pokemonId} = this.state;
        
        try{
        await axios.post("https://localhost:7296/api/Review",{title, text},{params:{reviewerId,pokemonId}});
                toast.success("Data added successfully!");
                this.setState({
                    title:"",
                    text:"",
                    reviewerId:"",
                    pokemonId:"",
                });

            this.fetchReview(this.state.currentPage + 1);
        } catch (error) {
            toast.error("Error adding data!");
            console.error("Error adding Review:", error);
        }
    };

updateReview = (id) => {
    const { updatedTitle,updatedText } = this.state;
    axios
      .put(`https://localhost:7296/api/Review/${id}`, {
        id: id,
        title: updatedTitle,
        text: updatedText
      })
      .then((response) => {
        console.log("Updated successfully:", response.data);
        this.setState({
            editingReview: null, // Exit editing mode
            updatedTitle: "",
            updatedText: "",

        });
        this.fetchReview(this.state.currentPage + 1); // Refresh data
      })
      .catch((error) => {
        console.error("Error updating review:", error.message);
        this.setState({ errorMsg: "Error updating review" });
      });
  };



    render()
    {
        const{reviews, errorMsg, pageCount,editingReview,updatedTitle,updatedText, addingReview, title,text,reviewerId,pokemonId} = this.state;
        
        return(
            <div className="container">
                <h2 className="text-center my-4">List of Reviews</h2>
                
                <div className='row'>
                {addingReview && (
                        <div className="col-md-4">
                            <div className="card review-card">
                                <div className="card-body">
                                    <h5 className="card-title">Add New Review</h5>
                                    <input type="text" className="form-control mb-2" name="title" placeholder="Title" value={title} onChange={this.handleChange} />
                                    <input type="text" className="form-control mb-2" name="text" placeholder="text" value={text} onChange={this.handleChange} />
                                    <input type="text" className="form-control mb-2" name="reviewerId" placeholder="Reviewer ID" value={reviewerId} onChange={this.handleChange} />
                                    <input type="text" className="form-control mb-2" name="pokemonId" placeholder="Pokemon ID" value={pokemonId} onChange={this.handleChange} />
                                    <button className="btn btn-success btn-sm me-2" onClick={this.addReview}>Add</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ addingReview: false })}>Cancel</button>
                                </div>
                            </div>
                            <ToastContainer position="top-right" autoClose={3000} />
                        </div> 
                    )}



                    {reviews.length>0?(
                        reviews.map((review)=>(
                            <div key={review.id} className="col-md-4">
                                <div className="card review-card">
                                    <div className="card-body">
                                        {editingReview=== review.id?(
                                            <>
                                                <input
                                                    type="text"
                                                    className="form-control mb-2"
                                                    name="updatedTitle"
                                                    value={updatedTitle}
                                                    onChange={this.handleChange}
                                                />
                                                <input
                                                    type="text"
                                                    className="form-control mb-2"
                                                    name="updatedText"
                                                    value={updatedText}
                                                    onChange={this.handleChange}
                                                    
                                                />
                                                <button className="btn btn-success btn-sm me-2" onClick={() => this.updateReview(review.id)}>
                                                    Save
                                                </button>
                                                <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ editingReview: null })}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <h5 className="card-title">{review.title}</h5>
                                                <h5 className="card-title">{review.text}</h5>
                                                
                                                <button className="btn btn-primary btn-sm mt-2" onClick={() => this.startEditing(review)}>
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
                        <p className="text-center">No review found</p>
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
                    <button className="btn btn-success mb-3" onClick={this.startAdding}>Add Review</button>
                </div>
            </div>
        );
    }
}
export default ReviewList