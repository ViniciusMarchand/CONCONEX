import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Formik } from "formik";
import Title from "@/App/Components/Common/Title";
import Inputs from "@/App/Components/Common/Inputs";
import CustomButton from "@/App/Components/Common/CustomButton";
import { RouteProp, StackActions, useNavigation } from "@react-navigation/native";
import { optionsStatusSelect, ProjectFormInputs } from "@/App/Constants/Forms";
import { useEffect, useState } from "react";
import DateInput from "@/App/Components/Common/DateInput";
import SelectComponent from "@/App/Components/Common/Select";
import { FormStatus, Status } from "@/App/Constants";
import newProjectValidationSchema from "@/App/Validations/NewProjectValidation";
import projectApi from "@/App/Api/ProjectApi";
import { errorToast, successToast } from "@/App/Utils/Toasts";
import { translateError } from "@/App/Utils/ErrorTranslations";
import { useProjects } from "@/App/Contexts/ProjectsContext";
import { AuthStackParamList } from "@/App/Types/NavigatorTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import CustomText from "@/App/Components/Common/CustomText";
import { Textarea, TextareaInput } from "@/App/Components/Ui/textarea";
import TextInput from "@/App/Components/Common/InputText";
import { File } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image";
import NoImage from "../../../Assets/img/no-image.png"
import Layout from "@/App/Components/Common/Layout";


type ProjectFormRouteProp = RouteProp<
    AuthStackParamList,
    'ProjectForm'
>;

interface Props {
    route?: ProjectFormRouteProp;
    navigation?: StackNavigationProp<AuthStackParamList, 'ProjectForm'>;
}

export default function ProjectForm({ route }: Props) {

    const { findProjects } = useProjects();
    const { goBack, dispatch } = useNavigation();

    const projectToEdit = route?.params;
    const [status, setStatus] = useState(projectToEdit?.status || Status.Pending.toString());
    const [date, setDate] = useState(projectToEdit?.deadline || new Date());
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>( projectToEdit?.image ? {uri:projectToEdit?.image, height:0, width:0} : undefined);
    const [isLoading, setIsLoading] = useState(false);

    const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.Add);

    useEffect(() => {
        if (route?.params) {
            setFormStatus(FormStatus.Edit);
        } else {
            setFormStatus(FormStatus.Add);
        }
    }, []);

    const onSubmit = async (form: { title: string, description: string }) => {
        try {
            setIsLoading(true);
            const formValues = { ...form, deadline: date, status: status }
            const values = await newProjectValidationSchema.validate(formValues);

            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (key !== 'image' && key !== 'files' && value !== undefined) {
                    if (value instanceof Date) {
                        formData.append(key, value.toISOString());
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            if (image && projectToEdit?.image !== image?.uri) {
                formData.append('image', {
                uri: image.uri,
                name: image.fileName || `upload_${Date.now()}.jpg`,
                type: image.mimeType || 'image/jpeg'
                } as any);
            }

            if (formStatus === FormStatus.Add) {
                await projectApi.save(formData);
                await findProjects();
                successToast("Projeto adicionado com sucesso!");
                goBack();
            } else if (projectToEdit) {
                await projectApi.update(formData, projectToEdit.id);
                await findProjects();
                successToast("Projeto editado com sucesso!");
                dispatch(StackActions.pop(2));
            }
        } catch (error: any) {
            if (error.response?.data) {
                errorToast(translateError(error.response?.data));
            } else {
                errorToast(error.message);
            }
        }
        setIsLoading(false);
    }

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            selectionLimit: 1
        });

        if (!result.canceled) {
            setImage(result.assets[0])
        }
    };

    return (
        <Layout>
            <View className="flex-1 w-full">

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                    className="w-full"

                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', width: '100%', paddingBottom:30 }}
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
                                                {formStatus === FormStatus.Add ? "Crie" : "Edite"} um Projeto
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
                                        <DateInput onChange={(e) => setDate(e)} value={date} label="Data de entrega" />
                                        <SelectComponent label="Status" items={optionsStatusSelect} onSelect={(e) => setStatus(e.value)} value={status} />
                                    </View>
                                    <CustomButton onPress={pickImageAsync}>Inserir imagem</CustomButton>
                                      <View className="w-full h-56 flex justify-center items-center border border-tertiary dark:border-tertiary-dark rounded-[10px]">
                                        <Image
                                            source={!image ? NoImage : { uri:image.uri }}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius:8,
                                            }}
                                            contentFit="cover"
                                        />
                                    </View>
                                    <CustomButton onPress={() =>  { !isLoading  && handleSubmit() }}>
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