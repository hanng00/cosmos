"use client";

import * as React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@/lib/amplify";

type AuthSuccessHandler = () => Promise<void> | void;

interface AuthContextType {
  registerOnAuthSuccess: (handler: AuthSuccessHandler) => () => void;
  triggerAuthSuccess: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const handlersRef = React.useRef<Set<AuthSuccessHandler>>(new Set());

  const registerOnAuthSuccess = React.useCallback((handler: AuthSuccessHandler) => {
    handlersRef.current.add(handler);
    
    // Return cleanup function
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  const triggerAuthSuccess = React.useCallback(async () => {
    // Execute all handlers in parallel
    const handlers = Array.from(handlersRef.current);
    await Promise.allSettled(handlers.map(handler => handler()));
  }, []);

  const value = React.useMemo(() => ({
    registerOnAuthSuccess,
    triggerAuthSuccess,
  }), [registerOnAuthSuccess, triggerAuthSuccess]);

  return (
    <Authenticator.Provider>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </Authenticator.Provider>
  );
}

export function useAuthEvents() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthEvents must be used within AuthProvider");
  }
  return context;
}
