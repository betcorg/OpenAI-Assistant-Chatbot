import { createContext, useState, useContext } from "react";
import { signupRequest } from "../api/authEndpoints";

// Crea una instancia de createContext
export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Crea un proveedor de contexto para el estado de autenticación y el controlador de registro.
// El componente hijo puede utilizar el contexto para obtener los métodos y estados del proveedor. 
// El componente padre puede utilizar el contexto para proveer los métodos y estados al componente hijo.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const signupReq = async (user) => {

        try {
            const res = await signupRequest(user);
            console.log(res);
            setUser(res.data);
            setIsAuthenticated(true);
            
        } catch (error) {
            throw error;
        }
    };
    return (
        <AuthContext.Provider
            value={{
                signupReq,
                user,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
