import React, {Component ,useState, useEffect} from 'react'
import axios from'axios'
import ReactPaginate from "react-paginate";
class CountryList extends Component{
    constructor(props){
        super(props)
        this.state = {
            countries:[],
            currentPage: 0,
            pageCount: 1,
            error:''
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



    render(){
        const{countries, errorMsg, pageCount} = this.state;
        
        return(
            <div class="container">
                <h2>List of Countries</h2>
                {
                    
                    countries.length >0 ?
                    (countries.map(country =><div key = {country.id} ><h3>{country.id} - {country.name} </h3></div>)) :
                    (<p>No owners found</p>)
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
export default CountryList