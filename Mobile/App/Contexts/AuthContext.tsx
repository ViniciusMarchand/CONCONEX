import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { LoginFormValues, User } from "../Types";
import { contextError } from "../Constants/Errors";
import authApi from "../Api/AuthApi";
import { logoutAsync, setAccessToken } from "../Utils/SecureStore";

interface Props {
    children: ReactNode
}

const AuthContext = createContext<{
    user: User | undefined;
    login: Function;
    logout: Function;
}>({
    user: undefined,
    login: async () => {},
    logout: async () => {},
    
});

export default function AuthProvider({children} : Props) {

    const [user, setUser] = useState<User>();

    useEffect(() => {
        (async () => {
            try {
                const res = await authApi.userInfo();
                setUser(res.data);
            } catch (error) {

            }
        })()
    },[]);

    const login = async (loginDto:LoginFormValues) => {
        try {
            const res = await authApi.login(loginDto);
            const { user, accessToken } = res.data;
            setUser(user);
            setAccessToken(accessToken);
            
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error;
        }

    }

    const logout = async () => {
        await logoutAsync();
        setUser(undefined);
    }

    return <AuthContext.Provider value={{user, login, logout}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
      contextError("useAuth");
    }

    return context;
  };