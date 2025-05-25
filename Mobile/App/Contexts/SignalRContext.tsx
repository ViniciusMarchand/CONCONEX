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
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiUrl}/chathub`)
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveMessage", (message: Message) => {
      setMessage({ ...message, content: message.content });
    });

    newConnection.onclose(async (error) => {
      console.warn("SignalR connection closed. Attempting reconnect...");
      await tryReconnect();
    });

    newConnection.onreconnecting((error) => {
      console.warn("SignalR reconnecting...");
    });

    try {
      await newConnection.start();
      await newConnection.invoke("RegisterUser", userId);
      setConnection(newConnection);
      console.log("SignalR connected.");
    } catch (error) {
      console.error("SignalR connection failed.", error);
      setTimeout(connect, 5000); // Retry after 5 seconds
    }
  }, [userId]);

  const tryReconnect = useCallback(async () => {
    if (connection && connection.state !== HubConnectionState.Connected) {
      try {
        await connection.start();
        await connection.invoke("RegisterUser", userId);
        console.log("Reconnected to SignalR.");
      } catch (error) {
        console.warn("Reconnect attempt failed. Retrying in 5 seconds...");
        setTimeout(tryReconnect, 5000);
      }
    }
  }, [connection, userId]);

  useEffect(() => {
    connect();
    return () => {
      if (connection) connection.stop();
    };
  }, [connect]);

  const sendMessage = useCallback(async (chatId: string, content: string) => {
    if (!connection) return;
    try {
      await connection.invoke("SendMessage", chatId, content, userId);
    } catch (error) {
      console.error(error);
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