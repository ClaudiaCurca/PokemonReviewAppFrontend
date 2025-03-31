import React, { Component } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./CategoryStyle.css"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      editingCategory: null, 
      addingCategory:false,
      name:"",
      updatedName: "", 
      currentPage: 0,
      pageCount: 1,
      error: "",
    };
  }

  componentDidMount() {
    this.fetchCategory(this.state.currentPage + 1);
  }

  fetchCategory = (page) => {
    axios
      .get(`https://localhost:7296/api/Category?pageNumber=${page}&pageSize=10`)
      .then((response) => {
        console.log("API Response:", response.data);
        this.setState({
          categories: response.data.data,
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
      this.fetchCategory(selected + 1);
    });
  };

  startEditing = (category) => 
    {
      this.setState
      ({
        editingCategory: category.id,
        updatedName: category.name,
      });
    };

  startAdding = () =>
    {
      this.setState
      ({
        addingCategory:true,
        editingCategory:null,
        name: "",
      });
    }


  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addCategory = async(e) => {
    const { name} = this.state;
    
    try{
    await axios.post("https://localhost:7296/api/Category",{name});
            toast.success("Data added successfully!");
            this.setState({
                name:"",
            });

        this.fetchCategory(this.state.currentPage + 1);
    } catch (error) {
        toast.error("Error adding data!");
        console.error("Error adding Category:", error);
    }
};



  updateCategory = (id) => {
    const { updatedName } = this.state;
    axios
      .put(`https://localhost:7296/api/Category/${id}`, {
        id: id,
        name: updatedName,
      })
      .then((response) => {
        console.log("Updated successfully:", response.data);
        this.setState({
          editingCategory: null, // Exit editing mode
          updatedName: "",
        });
        this.fetchCategory(this.state.currentPage + 1); // Refresh data
      })
      .catch((error) => {
        console.error("Error updating category:", error.message);
        this.setState({ errorMsg: "Error updating category" });
      });
  };

  render() {
    const { categories, errorMsg, pageCount, addingCategory, editingCategory, updatedName, name } =
      this.state;

    return (
      <div className="container">
         <h1 className="text-center my-4">Pokemon Categories</h1>
        
        <div className="row">

        {addingCategory && (
            <div className="col-md-4">
              <div className="card category-card">
                <div className="card-body">
                  <h5 className="card-title">Add New Category</h5>
                  <input type="text" className="form-control mb-2" name="name" placeholder="Name" value={name} onChange={this.handleChange} />
                  <button className="btn btn-success btn-sm me-2" onClick={this.addCategory}>Add</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ addingCategory: false })}>Cancel</button>
                </div>
              </div>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
                        
          )}

          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="col-md-4">
                <div className="card category-card">
                  <div className="card-body">
                    {editingCategory === category.id ? (
                      <>
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={updatedName}
                          onChange={this.handleChange}
                        />
                        <button className="btn btn-success btn-sm me-2" onClick={() => this.updateCategory(category.id)}>
                          Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => this.setState({ editingCategory: null })}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <h5 className="card-title">{category.name}</h5>
                        <button className="btn btn-primary btn-sm mt-2" onClick={() => this.startEditing(category)}>
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No categories found</p>
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
        <div className="add-button-container">
          <button className="btn btn-success mb-3" onClick={this.startAdding}>Add Category</button>
        </div>
      </div>
    );
  }
}

export default CategoryList;
