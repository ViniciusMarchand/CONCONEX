import * as Yup from 'yup';

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Preencha todos os campos')
    .email('E-mail inválido').trim(),
    
  password: Yup.string()
    .required('Preencha todos os campos').trim()
});

export default loginValidationSchema;