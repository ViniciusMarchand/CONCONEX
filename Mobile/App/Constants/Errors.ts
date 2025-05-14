export const contextError = (contextName:string)  => {
    throw new Error(`${contextName} deve ser usado dentro de um AuthProvider`)
}