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
  deleteCampaign,
  deleteCustomer,
  deleteURL,
  editCampaign,
  editConversor,
  deleteConversor,
  editCustomer,
  editURL,
  Login,
  createNewAction,
  deleteAction,
  statusAction,
  editAction,
  createNewLink,
  createNewSingleLink,
  ApiResponse,
  statusCampaign,
} from "@/interface/auth";
import { AlertMessage } from "@/components/alert_message";

interface AuthContextType {
  handleCreateUsers: (data: CreateNewUser) => Promise<void>;
  signIn: (data: Login) => Promise<void>;
  handleCreateCustomers: (data: createNewCustomer) => Promise<void>;
  handleEditCustomer: (data: editCustomer) => Promise<void>;
  deleteCustomer: (data: deleteCustomer) => Promise<void>;
  handleCreateCampaign: (data: createNewCampaign) => Promise<void>;
  handleEditCampaign: (data: editCampaign) => Promise<void>;
  deleteCampaign: (data: deleteCampaign) => Promise<void>;
  handleCreateAction: (data: createNewAction) => Promise<void>;
  handleStatusCampaign: (data: statusCampaign) => Promise<void>;
  handleEditAction: (data: editAction) => Promise<void>;
  handleStatusAction: (data: statusAction) => Promise<void>;
  deleteAction: (data: deleteAction) => Promise<void>;
  handleCreateURL: (data: createNewURL) => Promise<void>;
  handleEditURL: (data: editURL) => Promise<void>;
  deleteURL: (data: deleteURL) => Promise<void>;
  handleCreateConversor: (data: createNewConversor) => Promise<void>;
  handleEditConversor: (data: editConversor) => Promise<void>;
  deleteConversor: (data: deleteConversor) => Promise<void>;
  handleCreateLink: (data: createNewLink) => Promise<void>;
  handleCreateSingleLink: (data: createNewSingleLink) => Promise<ApiResponse>;
  data: DataProps | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

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

  //USER
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

  async function handleEditCustomer({ id, image, name }: editCustomer) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // Cria um objeto FormData e adiciona a imagem e o nome
      const formData = new FormData();
      formData.append("name", name);

      if (image) {
        formData.append("image", image);
      }

