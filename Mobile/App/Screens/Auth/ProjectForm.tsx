import { Button, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Layout from "../NoAuth/Layout";
import { Formik } from "formik";
import Title from "@/App/Components/Common/Title";
import Inputs from "@/App/Components/Common/Inputs";
import CustomButton from "@/App/Components/Common/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { optionsStatusSelect, ProjectFormInputs } from "@/App/Constants/Forms";
import { useState } from "react";
import DateInput from "@/App/Components/Common/DateInput";
import SelectComponent from "@/App/Components/Common/Select";
import { Status } from "@/App/Constants";
import newProjectValidationSchema from "@/App/Validations/NewProjectValidation";
import projectApi from "@/App/Api/ProjectApi";
import { errorToast } from "@/App/Utils/Toasts";
import { translateError } from "@/App/Utils/ErrorTranslations";

export default function ProjectForm() {

    const [date, setDate] = useState(new Date());
    const [status, setStatus] = useState(Status.Pending.toString());

    const onSubmit = async (form: { title: string, description: string }) => {
        try {
            const formValues = { ...form, deadline: date, status: status }
            const values = await newProjectValidationSchema.validate(formValues);
            await projectApi.save(values);
            goBack();
        } catch (error: any) {
            if(error?.message)
                errorToast(error.message);
        }
    }

    const { goBack } = useNavigation();

    return (
        <Layout>
            <View className="flex-1 w-full">

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                    className="w-full"

                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', width: '100%' }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Formik
                            initialValues={{
                                title: "",
                                description: "",
                            }}
                            onSubmit={onSubmit}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values }) => (
                                <View className='flex-1 justify-center w-full gap-5 px-10 mt-10'>
                                    <View className='w-full'>
                                        <View className='gap-2 my-4'>
                                            <Title className='text-start'>Crie um Projeto</Title>
                                        </View>
                                    </View>
                                    <View className="gap-4">
                                        <Inputs handleChange={handleChange} InputsInfo={ProjectFormInputs} />
                                        <DateInput onChange={(e) => setDate(e)} value={date} label="Data de entrega" />
                                        <SelectComponent label="Status" items={optionsStatusSelect} onSelect={() => { }} />
                                    </View>
                                    <CustomButton onPress={() => handleSubmit()}>
                                        Criar
                                    </CustomButton>
                                    <CustomButton className="bg-red-500 dark:bg-red-500" onPress={() => goBack()}>
                                        Cancelar
                                    </CustomButton>
                                </View>
                            )}
                        </Formik>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Layout>
    )
}