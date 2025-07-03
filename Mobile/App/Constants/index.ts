export const AccessTokenKey = "accessToken";
export const GoogleAccessTokenKey = "googleAccessToken";
export const GoogleRefreshTokenKey = "googleRefreshToken";


export enum ProjectsTabOptions {
    MyServices,
    HiredProjects
}

export enum Status {
    Pending,
    InProgress,
    Completed,
    Canceld,
}

export enum FormStatus {
    Add,
    Edit
}

export const statusColor = {
    Pending:"gray-500",
    InProgress:"green-400",
    Completed:"purple-800",
    Canceld:"red-500",
}

export function stringToStatus(statusString: string): Status {
    const formattedString = statusString.replace(/\s+/g, '');
    if (Object.values(Status).includes(formattedString as any)) {
        return Status[formattedString as keyof typeof Status];
    }    
    return Status.Pending;
}


const diasDaSemanaEmInglesParaPortugues: Record<"MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY", string> = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

export function traduzirDiaDaSemana(diaEmIngles: string): string | undefined {
  return diasDaSemanaEmInglesParaPortugues[diaEmIngles.toUpperCase() as keyof typeof diasDaSemanaEmInglesParaPortugues];
}
