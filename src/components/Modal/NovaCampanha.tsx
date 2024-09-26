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
import { SelectCategoria } from "../SelectCategoria";
import { SelectSubCategoria } from "../SelectSubCategoria";
import { Textarea } from "../ui/textarea";
import { SelectTipo } from "../SelectTipo";
import { SelectModelo } from "../SelectModelo";

const verifyCreateCampaign = z.object({
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  clientId: z.string().min(1, ""),
  startAt: z.string(),
  endAt: z.string(),
  payout: z.string(),
});

type campaignData = z.infer<typeof verifyCreateCampaign>;
type HandleCreateUsersProps = {
  handleCreateCampaign: ({
    name,
    clientId,
    startAt,
    endAt,
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
      startAt: "",
      endAt: "",
      payout: "",
    },
  });

  useEffect(() => {
    setValue("startAt", getCurrentDateTime());
  }, [setValue]);

  async function createCampaign(data: campaignData) {
    const { name, clientId, startAt, endAt } = data;
    const idClient = customerData.find((i) => i.name === clientId)?.id;
    const dataInicioFormatado = new Date(startAt);
    const dataFimFormatado = new Date(endAt);
    const inicioIso = dataInicioFormatado.toISOString();
    const fimIso = dataFimFormatado.toISOString();

    console.log(data);
    if (idClient) {
      try {
        await handleCreateCampaign({
          name,
          clientId: idClient,
          startAt: inicioIso,
          endAt: fimIso,
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
                      <SelectValue placeholder="Selecione o cliente" />
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
              <SelectCategoria />
            </div>
            <div className="col-span-2">
              <Label htmlFor="subcategoria">Subcategoria</Label>
              <SelectSubCategoria />
            </div>
            <div className="col-span-2">
              <Label htmlFor="modelo">Modelo</Label>
              <SelectModelo />
            </div>
            <div className="col-span-1">
              <Label htmlFor="tipo">Tipo</Label>
              <SelectTipo />
            </div>
            <div className="col-span-1">
              <Label htmlFor="payout">Payout</Label>
              <Input
                id="nome"
                type="text"
                placeholder=""
                {...register("payout")}
                className={`${errors.payout && "border-rose-400 bg-rose-100"}`}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="dataInicio">Data/Hora Início</Label>
              <Input
                id="dataInicio"
                type="datetime-local"
                {...register("startAt")}
                className={`${errors.startAt && "border-rose-400 bg-rose-100"}`}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="dataFim">Data/Hora Fim</Label>
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
