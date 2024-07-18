import { createContext, useContext, useState, ReactNode } from "react";

interface ContextStateType {
  isFocus: string;
  setIsFocus: React.Dispatch<React.SetStateAction<string>>;
}

// Definindo o valor inicial do contexto como nulo
const initialContextValue = {
  isFocus: "user",
  setIsFocus: () => {}
};

export const ContextState = createContext<ContextStateType>(initialContextValue);

interface ChildrenProps {
  children?: ReactNode;
}

export function ContextStateProvider({ children }: ChildrenProps) {
  const [isFocus, setIsFocus] = useState<string>("user");

  return (
    <ContextState.Provider value={{ isFocus, setIsFocus }}>
      {children}
    </ContextState.Provider>
  );
}

export function useContextState() {
  return useContext(ContextState);
}