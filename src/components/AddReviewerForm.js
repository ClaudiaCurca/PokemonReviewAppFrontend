import React, {Component} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

  class addReviewerForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            firstName:'',
            lastName:''
        }
    }
    changeHandler = (e) =>{
        this.setState({[e.target.id]: e.target.value});
    };
    submitHandler = async(e)=>{
        e.preventDefault()
        const { firstName,lastName} = this.state; 
        try{
        await axios.post('https://localhost:7296/api/Reviewer',{firstName,lastName}         
        )
        toast.success("Data added successfully!");
        this.setState({ name: "" });
        }
        catch(error){
            toast.error("Error adding data!");
            console.error("Error:", error);
        }
    
    };

    render(){
        const{ firstName,lastName} = this.state
        return(

            <div className="form-container">

                <form onSubmit = {this.submitHandler} className="styled-form">
                <h1>Add Reviewer</h1>
                    <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                        <input 
                        type="text" 
                        id = "firstName"
                        name = "firstName" 
                        value={firstName}
                        onChange = {this.changeHandler}
                        className="input-field"
                        required
                        />
                    </div>
                    <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                        <input 
                        type="text" 
                        id = "lastName"
                        name = "lastName" 
                        value={lastName}
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
export default addReviewerForm