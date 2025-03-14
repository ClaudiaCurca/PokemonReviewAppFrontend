import React, {Component ,useState, useEffect} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
class ReviewerList extends Component{
    constructor(props){
        super(props)
        this.state = {
            reviewers:[],
            currentPage: 0,
            pageCount: 1,
            error:''
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
        this.fetchReviewer(selected + 1); 
        });
      };

    render(){
        const{reviewers, errorMsg, pageCount} = this.state;
        
        return(
            <div className="container">
                <h2>List of Reviewers</h2>
                {
                    reviewers.length >0 ?
                    (reviewers.map(reviewer =><div key = {reviewer.id}><h3>{reviewer.id} - {reviewer.firstName} - {reviewer.lastName}</h3></div>)) :
                    (<p>No reviewers found</p>)
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
export default ReviewerList