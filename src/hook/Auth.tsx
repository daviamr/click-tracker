/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode, useEffect, useState } from "react";

import { api } from "@/services/Api";
import { AxiosError } from "axios";

import { createNewCustomer, CreateNewUser, DataProps, Login } from "@/interface/auth";
import { AlertMessage } from "@/components/alert_message";

export const AuthContext = createContext({});

interface ChildrenProps {
  children?: ReactNode;
}

function AuthProvider({ children }: ChildrenProps) {

  const [data, setData] = useState<DataProps | null>(null)

  async function signIn({ email, password }: Login) {
    try {
      const response = await api.post("/auth/login", { email, password });

      const jwtToken  = response.data;
      console.log(response.data)

      localStorage.setItem("@shorturl:user", JSON.stringify(jwtToken));
      AlertMessage(response.data.message, "success");
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage("Não foi possível entrar.", "error");
      }
    }
  }

  async function handleCreateUsers({ email, password, name }: CreateNewUser) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);
      
      console.log(token)

        const response = await api.post("/users", {
        email,
        password,
        name,
      },
      { headers: {
        "Authorization": `Bearer ${token.jwtToken}`,
      },}
    );
    console.log(response.data)

      AlertMessage("Usuário criado com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar um usuário agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function handleCreateCustomers({ image, name }: createNewCustomer) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      console.log(token) //verificando se token está correto

      // Cria um objeto FormData e adiciona a imagem e o nome
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);

        const response = await api.post("/clients", formData,
      { headers: {
        "Authorization": `Bearer ${token.jwtToken}`,
        "Content-Type": "multipart/form-data"
      },}
    );
    console.log(response.data)

      AlertMessage("Cliente criado com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar o cliente, tente novamente.",
          "error"
        );
      }
    }
  }

  useEffect(() => {
    async function handleUserSession() {
      try {
        const dataUser = localStorage.getItem("@shorturl:user");

        if (dataUser) {
          const user = JSON.parse(dataUser);
          console.log(user)
          setData(user);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível iniciar a sessão, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleUserSession();
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          handleCreateUsers,
          signIn,
          handleCreateCustomers,
          data
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
