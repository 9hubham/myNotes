import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""}) 
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (credentials.password !== credentials.cpassword) {
            props.showAlert && props.showAlert("Passwords do not match", "danger");
            return;
        }
        
        try {
            const response = await fetch("http://localhost:5000/api/auth/createuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: credentials.name, 
                    email: credentials.email, 
                    password: credentials.password
                })
            });
            
            const json = await response.json();
            console.log(json);
            
            if (response.ok && json.authtoken) {
                // Save the auth token and redirect
                localStorage.setItem('token', json.authtoken); 
                navigate("/");
                props.showAlert && props.showAlert("Account created successfully", "success");
            } else {
                props.showAlert && props.showAlert(json.error || "Invalid details", "danger");
            }
        } catch (error) {
            console.error("Signup error:", error);
            props.showAlert && props.showAlert("Network error occurred", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className="container mt-2">
            <h2>Create an account to use iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name" 
                        onChange={onChange}
                        minLength={5} 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email" 
                        onChange={onChange}
                        aria-describedby="emailHelp" 
                        required
                    />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        onChange={onChange}
                        minLength={5} 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="cpassword" 
                        name="cpassword" 
                        onChange={onChange}
                        minLength={5} 
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup