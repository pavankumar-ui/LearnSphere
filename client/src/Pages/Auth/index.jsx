import React, { useState,useContext,useEffect } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets/assets";
import { AuthContext } from "../../context/auth-context";
import { AppContext } from "../../context/appContext";

const AuthPage = () => {


const {signInFormData,
      setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    backend_url,
    storeTokeninLS} = useContext(AuthContext);

  const {navigate} = useContext(AppContext);

  const [authState, setAuthState] = useState("signin"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role,setRole] = useState("student");
  const [name, setName] = useState("");
  const [submitDisabled,setSubmitDisabled] = useState(true);



  const clearAuthData = ()=>{
    setEmail("");
    setPassword("");
    setName("");
  }

{/* form cleaning to avoid null or sensitive data */}
  useEffect(() => {
    if (authState === "signin") {
      // For sign in, require email and password
      setSubmitDisabled(!email || !password || email.trim() === "" || password.trim() === "");
    } else {
      // For sign up, require name, email and password
      setSubmitDisabled(
        !name || !email || !password || 
        name.trim() === "" || email.trim() === "" || password.trim() === ""
      );
    }
  }, [name, email, password, authState,clearAuthData]);



  

  const toggleAuthState = (e)=>{
     e.preventDefault();

    clearAuthData();
    setAuthState(authState === "signin" ? "signup"  : "signin");
  }

 

  const handleAuthSubmit = async (e)=>{

    e.preventDefault();


    if(authState === "signin"){
        setSignInFormData({email,password});

        const LoginResponse = await fetch(`${backend_url}/auth/Login`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({email,password}),
        });

        if(LoginResponse.ok){
          const Logindata = await LoginResponse.json();

          console.log("res from backend server",Logindata);
          storeTokeninLS(Logindata.token);

          if(Logindata.role === "student"){
            alert("Login Successfull");
            navigate("/course-list");
          }else{
            alert("Login Successfull");
            navigate("/instructor")
          }
          
        }
        else{
          alert("Invalid Credentials");
          clearAuthData();
        }

    }else
    {
      try
      {
        setSignUpFormData({name,email,password,role});
        const Regresponse = await fetch(`${backend_url}/auth/Register`,{
        method:"POST",
         headers:{
          "Content-Type":"application/json"
         },
         body:JSON.stringify({name,email,password,role}),
        });

       if(Regresponse.ok){
        clearAuthData();
        alert("User Registered Successfully");
         setAuthState("signin");
      }
       if(Regresponse.status === 400){
        alert("User already exists");
        clearAuthData(); 
      }

    }
      catch(error){
        console.log("register",error);
      }
    }   
  }



  useEffect(() => {
    if (authState === "signin") {
        navigate("/auth");  // Navigate after the state change
    }   
}, [authState, navigate]);

  console.log('signin form data',signInFormData);
  //console.log('signup form data',signUpFormData);


  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <img src={assets.logo} alt="learn-logo" className="w-10 h-10 mr-4" />
          <span className="font-semibold text-xl bg-gradient-to-r from-stone-950 via-gray-450 to-black-200 text-transparent bg-clip-text">
            LearnSphere
          </span>
        </Link>
      </header>

      {/* Login and signup component  */}

      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          {/* Fixed height and min-height to maintain consistent card size */}
          <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg min-h-[500px] flex flex-col">
            <div className="flex flex-col items-center justify-center">
              <img src={assets.logo} alt="logo" className=" w-10 h-10 mb-4" />
            </div>

            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
              {authState === "signin" ? "Welcome back to " : "Let's Get Started to "} 
              <span className="font-bold">LearnSphere</span>
            </h2>

            <form 
            className="space-y-4 flex-grow">
              {/* Name Input */}
              {authState === "signup" && (
                <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700">Select Role You want to be?</label>
                      <select id="role"
                       name="role"
                       value={role}
                       onChange={(e)=>setRole(e.target.value)}
                       className="w-full px-4 py-2 mt-1 text-gray-900 
                      bg-gray-100 border border-gray-300 rounded-md 
                        focus:ring-blue-500 focus:border-blue-500">
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                      </select>
                  </div>
                  </>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your email Id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="****************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    👁️
                  </button>
                </div>
              </div>

              {/* Add empty div to maintain spacing when name field is not shown */}
              {authState === "signin" && <div className="py-2"></div>}

              {/* Submit Button */}

              <button
              disabled={submitDisabled}
                type="submit"
                onClick={(e)=>handleAuthSubmit(e)}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                {authState === "signin" ? "Sign In" : "Sign Up"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-500 text-sm">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Toggle between Sign In and Sign Up */}
            <div className="flex flex-col space-y-2">
              <button 
                className="w-full flex items-center justify-center px-4 py-2 text-white-800 bg-sky-400 border border-gray-300 rounded-md hover:bg-cyan-600"
                onClick={(e)=>{toggleAuthState(e)}}
              >
                <img 
                  src={assets.email_icon}
                  className="w-5 h-5 mr-2" 
                  alt="email-icon"
                />
                {authState === "signin" ? "Sign up with Email" : "Sign in with Email"}
              </button>

              <button className="w-full flex items-center justify-center px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                <img
                  src={assets.google_icon}
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign up with Google
            </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
