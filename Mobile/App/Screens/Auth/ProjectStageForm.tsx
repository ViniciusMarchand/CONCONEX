import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Formik } from "formik";
import Title from "@/App/Components/Common/Title";
import CustomButton from "@/App/Components/Common/CustomButton";
import { RouteProp, StackActions, useNavigation } from "@react-navigation/native";
import { optionsStatusSelect } from "@/App/Constants/Forms";
import { useEffect, useState } from "react";
import DateInput from "@/App/Components/Common/DateInput";
import SelectComponent from "@/App/Components/Common/Select";
import { FormStatus, Status } from "@/App/Constants";
import newProjectValidationSchema from "@/App/Validations/NewProjectValidation";
import { errorToast, successToast } from "@/App/Utils/Toasts";
import { translateError } from "@/App/Utils/ErrorTranslations";
import { useProjects } from "@/App/Contexts/ProjectsContext";
import { AuthStackParamList } from "@/App/Types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import CustomText from "@/App/Components/Common/CustomText";
import { Textarea, TextareaInput } from "@/App/Components/Ui/textarea";
import TextInput from "@/App/Components/Common/InputText";
import { File } from "lucide-react-native";
import projectStagesApi from "@/App/Api/ProjectStagesApi";
import Layout from "@/App/Components/Common/Layout";


type ProjectStageFormRouteProp = RouteProp<
    AuthStackParamList,
    'ProjectStageForm'
>;

interface Props {
    route?: ProjectStageFormRouteProp;
    navigation?: StackNavigationProp<AuthStackParamList, 'ProjectStageForm'>;
}

export default function ProjectStageForm({ route }: Props) {

    const { findProjects } = useProjects();
    const { goBack, dispatch } = useNavigation();

    const projectToEdit = route?.params;
    const [status, setStatus] = useState(projectToEdit?.status || Status.Pending.toString());
    const [date, setDate] = useState(projectToEdit?.deadline || new Date());

    const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.Add);

    useEffect(() => {
        if (route?.params?.id) {
            setFormStatus(FormStatus.Edit);
        } else {
            setFormStatus(FormStatus.Add);
        }
    }, []);

    const onSubmit = async (form: { title: string, description: string }) => {
        try {
            const formValues = { ...form, deadline: date, status: status, projectId:projectToEdit?.projectId }
            const values = await newProjectValidationSchema.validate(formValues);

            if (formStatus === FormStatus.Add) {
                await projectStagesApi.save(values);
                await findProjects();
                successToast("Etapa adicionado com sucesso!");
                goBack();
            } else if (projectToEdit && projectToEdit.id) {
                await projectStagesApi.update(values, projectToEdit.id);
                await findProjects();
                successToast("Etapa editado com sucesso!");
                // dispatch(StackActions.pop(2));
                goBack();
            }
        } catch (error: any) {
            if (error.response?.data) {
                errorToast(translateError(error.response?.data));
            } else {
                errorToast(error.message);
            }
        }
    }

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
                                title: projectToEdit?.title || "",
                                description: projectToEdit?.description || "",
                                deadline: projectToEdit?.deadline || new Date(),
                                status: projectToEdit?.status || "pending"
                            }}
                            onSubmit={onSubmit}
                        >
                            {({ handleChange, handleSubmit, initialValues }) => (
                                <View className='flex-1 justify-center w-full gap-5 px-10 mt-10'>
                                    <View className='w-full'>
                                        <View className='gap-2 my-4'>
                                            <Title className='text-start'>
                                                {formStatus === FormStatus.Add ? "Crie" : "Edite"} uma Etapa
                                            </Title>
                                        </View>
                                    </View>
                                    <View className="gap-4">
                                        <TextInput
                                            placeholder={"Título"}
                                            icon={File}
                                            onChangeText={handleChange("title")}
                                            defaultValue={initialValues.title}
                                        />
                                        <View >
                                            <CustomText className="pb-1 text-lg dark:text-gray-400">Descrição</CustomText>
                                            <Textarea>
                                                <TextareaInput
                                                    onChangeText={handleChange("description")}
                                                    defaultValue={initialValues.description}
                                                />
                                            </Textarea>
                                        </View>
                                        <DateInput onChange={(e) => setDate(e)} value={new Date(date)} label="Data de entrega" />
                                        <SelectComponent label="Status" items={optionsStatusSelect} onSelect={(e) => setStatus(e.value)} value={status} />
                                    </View>
                                    <CustomButton onPress={() => handleSubmit()}>
                                        {formStatus === FormStatus.Add ? "Criar" : "Editar"}
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