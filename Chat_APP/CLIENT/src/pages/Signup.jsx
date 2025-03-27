import { useState } from "react";
import { Link } from "react-router-dom";
import {signupUser} from "../apiCalls/auth";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";


const Signup = () => {
  const dispatch = useDispatch();
  //values must be same as in backend schema
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  //assigning entered values above
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUser (values => ({...values, [name]: value}));
  }

  //handling Form submission
  const handleSubmit = async (event) =>{
    event.preventDefault();
    let response = null;
    try {
      dispatch(showLoader());//showing the function
      response = await signupUser(user);
      dispatch(hideLoader());//hiding the function
      // console.log(response);
      if(response.success){
        toast.success(response.message);
      }else{
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoader());//hiding the function
      toast.error(response.message || error.message);
      // console.error("Signup error:", error.response?.data || error.message);
      // return error.response?.data || { message: "Something went wrong!" };
    }
  }

  return (
    <div className="container">
      <div className="heading">
        <span>Quick Chat</span>
      </div>
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card_title">
          <h1>Create Account</h1>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="column">
              <input
                type="text"
                placeholder="First Name"
                name="firstname"
                value={user.firstname}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastname"
                value={user.lastname}
                onChange={handleChange}
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
            <button>Sign Up</button>
          </form>
        </div>
        <div className="card_terms">
          <span>
            Already have an account?
            <Link to="/login">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
