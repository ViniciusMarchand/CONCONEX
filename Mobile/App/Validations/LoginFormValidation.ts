interface Form {
    email: string;
    password: string;
}

const validateLogin = ({email, password} : Form) => {

    const errors: string[] = []

    if (!email) {
        errors.push("Preencha todos os campos");
        return errors;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push('E-mail inválido');
    }
    
    if (!password) {
        errors.push("Preencha todos os campos");
        return errors;
    } else if (password.length < 6) {
        errors.push('Senha deve ter no mínimo 6 caracteres');
    }

    return errors;
};

export default validateLogin;