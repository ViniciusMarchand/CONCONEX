import * as Yup from 'yup';

const registrationValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Preencha todos os campos')
        .email('E-mail inválido'),

    password: Yup.string()
        .required('Preencha todos os campos')
        .min(6, 'A senha deve ter pelo menos 6 caracteres'),


    username: Yup.string()
        .required('Preencha todos os campos')
        .min(3, 'O nome de usuário deve ter pelo menos 3 caracteres'),

    firstName: Yup.string()
        .required('Preencha todos os campos'),

    lastName : Yup.string()
        .required('Preencha todos os campos'),


    phoneNumber: Yup.string()
        .required('Preencha todos os campos')
        .matches(/^\d{10,11}$/, 'Número de telefone inválido'),

    confirmPassword: Yup.string()
        .required('Preencha todos os campos')
        .oneOf([Yup.ref('password')], 'As senhas não coincidem'),

});

export default registrationValidationSchema;