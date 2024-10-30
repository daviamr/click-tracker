import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileCheck2, FilePlus2 } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import {
  categoryProps,
  createNewCampaign,
  customerData,
  DataProps,
} from "@/interface/auth";
import { api } from "@/services/Api";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { AlertMessage } from "../alert_message";
import { Textarea } from "../ui/textarea";

const verifyCreateCampaign = z.object({
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  clientId: z.string().min(1, ""),
  startAt: z.string(),
  endAt: z.string().min(1, "*Campo obrigatório"),
  category: z.string().min(1, "*Campo obrigatório"),
  subCategory: z.string().min(1, "*Campo obrigatório"),
  model: z.string().min(1, "*Campo obrigatório"),
  type: z.string().min(1, "*Campo obrigatório"),
  obs: z.string(),
  payout: z.string().min(1, "*Campo obrigatório"),
});

type campaignData = z.infer<typeof verifyCreateCampaign>;
type HandleCreateUsersProps = {
  handleCreateCampaign: ({
    name,
    clientId,
    category,
    subCategory,
    model,
    type,
    startAt,
    endAt,
    obs,
  }: createNewCampaign) => void;
  data: DataProps;
};

type createCampaignProps = {
  onCreateCampaign: () => void;
};

export function NovaCampanha({ onCreateCampaign }: createCampaignProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, handleCreateCampaign } = useAuth() as HandleCreateUsersProps;
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [payoutValue, setPayoutValue] = useState<string>("");
  const [categoryValue, setCategoryValue] = useState<string>("");
  const [subCategoryValue, setSubCategoryValue] = useState<string>("");
  const [categoryData, setCategoryData] = useState<categoryProps[]>([]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<campaignData>({
    resolver: zodResolver(verifyCreateCampaign),
    defaultValues: {
      name: "",
      clientId: "",
      category: "",
      subCategory: "",
      model: "",
      type: "",
      startAt: "",
      endAt: "",
      payout: "",
      obs: "",
    },
  });

  const formatToBRLCurrency = (value: string) => {
    // Remove qualquer caractere que não seja número
    const numericValue = value.replace(/[^0-9]/g, "");

    // Retorna uma string vazia se o campo estiver vazio
    if (!numericValue) return "";

    // Converte para número e formata para o estilo brasileiro
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(numericValue) / 100);

    return formattedValue;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPayoutValue(formatToBRLCurrency(value));
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedChars = /[0-9,]/;
    if (!allowedChars.test(event.key)) {
      event.preventDefault();
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Ajusta o fuso horário
    return now.toISOString().slice(0, 16); // Formato compatível com datetime-local
  };

  const handleGetCategory = async () => {
    try {
      const response = await api.get("/categories", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCategoryData(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar os clientes, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get("/clients", {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setCustomerData(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível deletar uma conta agora, tente novamente mais tarde!",
            "error"
          );
        }
      }
    }
    handleGetUsers();
  }, []);

  useEffect(() => {
    reset();
    setPayoutValue("");
    setCategoryValue("");
    setSubCategoryValue("");
    handleGetCategory();
    setValue("startAt", getCurrentDateTime());
  }, [isOpen]);

  useEffect(() => {
    setSubCategoryValue("");
  }, [categoryValue]);

  async function createCampaign(data: campaignData) {
    const { name, clientId, model, type, startAt, endAt, obs } = data;
    const idClient = customerData.find((i) => i.name === clientId)?.id;
    const dataInicioFormatado = new Date(startAt);
    const dataFimFormatado = new Date(endAt);
    const inicioIso = dataInicioFormatado.toISOString();
    const fimIso = dataFimFormatado.toISOString();
    const payoutFormatado = payoutValue.replace(/\./g, "").replace(",", ".");

    console.log([
      {
        name: name,
        clientId: idClient,
        category: categoryValue,
        subcategory: subCategoryValue,
        model: model,
        type: type,
        payout: payoutFormatado,
        startAt: inicioIso,
        endAt: fimIso,
        obs: obs,
      },
    ]);

    if (idClient) {
      try {
        await handleCreateCampaign({
          name,
          clientId: idClient,
          category: categoryValue,
          subCategory: subCategoryValue,
          model,
          type,
          payout: Number(payoutFormatado),
          startAt: inicioIso,
          endAt: fimIso,
          obs,
        });
        onCreateCampaign();
      } catch (error) {
        console.error("Erro ao criar campanha:", error);
      }
      setIsOpen(false);
      reset();
    } else {
      console.error("Id do cliente não encontrado.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant={"secondary"}>
          <FilePlus2 size={18} />
          Cadastrar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Campanha</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form action="" onSubmit={handleSubmit(createCampaign)}>
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Nome da campanha..."
                {...register("name")}
                className={`${errors.name && "border-rose-400"}`}
              />
              {errors.name && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="col-span-4">
              <Label htmlFor="campanhas">Cliente</Label>
              {/* SELECT CUSTOMER */}
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`${errors.clientId && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clientes</SelectLabel>
                        {customerData.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {/* FINAL SELECT CUSTOMER */}
            </div>
            <div className="col-span-2">
              <Label htmlFor="categoria">Categoria</Label>
              {/* SELECT CATEGORY */}
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setCategoryValue(value);
                    }}
                  >
                    <SelectTrigger
                      className={`${errors.category && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorias</SelectLabel>
                        {categoryData.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {/* FINAL SELECT CATEGORY */}
            </div>
            <div className="col-span-2">
              <Label htmlFor="subCategoria">Subcategoria</Label>
              {/* SELECT SUBCATEGORY */}
              <Controller
                name="subCategory"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSubCategoryValue(value);
                    }}
                    disabled={!categoryValue}
                  >
                    <SelectTrigger
                      className={`${errors.subCategory && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryData.map(
                        (i, index) =>
                          categoryValue === i.name &&
                          Array.isArray(i.subcategories) && (
                            <SelectGroup key={index}>
                              <SelectLabel>Subcategorias</SelectLabel>
                              {i.subcategories.map(
                                (subcategory: string, subIndex: number) => (
                                  <SelectItem
                                    key={subIndex}
                                    value={subcategory}
                                  >
                                    {subcategory}
                                  </SelectItem>
                                )
                              )}
                            </SelectGroup>
                          )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {/* FINAL SELECT SUBCATEGORY */}
            </div>
            <div className="col-span-2">
              <Label htmlFor="modelo">Modelo</Label>
              {/* SELECT MODEL */}
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`${errors.model && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Modelos</SelectLabel>
                        <SelectItem value="CPL">CPL</SelectItem>
                        <SelectItem value="CPI">CPI</SelectItem>
                        <SelectItem value="CPA">CPA</SelectItem>
                        <SelectItem value="CPC">CPC</SelectItem>
                        <SelectItem value="LeadHunting">
                          Lead Hunting
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {/* FINAL SELECT MODEL */}
            </div>
            <div className="col-span-1">
              <Label htmlFor="tipo">Tipo</Label>
              {/* SELECT TYPE */}
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`${errors.type && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipos</SelectLabel>
                        <SelectItem value="B2B">B2B</SelectItem>
                        <SelectItem value="B2C">B2C</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {/* FINAL SELECT TYPE */}
            </div>
            <div className="col-span-1">
              <Label>Payout</Label>
              <Input
                id="payout"
                type="text"
                {...register("payout", {
                  onChange: (e) => {
                    setPayoutValue(e.target.value);
                  },
                })}
                value={payoutValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={`${errors.payout && "border-rose-400"}`}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="dataInicio">Data/Hora Início</Label>
              <Input
                id="dataInicio"
                type="datetime-local"
                {...register("startAt")}
                className={`${errors.startAt && "border-rose-400"}`}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="dataFim">Data/Hora Fim</Label>
              <Input
                id="dataFim"
                type="datetime-local"
                {...register("endAt")}
                className={`${errors.endAt && "border-rose-400"}`}
              />
            </div>
            <div className="col-span-4">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                placeholder="Digite uma observação, campo não obrigatório"
                {...register("obs")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2"
              type="submit"
              variant={"secondary"}
              onClick={() => setIsOpen(true)}
            >
              <FileCheck2 size={18} />
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
