import React, {Component} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

  class AddCountryForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            name:'',
    
        }
        
    }
    changeHandler = e =>{
        this.setState({[e.target.name]: e.target.value});
    };
    submitHandler = async(e)=>{
        e.preventDefault()
        const { name } = this.state; 
        try{
        await axios.post('https://localhost:7296/api/Country',{name});
        toast.success("Data added successfully!");
        this.setState({ name: "" });}
        catch(error){
            toast.error("Error adding data!");
            console.error("Error:", error);
        }          
       
    };

    render(){
        const{ name } = this.state
        return(

            <div className="form-container">

                <form onSubmit = {this.submitHandler} className="styled-form">
                <h1>Add Country</h1>
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
                    

                    
                    <button type = "submit" className="submit-button">Submit</button>
                </form>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        )
    }
}
export default AddCountryForm;