      const response = await api.put(`/clients/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);

      AlertMessage("Cliente editado com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível editar o cliente, tente novamente.",
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
        console.log(error.response.data.message);
      } else {
        AlertMessage(
          "Não foi possível deletar o cliente, tente novamente.",
          "error"
        );
      }
    }
  }

  //CAMPAIGNS
  async function handleCreateCampaign({ name, clientId, startAt, endAt }: createNewCampaign) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);
      console.log(name, clientId, startAt, endAt)
      const response = await api.post(
        "/campaigns",
        {
          name,
          clientId,
          startAt,
          endAt,
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

  async function handleEditCampaign({ id, name, clientId, startAt, endAt }: editCampaign) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      console.log(id, name, clientId);

      const response = await api.put(
        `/campaigns/${id}`,
        {
          name,
          clientId,
          startAt,
          endAt,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Campanha editada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível editar a campanha agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function deleteCampaign({ id }: deleteCampaign) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.delete(`/campaigns/${id}`, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
        },
      });

      console.log(response.data);

      AlertMessage("Campanha deletada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
        console.log(error.response.data.message);
      } else {
        AlertMessage(
          "Não foi possível deletar a campanha, tente novamente.",
          "error"
        );
      }
    }
  }

  async function handleStatusCampaign({ id }: statusCampaign) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.put(
        `/campaigns/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Status da campanha alterado com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível mudar o status da campanha agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  //ACTIONS
  async function handleCreateAction({
    name,
    campaignId,
    customPath,
    startAt,
    endAt,
  }: createNewAction) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.post(
        "/actions",
        {
          name,
          campaignId,
          customPath,
          startAt,
          endAt,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Ação criada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar uma ação agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function handleEditAction({
    id,
    name,
    campaignId,
    startAt,
    endAt,
    customPath,
  }: editAction) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.put(
        `/actions/${id}`,
        {
          name,
          campaignId,
          startAt,
          endAt,
          customPath,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Campanha editada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível editar a campanha agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function handleStatusAction({ id }: statusAction) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.put(
        `/actions/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Status da ação alterado com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível editar a campanha agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function deleteAction({ id }: deleteAction) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.delete(`/actions/${id}`, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
        },
      });

      console.log(response.data);

      AlertMessage("Ação deletada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
        console.log(error.response.data.message);
      } else {
        AlertMessage(
          "Não foi possível deletar a Ação, tente novamente.",
          "error"
        );
      }
    }
  }

  //URL
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

  async function handleEditURL({ id, url }: editURL) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.put(
        `/base-url/${id}`,
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

      AlertMessage("URL editada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível editar a URL agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function deleteURL({ id }: deleteURL) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.delete(`/base-url/${id}`, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
        },
      });

      console.log(response.data);

      AlertMessage("URL deletada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
        console.log(error.response.data.message);
      } else {
        AlertMessage(
          "Não foi possível deletar a URL, tente novamente.",
          "error"
        );
      }
    }
  }

  //CONVERSOR
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

  async function handleEditConversor({ id, name, characters }: editConversor) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.put(
        `/alphabets/${id}`,
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

      AlertMessage("Conversor editado com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível editar o Conversor agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }
  async function deleteConversor({ id }: deleteConversor) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.delete(`/alphabets/${id}`, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
        },
      });

      console.log(response.data);

      AlertMessage("Conversor deletado com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
        console.log(error.response.data.message);
      } else {
        AlertMessage(
          "Não foi possível deletar o conversor, tente novamente.",
          "error"
        );
      }
    }
  }

  //LINK
  async function handleCreateLink({
    actionId,
    baseUrlId,
    alphabetId,
    redirectUrl,
    replace,
    sheet,
    length,
    qrCode,
  }: createNewLink) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      console.log([
        `actionId: ` + actionId,
        `baseUrlId: ` + baseUrlId,
        `alphabetId: ` + alphabetId,
        `longUrl: ` + redirectUrl,
        `replace: ` + replace,
        `sheet:` + sheet,
        `length: ` + length,
        `qrCode: ` + qrCode,
      ]);

      const formData = new FormData();
      formData.append("actionId", String(actionId));
      formData.append("baseUrlId", String(baseUrlId));
      formData.append("alphabetId", String(alphabetId));
      formData.append("redirectUrl", redirectUrl);
      formData.append("length", String(length));
      formData.append("qrCode", String(qrCode));

      if (sheet) {
        formData.append("sheet", sheet);
      }
      if (replace) {
        formData.append("replace", replace);
      }

      // Envio da requisição com FormData
      const response = await api.post("/links/multiple", formData, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

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

  async function handleCreateSingleLink({
    actionId,
    baseUrlId,
    alphabetId,
    redirectUrl,
    length,
    qrCode,
  }: createNewSingleLink): Promise<ApiResponse> {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.post(
        "/links/single",
        {
          actionId,
          baseUrlId,
          alphabetId,
          redirectUrl,
          length,
          qrCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Link criado com sucesso.", "success");
      return response.data; // Retorna a resposta da API

    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar uma campanha agora, tente novamente mais tarde.",
          "error"
        );
      }
      throw error;
    }
  }

  return (
    <>
      <AuthContext.Provider
        value={{
          handleCreateUsers,
          signIn,
          handleCreateCustomers,
          handleEditCustomer,
          deleteCustomer,
          handleCreateCampaign,
          handleEditCampaign,
          handleStatusCampaign,
          deleteCampaign,
          handleCreateAction,
          handleEditAction,
          handleStatusAction,
          deleteAction,
          handleCreateURL,
          handleEditURL,
          deleteURL,
          handleCreateConversor,
          handleEditConversor,
          deleteConversor,
          handleCreateLink,
          handleCreateSingleLink,
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
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
