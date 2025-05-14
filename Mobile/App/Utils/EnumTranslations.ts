import { Status } from "../Constants";

const status: Record<string | Status, string> = {
    "Pending": "Pendente",
    [Status.Pending]: "Pendente",
    "InProgress": "Em progresso",
    [Status.InProgress]: "Em progresso",
    "Completed": "Finalizado",
    [Status.Completed]: "Finalizado",
    "Canceld":"Cancelado",
    [Status.Canceld]: "Cancelado",
};



export const translateStauts = (statusValue: string | Status): string => {
    return status[statusValue] || "Erro desconhecido.";
};

