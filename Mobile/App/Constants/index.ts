export const AccessTokenKey = "accessToken";


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
