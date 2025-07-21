import { createContext, useContext, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({
        user_id : '',
        username : '',
        email : ''
    });

    return ( 
    <AuthContext.Provider value={{ user, setUser }}>
        {children}
        </AuthContext.Provider>
    )

}

// Create a custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}