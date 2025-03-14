import React, {Component,useState, useEffect} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
class ReviewList extends Component{
    constructor(props){
        super(props)
        this.state = {
            reviews:[],
            currentPage: 0,
            pageCount: 1,
            error:''
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
        this.fetchReview(selected + 1); 
        });
      };
    render(){
        const{reviews, errorMsg, pageCount} = this.state;
        
        return(
            <div className="container">
                <h2>List of Reviews</h2>
                {
                    reviews.length >0 ?
                    (reviews.map(review =><div key = {review.id}><h3>{review.id} - {review.title} - {review.text}</h3></div>)) :
                    (<p>No reviews found</p>)
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
export default ReviewList