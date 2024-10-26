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
import { createNewCampaign, customerData, DataProps } from "@/interface/auth";
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

  const formatToBRLCurrency = (value: string) => {
    // Remove qualquer caractere que não seja número
    const numericValue = value.replace(/[^0-9]/g, '');

    // Retorna uma string vazia se o campo estiver vazio
    if (!numericValue) return "";

    // Converte para número e formata para o estilo brasileiro
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
    setPayoutValue('');
  }, [isOpen]);

  //data atual
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Ajusta o fuso horário
    return now.toISOString().slice(0, 16); // Formato compatível com datetime-local
  };

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

  useEffect(() => {
    setValue("startAt", getCurrentDateTime());
  }, [isOpen]);

  async function createCampaign(data: campaignData) {
    const {
      name,
      clientId,
      category,
      subCategory,
      model,
      type,
      startAt,
      endAt,
      obs,
    } = data;
    const idClient = customerData.find((i) => i.name === clientId)?.id;
    const dataInicioFormatado = new Date(startAt);
    const dataFimFormatado = new Date(endAt);
    const inicioIso = dataInicioFormatado.toISOString();
    const fimIso = dataFimFormatado.toISOString();
    const payoutFormatado = payoutValue.replace(/\./g, '').replace(',', '.');

    console.log([
      {
        name: name,
        clientId: idClient,
        category: category,
        subcategory: subCategory,
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
          category,
          subCategory,
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
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`${errors.category && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorias</SelectLabel>
                        <SelectItem value="Financeiro">Financeiro</SelectItem>
                        <SelectItem value="Benefícios">Benefícios</SelectItem>
                        <SelectItem value="Saúde">Saúde</SelectItem>
                        <SelectItem value="Publicidade">Publicidade</SelectItem>
                        <SelectItem value="Telecom">Telecom</SelectItem>
                        <SelectItem value="Facilities">Facilities</SelectItem>
                        <SelectItem value="Hardware">Hardware</SelectItem>
                        <SelectItem value="Escritório">Escritório</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
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
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`${errors.subCategory && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione a subcategoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Subcategorias</SelectLabel>
                        <SelectItem value="Maquininha">Maquininha</SelectItem>
                        <SelectItem value="Abertura de Contas">
                          Abertura de Contas
                        </SelectItem>
                        <SelectItem value="Empréstimos">Empréstimos</SelectItem>
                        <SelectItem value="Cartão de Crédito">
                          Cartão de Crédito
                        </SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Cartão Alimentação">
                          Cartão Alimentação
                        </SelectItem>
                        <SelectItem value="Cartão Refeição">
                          Cartão Refeição
                        </SelectItem>
                        <SelectItem value="Clano de Saúde">
                          Plano de Saúde
                        </SelectItem>
                        <SelectItem value="Plano Odontológico">
                          Plano Odontológico
                        </SelectItem>
                        <SelectItem value="E-mail Marketing">
                          E-mail Marketing
                        </SelectItem>
                        <SelectItem value="Geração de Leads">
                          Geração de Leads
                        </SelectItem>
                        <SelectItem value="Internet">Internet</SelectItem>
                        <SelectItem value="Plano Móvel">Plano Móvel</SelectItem>
                        <SelectItem value="Máquina de Café">
                          Máquina de Café
                        </SelectItem>
                        <SelectItem value="Material de Escritório">
                          Material de Escritório
                        </SelectItem>
                        <SelectItem value="Antivírus">Antivírus</SelectItem>
                        <SelectItem value="PCs e Notebooks">
                          PCs e Notebooks
                        </SelectItem>
                        <SelectItem value="Mobiliários">Mobiliários</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectGroup>
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
