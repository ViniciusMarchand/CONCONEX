import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { apiUrl } from "../Constants/Env";
import { Message } from "../Types";
import { useAuth } from "./AuthContext";

interface SignalRContextData {
  connection: HubConnection | null;
  message: Message | undefined;
  setMessage:Function;
  sendMessage: (chatId: string, content: string) => Promise<void>;
}

const SignalRContext = createContext<SignalRContextData | undefined>(undefined);

interface SignalRProviderProps {
  userId: string;
  children: ReactNode;
}

export const SignalRProvider = ({ userId, children }: SignalRProviderProps) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [message, setMessage] = useState<Message>();
  const { user } = useAuth();

  const connect = useCallback(async () => {
    if (connection && connection.state === HubConnectionState.Connected) {
      console.log("SignalR: Já conectado.");
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}/chathub`)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          const maxDelay = 60000;
          const delay = Math.min(retryContext.elapsedMilliseconds * 2, maxDelay);
          console.warn(`SignalR: Tentando reconectar em ${delay / 1000} segundos... (Tentativa ${retryContext.retryReason})`);
          return delay;
        }
      })
      .build();

    newConnection.on("ReceiveMessage", (message: Message) => {
      setMessage({ ...message, content: message.content });
    });

    newConnection.onreconnecting((error) => {
      console.warn("SignalR: Reconectando...");
    });

    newConnection.onreconnected(async (connectionId) => {
      console.log("SignalR: Reconectado com sucesso. ID da Conexão:", connectionId);
      if (userId) {
        try {
          await newConnection.invoke("RegisterUser", userId);
          console.log("SignalR: Usuário re-registrado.");
        } catch (error) {
          console.error("SignalR: Falha ao re-registrar o usuário após reconexão.", error);
        }
      }
    });

    newConnection.onclose((error) => {
      console.warn("SignalR: Conexão fechada. AutomaticReconnect tentará reconectar.", error);
    });

    try {
      await newConnection.start();
      console.log("SignalR: Conectado.");
      await newConnection.invoke("RegisterUser", userId);
      setConnection(newConnection);
    } catch (error) {
      console.error("SignalR: Falha na conexão inicial. Tentando novamente...", error);
      setTimeout(connect, 2000);
    }
  }, [userId, connection]);

  useEffect(() => {
    connect();
    return () => {
      if (connection && connection.state !== HubConnectionState.Disconnected) {
        console.log("SignalR: Parando conexão ao desmontar.");
        connection.stop();
      }
    };
  }, [connect, connection]);

  const sendMessage = useCallback(async (chatId: string, content: string) => {
    if (!connection || connection.state !== HubConnectionState.Connected) {
      console.warn("Não é possível enviar a mensagem: A conexão SignalR não está estabelecida ou conectada.");
      return;
    }
    try {
      await connection.invoke("SendMessage", chatId, content, userId);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }, [connection, userId]);

  return (
    <SignalRContext.Provider value={{ connection, message, sendMessage, setMessage }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = (): SignalRContextData => {
  const context = useContext(SignalRContext);
  if (!context) throw new Error("useSignalR deve ser usado dentro de SignalRProvider");
  return context;
};