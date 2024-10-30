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
import { FilePenLine } from "lucide-react";
import { z } from "zod";
import {
  categoryProps,
  customerData,
  DataProps,
  editCampaign,
} from "@/interface/auth";
import { useAuth } from "@/hook/Auth";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { AlertMessage } from "../alert_message";
import { api } from "@/services/Api";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";

const verifyEditCampaign = z.object({
  id: z.number(),
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  clientId: z.string().min(1, ""),
  startAt: z.string(),
  endAt: z.string(),
  category: z.string(),
  subCategory: z.string(),
  model: z.string(),
  type: z.string(),
  obs: z.string(),
  payout: z.string(),
});

type campaignData = z.infer<typeof verifyEditCampaign>;
type HandleCreateUsersProps = {
  handleEditCampaign: ({
    id,
    name,
    clientId,
    category,
    subCategory,
    model,
    type,
    startAt,
    endAt,
    obs,
  }: editCampaign) => void;
  data: DataProps;
};
type editCampaignProps = {
  name: string;
  id: number;
  nameClient: string;
  category: string;
  subcategory: string;
  model: string;
  type: string;
  payout: number;
  dataInicio: string;
  dataFim: string;
  obs: string;
  onEditCampaign: () => void;
};

export function EditarCampanha({
  name,
  id,
  nameClient,
  category,
  subcategory,
  model,
  type,
  payout,
  dataInicio,
  dataFim,
  obs,
  onEditCampaign,
}: editCampaignProps) {
  const { data, handleEditCampaign } = useAuth() as HandleCreateUsersProps;
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [payoutValue, setPayoutValue] = useState<string>("");
  const [categoryValue, setCategoryValue] = useState<string>("");
  const [subCategoryValue, setSubCategoryValue] = useState<string>("");
  const [categoryData, setCategoryData] = useState<categoryProps[]>([]);
  const dataPadraoFormatada = (data: string) => {
    return data.slice(0, 16);
  };
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<campaignData>({
    resolver: zodResolver(verifyEditCampaign),
    defaultValues: {
      id,
      name: name,
      category: category,
      subCategory: subcategory,
      model: model,
      type: type,
      startAt: dataPadraoFormatada(dataInicio),
      endAt: dataPadraoFormatada(dataFim),
      obs: obs,
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
          AlertMessage("Não foi possível conectar a API.", "error");
        }
      }
    }
    handleGetUsers();
  }, [data.jwtToken]);

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
    handleGetCategory();
    if (isOpen) {
      const payoutString = typeof payout === 'number' && Number.isInteger(payout)
        ? `${payout}00`
        : payout.toString();
  
      reset({
        id,
        name: name,
        category: category,
        subCategory: subcategory,
        model: model,
        type: type,
        startAt: dataPadraoFormatada(dataInicio),
        endAt: dataPadraoFormatada(dataFim),
        obs: obs,
      });
  
      setCategoryValue(category);
      setSubCategoryValue(subcategory);
      setPayoutValue(formatToBRLCurrency(payoutString));
    }
  }, [isOpen]);

  useEffect(() => {
    const selectedClient = customerData.find(
      (client) => client.name === nameClient
    );
    if (selectedClient) {
      setValue("clientId", selectedClient.name);
    }
  }, [isOpen, nameClient, customerData, setValue]);

  async function editCampaign(data: campaignData) {
    const {
      id,
      name,
      model,
      type,
      clientId,
      startAt,
      endAt,
      obs,
    } = data;
    const idClient = customerData.find((i) => i.name === clientId)?.id;
    const dataInicioFormatado = new Date(startAt);
    const dataFimFormatado = new Date(endAt);
    const inicioIso = dataInicioFormatado.toISOString();
    const fimIso = dataFimFormatado.toISOString();
    const payoutFormatado = payoutValue.replace(/\./g, "").replace(",", ".");

    if (idClient) {
      console.log([
        {
          id,
          name,
          category: categoryValue,
          subCategory: subCategoryValue,
          model,
          type,
          payout: Number(payoutFormatado),
          clientId: idClient,
          startAt: inicioIso,
          endAt: fimIso,
          obs,
        },
      ]);
      try {
        await handleEditCampaign({
          id,
          name,
          category: categoryValue,
          subCategory: subCategoryValue,
          model,
          type,
          payout: Number(payoutFormatado),
          startAt: inicioIso,
          endAt: fimIso,
          obs,
        });
        onEditCampaign();
      } catch (error) {
        console.error("Erro editar campanha:", error);
      }
      setIsOpen(false);
    } else {
      console.error("Id do cliente não encontrado.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="p-2" variant={"outline"}>
          <FilePenLine size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Campanha</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(editCampaign)}>
          <input type="hidden" value={id} {...register("id")} />
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                defaultValue={name}
                {...register("name")}
                className={`${errors.name && "border-rose-400 bg-rose-100"}`}
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
                    <SelectTrigger>
                      <SelectValue placeholder={nameClient} />
                    </SelectTrigger>
                    <SelectContent className={`${errors.clientId}`}>
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
              {errors.clientId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
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
                      setSubCategoryValue('');
                    }}
                  >
                    <SelectTrigger
                      className={`${errors.category && "border-rose-400"}`}
                    >
                      <SelectValue placeholder={categoryValue} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clientes</SelectLabel>
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
                      <SelectValue placeholder={subCategoryValue} />
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
                  <Select
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={`${errors.model && "border-rose-400"}`}
                    >
                      <SelectValue placeholder={model === 'LeadHunting' ? 'Lead Hunting' : model} />
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
                  <Select onValueChange={field.onChange} defaultValue={type}>
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
              <Label id="dataInicio">Data/Hora Início</Label>
              <Input
                id="dataInicio"
                type="datetime-local"
                {...register("startAt")}
                className={`${errors.startAt && "border-rose-400 bg-rose-100"}`}
              />
            </div>
            <div className="col-span-2">
              <Label id="dataFim">Data/Hora Fim</Label>
              <Input
                id="dataFim"
                type="datetime-local"
                {...register("endAt")}
                className={`${errors.endAt && "border-rose-400 bg-rose-100"}`}
              />
            </div>
            <div className="col-span-4">
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                placeholder="Digite uma observação, campo não obrigatório"
                defaultValue={obs}
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
              <FilePenLine size={18} />
              Editar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
