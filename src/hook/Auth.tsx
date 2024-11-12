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
import fileDownload from "js-file-download";
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
  createTrackerA,
  statusCampaign,
  createLP,
  deleteLp,
  createBase,
  EditNewUser,
  deleteUser,
  editBase,
  deleteBase,
  createFinalURL,
  editLP,
  editFinalURL,
  deleteFinalUrl,
  createTrackerB,
  createTrackerC,
} from "@/interface/auth";
import { AlertMessage } from "@/components/alert_message";

interface AuthContextType {
  handleCreateUsers: (data: CreateNewUser) => Promise<void>;
  handleEditUser: (data: EditNewUser) => Promise<void>;
  deleteUser: (data: deleteUser) => Promise<void>;
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
  handleTrackerA: (data: createTrackerA) => Promise<void>;
  handleTrackerB: (data: createTrackerB) => Promise<void>;
  handleTrackerC: (data: createTrackerC) => Promise<void>;
  handleCreateLP: (data: createLP) => Promise<void>;
  handleEditLP: (data: editLP) => Promise<void>;
  deleteLp: (data: deleteLp) => Promise<void>;
  handleCreateBase: (data: createBase) => Promise<void>;
  handleEditBase: (data: editBase) => Promise<void>;
  deleteBase: (data: deleteBase) => Promise<void>;
  handleCreateFinalURL: (data: createFinalURL) => Promise<void>;
  handleEditFinalUrl: (data: editFinalURL) => Promise<void>;
  deleteFinalUrl: (data: deleteFinalUrl) => Promise<void>;
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

  async function handleEditUser({ id, email, password, name }: EditNewUser) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      console.log(id, email, password, name);

      const response = await api.put(
        `/users/${id}`,
        {
          id,
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

      AlertMessage("Usuário editado com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível editar o usuário agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function deleteUser({ id }: deleteUser) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
        },
      });

      console.log(response.data);

