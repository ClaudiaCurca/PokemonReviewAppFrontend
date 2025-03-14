import React, {Component} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

  class addReviewForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            title:'',
            descriptionText:'',
            reviewerId:'',
            pokemonId:''
    
        }
    }
    changeHandler = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    };
    submitHandler = async(e)=>{
        e.preventDefault()
        const { title,descriptionText, reviewerId,pokemonId } = this.state; 

        try{
        await axios.post('https://localhost:7296/api/Review',{title,text:descriptionText,reviewerId,pokemonId},{params:{reviewerId,pokemonId}}
        )
        toast.success("Data added successfully!");
        this.setState({ name: "" });
    }
    catch(error){
        toast.error("Error adding data!");
        console.error("Error:", error);
    }
        
       
    }

    render(){
        const{ title,descriptionText,reviewerId,pokemonId  } = this.state
        return(

            <div className="form-container">

                <form onSubmit = {this.submitHandler} className="styled-form">
                <h1>Add Review</h1>
                    <div className="form-group">
                    <label htmlFor="title">Title:</label>
                        <input 
                        type="text" 
                        id = "title"
                        name = "title" 
                        value={title}
                        onChange = {this.changeHandler}
                        className="input-field"
                        required
                        />
                    </div>
                    <div className="form-group">
                    <label htmlFor="descriptionText">Description:</label>
                        <input 
                        type="text" 
                        id = "descriptionText"
                        name = "descriptionText" 
                        value={descriptionText}
                        onChange = {this.changeHandler}
                        className="input-field"
                        required
                        />
                    </div>
                    <div className="form-group">
                    <label htmlFor="reviewerId">Reviewer ID:</label>
                        <input 
                        type="text" 
                        id = "reviewerId"
                        name = "reviewerId" 
                        value={reviewerId}
                        onChange = {this.changeHandler}
                        className="input-field"
                        required
                        />
                    </div>
                    <div className="form-group">
                    <label htmlFor="pokemonId">Pokemon ID:</label>
                        <input 
                        type="text" 
                        id = "pokemonId"
                        name = "pokemonId" 
                        value={pokemonId}
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
export default addReviewForm