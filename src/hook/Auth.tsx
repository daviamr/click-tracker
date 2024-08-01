/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { api } from "@/services/Api";
import { AxiosError } from "axios";

import {
  createNewCampaign,
  createNewConversor,
  createNewCustomer,
  createNewURL,
  CreateNewUser,
  DataProps,
  deleteCustomer,
  Login,
} from "@/interface/auth";
import { AlertMessage } from "@/components/alert_message";

interface AuthContextType {
  handleCreateUsers: (data: CreateNewUser) => Promise<void>;
  signIn: (data: Login) => Promise<void>;
  handleCreateCustomers: (data: createNewCustomer) => Promise<void>;
  deleteCustomer: (data: deleteCustomer) => Promise<void>;
  handleCreateCampaign: (data: createNewCampaign) => Promise<void>;
  handleCreateURL: (data: createNewURL) => Promise<void>;
  handleCreateConversor: (data: createNewConversor) => Promise<void>;
  data: DataProps | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ChildrenProps {
  children?: ReactNode;
}

function AuthProvider({ children }: ChildrenProps) {
  const [data, setData] = useState<DataProps | null>(null);

  async function signIn({ email, password }: Login) {
    try {
      const response = await api.post("/auth/login", { email, password });

      const jwtToken = response.data;
      console.log(response.data);

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

  useEffect(() => {
    async function handleUserSession() {
      try {
        const dataUser = localStorage.getItem("@shorturl:user");

        if (dataUser) {
          const user = JSON.parse(dataUser);
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

  async function handleCreateUsers({ email, password, name }: CreateNewUser) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.post(
        "/users",
        {
          email,
          password,
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

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

  //CUSTOMERS
  async function handleCreateCustomers({ image, name }: createNewCustomer) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      // Cria um objeto FormData e adiciona a imagem e o nome
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);

      const response = await api.post("/clients", formData, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);

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

  async function deleteCustomer({ id }: deleteCustomer) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.delete(`/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
        },
      });

      console.log(response.data);

      AlertMessage("Cliente deletado com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
        console.log(error.response.data.message)
      } else {
        AlertMessage(
          "Não foi possível deletar o cliente, tente novamente.",
          "error"
        );
      }
    }
  }

  //CAMPAIGNS
  async function handleCreateCampaign({ name, clientId }: createNewCampaign) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.post(
        "/campaigns",
        {
          name,
          clientId,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Campanha criada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar uma campanha agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function handleCreateURL({ url }: createNewURL) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.post(
        "/base-url",
        {
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("URL criada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar uma URL agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function handleCreateConversor({
    name,
    characters,
  }: createNewConversor) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.post(
        "/alphabets",
        {
          name,
          characters,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Conversor criado com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar um Conversor agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          handleCreateUsers,
          signIn,
          handleCreateCustomers,
          deleteCustomer,
          handleCreateCampaign,
          handleCreateURL,
          handleCreateConversor,
          data,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context;
}

export { AuthProvider, useAuth };
