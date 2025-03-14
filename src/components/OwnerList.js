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
            error:''
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


 
    render(){
        const{owners, errorMsg, pageCount} = this.state;
        
        return(
            <div className="container">
                <h2 className="text-center my-4">List of Owners</h2>
                
                
                {
                    owners.length >0 ?
                    (owners.map(owner =><div key = {owner.id}><h3>{owner.id} - {owner.name} - {owner.gym}</h3></div>)) :
                    (<p>No owners found</p>)
                }
                
                {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

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
export default OwnerList