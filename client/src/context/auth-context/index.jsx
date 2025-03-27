import { createContext,useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext();

const  AuthProvider = ({children})=>  {


    const [signInFormData,setSignInFormData] = useState("");
    const [signUpFormData,setSignUpFormData] = useState("");
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [token,setToken] = useState(sessionStorage.getItem("token"));
    const [user,setUser] =useState("" || null);


    
    

    const Authnavigate = useNavigate();

    let isLoggedIn = !!token;

    console.log('isLoggedin',isLoggedIn);

    
    

    const storeTokeninLS = (serverToken)=>{
     sessionStorage.setItem("token",serverToken);
        setToken(serverToken);
    }


//JWT AUTHENTICATION MANAGEMENT TO FETCH OR DISPLAY USER DATA WHEN LOGGEDIN//

const userAuthentication = async  ()=>{

    if(!token) return Authnavigate("/auth");

    try{

          const userAuthResponse = await fetch(`${backend_url}/auth/profile`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`,
            },
          });

          if(userAuthResponse.ok){
            const Authdata = await userAuthResponse.json(); 
            console.log("User Auth Data",Authdata.user);
            setUser(Authdata.user);
          }else{

            console.error("Authentication failed:", userAuthResponse.status);
            if (userAuthResponse.ok === false) {
                // Token might be invalid or expired
                LogoutUser();
            }
          }
    }catch(error){
            console.error("error fetching user data",error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                console.error("Network error: Please check your connection or if the backend server is running");
            }
    
        }
}



useEffect(() => {
    if (token) {
        userAuthentication();
    }
}, [token]);

    
    const  LogoutUser = ()=>{
        console.log("Logging out...");
        sessionStorage.removeItem("token");  
        setToken(null);
        setUser(null);
      }

useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    setToken(storedToken);
  }, []);




    return (
        <AuthContext.Provider value={{signInFormData,
                                     setSignInFormData,
                                     signUpFormData,
                                     setSignUpFormData,
                                     backend_url,
                                     storeTokeninLS,
                                     Authnavigate,
                                     LogoutUser,
                                     isLoggedIn,
                                     user,
                                                                         
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;