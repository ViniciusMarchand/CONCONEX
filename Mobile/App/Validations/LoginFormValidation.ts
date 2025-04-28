import * as Yup from 'yup';

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Preencha todos os campos')
    .email('E-mail inválido'),
    
  password: Yup.string()
    .required('Preencha todos os campos')
});

export default loginValidationSchema;