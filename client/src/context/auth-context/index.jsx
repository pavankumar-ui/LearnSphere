import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [signInFormData, setSignInFormData] = useState("");
    const [signUpFormData, setSignUpFormData] = useState("");
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const [user, setUser] = useState("" || null);
    const Authnavigate = useNavigate();

    let isLoggedIn = !!token;
    //console.log('isLoggedin',isLoggedIn);


    const storeTokeninLS = (serverToken) => {
        sessionStorage.setItem("token", serverToken);
        setToken(serverToken);
    }


    //JWT AUTHENTICATION MANAGEMENT TO FETCH OR DISPLAY USER DATA WHEN LOGGEDIN//

    const userAuthentication = async () => {
        if (!token) return Authnavigate("/auth");
        try {
            const userAuthResponse = await fetch(`${backend_url}/auth/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (userAuthResponse.ok) {
                const Authdata = await userAuthResponse.json();
                setUser(Authdata.user);
            } else {
                console.error("Authentication failed:", userAuthResponse.status);
                if (userAuthResponse.ok === false) {
                    // Token might be invalid or expired
                    LogoutUser();
                }
            }
        } catch (error) {
            console.error("error fetching user data", error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch' || error.name === 'Network error') {
                Authnavigate("/auth");
                console.error("Network error: Please check your connection or if the backend server is running");
            }

        }
    }



    useEffect(() => {
        if (token) {
            userAuthentication();
        }
    }, [token]);


    const LogoutUser = () => {
        sessionStorage.removeItem("token");
        toast.success("Logout Successfully");
        setToken(null);
        setUser(null);
    }

    useEffect(() => {
        const storedToken = sessionStorage.getItem("token");
        setToken(storedToken);
    }, []);




    return (
        <AuthContext.Provider value={{
            signInFormData,
            setSignInFormData,
            signUpFormData,
            setSignUpFormData,
            backend_url,
            storeTokeninLS,
            Authnavigate,
            LogoutUser,
            isLoggedIn,
            user,
            token,
            setToken,

        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;