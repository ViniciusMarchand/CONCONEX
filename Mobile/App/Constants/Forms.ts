import { File, LockIcon, MailIcon, PhoneIcon, User } from "lucide-react-native";
import { InputProps } from "../Types";

    export const SignUpForm: InputProps[] = [
        {
            name: 'username',
            icon: User,
            placeholder: 'Nome de usuário',
            autoCapitalize: "none",
        },
        {
            name: 'firstName',
            icon: User,
            placeholder: 'Nome',
        },
        {
            name: 'lastName',
            icon: User,
            placeholder: 'Sobrenome',
        },
        {
            name: 'phoneNumber',
            icon: PhoneIcon,
            placeholder: 'Telefone',
            autoCapitalize: 'none',
            keyboardType: "phone-pad",
            textContentType: "telephoneNumber",
            autoCorrect: false,
            maxLength: 11,
        },
        {
            name: 'email',
            icon: MailIcon,
            placeholder: 'E-mail',
            textContentType: "emailAddress",
            autoCapitalize: 'none',
            keyboardType: "email-address",

        },
        {
            name: 'password',
            icon: LockIcon,
            placeholder: 'Senha',
            secureTextEntry: true,
            autoCapitalize: 'none',
            textContentType: "password",

        },
        {
            name: 'confirmPassword',
            icon: LockIcon,
            placeholder: 'Confirme sua senha',
            secureTextEntry: true,
            autoCapitalize: 'none',
            textContentType: "password",
        }
    ];

export const ProjectFormInputs: InputProps[] =[
    {
        name:'title',
        icon: File,
        placeholder:'Título',
    },
    {
        name:'description',
        icon: File,
        placeholder:'Descrição',
        textArea: true,
    },
]

export const optionsStatusSelect = [

    {
        label: "Pendente",
        value: "Pending"
    },
    {
        label: "progresso",
        value: "InProgress"
    },
    {
        label: "Finalizado",
        value: "Completed"
    },
    {
        label: "Cancelado",
        value: "Canceld"
    },
]