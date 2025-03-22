import React, {Component,useState, useEffect} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
import "./ReviewStyle.css"; 
class ReviewList extends Component{
    constructor(props){
        super(props)
        this.state = {
            reviews:[],
            currentPage: 0,
            pageCount: 1,
            error:"",
            editingReview: null,
            updatedTitle:"",
            updatedText:"",
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


      handlePageClick = ({ selected }) => {
        this.setState({ currentPage: selected }, () => {
        this.fetchReview(selected + 1); 
    });
};
    
             /*** Enable Editing Mode ***/
            startEditing = (review) => {
            this.setState({
            editingReview: review.id,
            updatedTitle: review.title,
            updatedText: review.text,
    
        });
      };

      /*** Handle Input Change ***/
    handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };


/*** Handle PUT Request ***/
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
        const{reviews, errorMsg, pageCount,editingReview,updatedTitle,updatedText} = this.state;
        
        return(
            <div className="container">
                <h2 className="text-center my-4">List of Reviews</h2>
                
                <div className='row'>
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
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No review found</p>
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
export default ReviewList