import React, {Component} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

  class AddPokemonForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            name:'',
            ownerId:'',
            categoryId:''
        }
    }
    changeHandler = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    };
    submitHandler = async(e)=>{
        e.preventDefault()
        const { name, ownerId, categoryId } = this.state; 
        try{
        await axios.post('https://localhost:7296/api/Pokemon',{name,ownerId,categoryId},{params:{ownerId,categoryId}})
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
        const{ name, ownerId, categoryId } = this.state
        return(

            <div className="form-container">

                <form onSubmit = {this.submitHandler} className="styled-form">
                <h1>Add Pokemon</h1>
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
                    <label htmlFor="ownerId">Owner ID:</label>
                        <input 
                        type="text" 
                        id = "ownerId"
                        name = "ownerId" 
                        value={ownerId}
                        onChange = {this.changeHandler}
                        className="input-field"
                        required
                        />
                    </div>
                    <div className="form-group">
                    <label htmlFor="categoryId">Category ID:</label>
                        <input 
                        type="text" 
                        id = "categoryId"
                        name = "categoryId" 
                        value={categoryId}
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
export default AddPokemonForm;