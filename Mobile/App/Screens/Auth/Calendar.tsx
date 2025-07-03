import CustomText from "@/App/Components/Common/CustomText";
import { useGoogleAuth } from "@/App/Contexts/GoogleAuthContext";
import { View } from "react-native";
import GoogleLoginButton from "@/App/Components/Common/GoogleLoginButton";
import Events from "@/App/Components/Calendar/Events";
import { useEffect, useState } from "react";
import Layout from "@/App/Components/Common/Layout";

export default function Calendar() {

    const { token } = useGoogleAuth();

    const { login } = useGoogleAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await login();
            setIsLoading(false);
        })();
    }, []);

    if (isLoading) {
        return <Layout><CustomText>Carregando...</CustomText></Layout>
    }

    return (
        <Layout>
            {
                token ? (
                    <Events />
                ) : (
                    <>
                        <CustomText className="text-gray-400 text-center mb-5">Você pode conectar sua conta google para poder acessar as configurações de agendamento de reuniõe.</CustomText>
                        <GoogleLoginButton />
                    </>
                )

            }
        </Layout>
    )
}