      AlertMessage(response.data.messsage, "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível deletar o usuário, tente novamente.",
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

      AlertMessage(response.data.message, "success");
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
  async function handleCreateCampaign({
    name,
    clientId,
    category,
    subCategory,
    payout,
    model,
    type,
    startAt,
    endAt,
    obs,
  }: createNewCampaign) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);
      const response = await api.post(
        "/campaigns",
        {
          name,
          clientId,
          category,
          subCategory,
          payout,
          model,
          type,
          startAt,
          endAt,
          obs,
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

  async function handleEditCampaign({
    id,
    name,
    category,
    subCategory,
    payout,
    model,
    type,
    startAt,
    endAt,
    obs,
  }: editCampaign) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.put(
        `/campaigns/${id}`,
        {
          name,
          category,
          subCategory,
          payout,
          model,
          type,
          startAt,
          endAt,
          obs,
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
    startAt,
    endAt,
    utm,
    cost,
    landingPageId,
    key,
    media,
  }: createNewAction) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.post(
        "/actions/",
        {
          name,
          campaignId,
          startAt,
          endAt,
          utm,
          cost,
          landingPageId,
          key,
          media
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
        AlertMessage(error.message, "error");
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
    utm,
    cost,
    landingPageId,
    key,
    media
  }: editAction) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      console.log({
        name: name,
        campaignId: campaignId,
        startAt: startAt,
        endAt: endAt,
        utm: utm,
        cost: cost,
        landingPageId: landingPageId,
        key: key,
        media: media
      });

      const response = await api.put(
        `/actions/${id}`,
        {
          name,
          campaignId,
          startAt,
          endAt,
          utm,
          cost,
          landingPageId,
          key,
          media
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log("response:", response);
      AlertMessage("Ação editada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
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

  //TRACKER
  async function handleTrackerA({
    actionId,
    baseUrlId,
    alphabetId,
    sheet,
    length,
    qrCode,
    finalUrlId,
    dataSourceId,
    tag,
    tagPosition,
    lpId,
  }: createTrackerA) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      console.log([
        {
          actionId: actionId,
          baseUrlId: baseUrlId,
          alphabetId: alphabetId,
          sheet: sheet,
          length: length,
          qrCode: qrCode,
          finalUrlId: finalUrlId,
          dataSourceId: dataSourceId,
          lpId: lpId,
        },
      ]);

      const formData = new FormData();
      formData.append("actionId", String(actionId));
      formData.append("baseUrlId", String(baseUrlId));
      formData.append("alphabetId", String(alphabetId));
      formData.append("length", String(length));
      formData.append("qrCode", String(qrCode));
      formData.append("finalUrlId", String(finalUrlId));
      formData.append("dataSourceId", String(dataSourceId));
      formData.append("lpId", String(lpId));

      if (sheet) {
        formData.append("sheet", sheet);
      }
      if (tag) {
        formData.append("tag", String(tag));
      } else {
        console.log("tag Desativada");
      }
      if (tagPosition) {
        formData.append("tagPosition", String(tagPosition));
      } else {
        console.log("tagPosition Desativada");
      }

      // Envio da requisição com FormData
      const response = await api.post("/links/a", formData, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      console.log(response.data);
      fileDownload(response.data, `atualizada_${sheet?.name}`);

      AlertMessage(response.data.message, "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar a planilha agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function handleTrackerB({
    actionId,
    baseUrlId,
    alphabetId,
    length,
    qrCode,
    finalUrlId,
    tag,
    tagPosition,
    lpId,
  }: createTrackerB) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      console.log([
        {
          actionId: actionId,
          baseUrlId: baseUrlId,
          alphabetId: alphabetId,
          length: length,
          qrCode: qrCode,
          finalUrlId: finalUrlId,
          lpId: lpId,
        },
      ]);

      const formData = new FormData();
      formData.append("actionId", String(actionId));
      formData.append("baseUrlId", String(baseUrlId));
      formData.append("alphabetId", String(alphabetId));
      formData.append("length", String(length));
      formData.append("qrCode", String(qrCode));
      formData.append("finalUrlId", String(finalUrlId));
      formData.append("lpId", String(lpId));

      if (tag) {
        formData.append("tag", String(tag));
      } else {
        console.log("tag Desativada");
      }
      if (tagPosition) {
        formData.append("tagPosition", String(tagPosition));
      } else {
        console.log("tagPosition Desativada");
      }

      // Envio da requisição com FormData
      const response = await api.post("/links/b", formData, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      console.log(response.data);
      fileDownload(response.data, `planilha_dados`);

      AlertMessage(response.data.message, "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar a planilha agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function handleTrackerC({
    actionId,
    alphabetId,
    url,
    replace,
    sheet,
    length,
    qrCode,
    dataSourceId,
    tag,
    tagPosition,
  }: createTrackerC) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      console.log([
        {
          actionId: actionId,
          alphabetId: alphabetId,
          url: url,
          replace: replace,
          sheet: sheet,
          length: length,
          qrCode: qrCode,
          tag: tag,
          tagPosition: tagPosition,
          dataSourceId: dataSourceId,
        },
      ]);

      const formData = new FormData();
      formData.append("actionId", String(actionId));
      formData.append("alphabetId", String(alphabetId));
      formData.append("url", String(url));
      formData.append("replace", String(replace));
      formData.append("length", String(length));
      formData.append("qrCode", String(qrCode));
      formData.append("dataSourceId", String(dataSourceId));

      if (sheet) {
        formData.append("sheet", sheet);
      }
      if (tag) {
        formData.append("tag", String(tag));
      } else {
        console.log("tag Desativada");
      }
      if (tagPosition) {
        formData.append("tagPosition", String(tagPosition));
      } else {
        console.log("tagPosition Desativada");
      }

      // Envio da requisição com FormData
      const response = await api.post("/links/c", formData, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      console.log(response.data);
      fileDownload(response.data, `atualizada_${sheet?.name}`);

      AlertMessage(response.data.message, "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar a planilha agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  //LP
  async function handleCreateLP({ name, campaignId, url }: createLP) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.post(
        "/lps/",
        {
          name,
          campaignId,
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("LP criada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar uma LP agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function handleEditLP({ id, name, campaignId, url }: editLP) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.put(
        `/lps/${id}`,
        {
          name,
          campaignId,
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("LP criada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar uma LP agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function deleteLp({ id }: deleteLp) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.delete(`/lps/${id}`, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
        },
      });

      console.log(response.data);

      AlertMessage(response.data.message, "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível deletar o cliente, tente novamente.",
          "error"
        );
      }
    }
  }

  //Origem Base
  async function handleCreateBase({ name, url }: createBase) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.post(
        "/data-sources",
        {
          name,
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Base criada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar uma Base agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function handleEditBase({ id, name, url }: editBase) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.put(
        `/data-sources/${id}`,
        {
          name,
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Origem Base editada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível editar a Base agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function deleteBase({ id }: deleteBase) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.delete(`/data-sources/${id}`, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
        },
      });

      console.log(response.data);

      AlertMessage("Origem Base deletada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível deletar a base, tente novamente.",
          "error"
        );
      }
    }
  }

  //URL destino
  async function handleCreateFinalURL({
    name,
    url,
    campaignId,
  }: createFinalURL) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.post(
        "/final-urls",
        {
          name,
          url,
          campaignId,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("Final URL criada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível criar uma URL de Destino agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function handleEditFinalUrl({
    id,
    name,
    url,
    campaignId,
  }: editFinalURL) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      // console.log(token)

      const response = await api.put(
        `/final-urls/${id}`,
        {
          name,
          url,
          campaignId,
        },
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`,
          },
        }
      );
      console.log(response.data);

      AlertMessage("URL de destino editada com sucesso.", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível editar a URL de destino agora, tente novamente mais tarde.",
          "error"
        );
      }
    }
  }

  async function deleteFinalUrl({ id }: deleteFinalUrl) {
    try {
      const dataUser = localStorage.getItem("@shorturl:user");

      if (!dataUser) {
        throw new Error("Token não encontrado.");
      }
      const token = JSON.parse(dataUser);

      const response = await api.delete(`/final-urls/${id}`, {
        headers: {
          Authorization: `Bearer ${token.jwtToken}`,
        },
      });

      console.log(response.data);

      AlertMessage(response.data.message, "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível deletar a base, tente novamente.",
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
          handleEditUser,
          deleteUser,
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
          handleTrackerA,
          handleTrackerB,
          handleTrackerC,
          handleCreateLP,
          handleEditLP,
          deleteLp,
          handleCreateBase,
          handleEditBase,
          deleteBase,
          handleCreateFinalURL,
          handleEditFinalUrl,
          deleteFinalUrl,
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
