import * as Yup from 'yup';

const newProjectValidationSchema = Yup.object().shape({
    title: Yup.string()
        .required('Preencha todos os campos').trim(),

    description: Yup.string().trim(),

    deadline: Yup.date()
        .required('Preencha todos os campos'),

    status: Yup.string()
        .required('Preencha todos os campos')

});

export default newProjectValidationSchema;