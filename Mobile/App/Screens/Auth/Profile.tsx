import { logoutAsync } from "@/App/Utils/SecureStore";
import { Button } from "react-native";
import Layout from "../NoAuth/Layout";
import { useAuth } from "@/App/Contexts/AuthContext";

export default function Profile() {
    
    const { logout } = useAuth();

    return (
        <Layout>
            <Button title="Deslogar" onPress={async () => await logout()}/>
        </Layout>
    )
}