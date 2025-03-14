import React, {Component} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

  class AddOwnerForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            name:'',
            gym:'',
            countryId:'',
        }
    }
    changeHandler = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    };
    submitHandler = async(e)=>{
        e.preventDefault()
        const { name, gym, countryId } = this.state; 
        try{
        axios.post('https://localhost:7296/api/Owner',{name,gym,countryId},{params:{countryId}})
        toast.success("Data added successfully!");
        this.setState({ name: "" });
        }
        catch(error)
        {
            toast.error("Error adding data!");
            console.error("Error:", error);
        }

    }

    render(){
        const{ name, gym, countryId } = this.state
        return(

            <div className="form-container">

                <form onSubmit = {this.submitHandler} className="styled-form">
                <h1>Add Owner</h1>
                    <div className="form-group">
                    <label htmlFor="name">Name:</label>
                        <input 
                        type="text" 
                        id = "name"
                        name = "name" 
                        value={name}
                        onChange = {this.changeHandler}
                        className="input-field"
                        required
                        />
                    </div>
                    <div className="form-group">
                    <label htmlFor="gym">Gym:</label>
                        <input 
                        type="text" 
                        id = "gym"
                        name = "gym" 
                        value={gym}
                        onChange = {this.changeHandler}
                        className="input-field"
                        required
                        />
                    </div>
                    <div className="form-group">
                    <label htmlFor="countryId">Country ID:</label>
                        <input 
                        type="text" 
                        id = "countryId"
                        name = "countryId" 
                        value={countryId}
                        onChange = {this.changeHandler}
                        className="input-field"
                        required
                        />
                    </div>

                    
                    <button type = "submit" className="submit-button">Submit</button>
                </form>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        )
    }
}
export default AddOwnerForm