const errorMessages: Record<string, string> = {
    "Email unavailable.": "E-mail já cadastrado.",
    "Username unavailable.": "Nome de usuário já cadastrado.",
    "Invalid email.": "E-mail inválido.",
};

export const translateError = (errorMessage: string): string => {
    return errorMessages[errorMessage] || "Erro desconhecido.";
};