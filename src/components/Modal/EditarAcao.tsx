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
import { Label } from "@/components/ui/label";
import { FileCheck2, FilePenLine } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { AlertMessage } from "../alert_message";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";
import {
  campaignData,
  customerData,
  DataProps,
  editAction,
} from "@/interface/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const verifyEditAction = z.object({
  id: z.number(),
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  campaignId: z.number(),
  customPath: z.string(),
  selectCliente: z.string(),
  startAt: z.string().min(1, "*Campo obrigatório"),
  endAt: z.string().min(1, "*Campo obrigatório"),
});

type actionData = z.infer<typeof verifyEditAction>;
type HandleCreateUsersProps = {
  handleEditAction: ({
    id,
    name,
    campaignId,
    customPath,
    startAt,
    endAt,
  }: editAction) => void;
  data: DataProps;
};

type editActionProps = {
  id: number;
  cliente: string;
  campanha: string;
  acao: string;
  dataInicio: string;
  dataFim: string;
  onEditAction: () => void;
};

export function EditarAcao({
  id,
  cliente,
  campanha,
  acao,
  dataInicio,
  dataFim,
  onEditAction,
}: editActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, handleEditAction } = useAuth() as HandleCreateUsersProps;
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  const dataFormatada = (data: string) => {
    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const clienteId =
    customerData
      .filter((customer) => cliente === customer.name)
      .map((customer) => customer.id)
      .join(", ") || "Cliente não encontrado";

  const handleChecked = () => {
    setIsChecked(!isChecked);
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
            "Não foi possível carregar os clientes, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetUsers();
  }, [customerData]);

  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get(`/campaigns?clientId=${clienteId}`, {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setCampanhas(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível carregar as campanhas, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetUsers();
  }, [campanhas]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<actionData>({
    resolver: zodResolver(verifyEditAction),
    defaultValues: {
      id,
      name: "",
      campaignId: 0,
      customPath: "",
      selectCliente: cliente,
      startAt: "",
      endAt: "",
    },
  });

  const handleSelectCampaign = (value: string) => {
    const selectedCampaign = campanhas.find(
      (campanha) => campanha.name === value
    );
    if (selectedCampaign) {
      setValue("campaignId", selectedCampaign.id);
      console.log(`id da campanha: ${selectedCampaign.id}`);
    }
  };

  const editAction = async (data: editAction) => {
    const { id, name, campaignId, customPath, startAt, endAt } = data;
    const dataInicioFormatado = new Date(startAt);
    const dataFimFormatado = new Date(endAt);
    const inicioIso = dataInicioFormatado.toISOString();
    const fimIso = dataFimFormatado.toISOString();

    if (campaignId === 0) {
      alert("Campanha não encontrada.");
    } else {
      try {
        await handleEditAction({
          id,
          name,
          campaignId,
          customPath,
          startAt: inicioIso,
          endAt: fimIso,
        });
        onEditAction();
      } catch (error) {
        console.log('Não foi possível editar a ação:', error)
      }
      setIsOpen(false);
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="p-2" variant={"outline"}>
          <FilePenLine size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Ação</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(editAction)}>
          <input type="hidden" value={id} {...register("id")} />
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={cliente}
                type="text"
                disabled
                {...register("selectCliente")}
              />
            </div>
            <div className="col-span-4">
              <Label htmlFor="campanha">Campanha</Label>
              <Select onValueChange={handleSelectCampaign}>
                <SelectTrigger>
                  <SelectValue placeholder={campanha} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Campanhas</SelectLabel>
                    {campanhas.map((i, index) => (
                      <SelectItem value={i.name} key={index}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <Label htmlFor="nome" className="text-right">
                Ação
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder={acao}
                {...register("name")}
                className={`${errors.name && "border-rose-400 bg-rose-100"}`}
              />
              {errors.name && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex gap-4 col-span-4">
              <Input
                type="checkbox"
                className="max-w-[16px]"
                checked={isChecked}
                onChange={handleChecked}
              />

              <Input
                placeholder="Personalizar URL"
                disabled={!isChecked}
                {...register("customPath")}
                className="col-span-4"
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
              {errors.startAt && (
                <span className="text-xs text-rose-400 font-normal block">
                  *Campo obrigatório
                </span>
              )}
              <span className="text-xs text-nowrap opacity-40">
                *Atual: <strong>{dataFormatada(dataInicio)}</strong>
              </span>
            </div>
            <div className="col-span-2">
              <Label id="dataFim">Data/Hora Fim</Label>
              <Input
                id="dataFim"
                type="datetime-local"
                {...register("endAt")}
                className={`${errors.endAt && "border-rose-400 bg-rose-100"}`}
              />
              {errors.endAt && (
                <span className="text-xs text-rose-400 font-normal block">
                  *Campo obrigatório
                </span>
              )}
              <span className="text-xs text-nowrap opacity-40">
                *Atual: <strong>{dataFormatada(dataFim)}</strong>
              </span>
            </div>
            <input
              type="hidden"
              {...register("campaignId", { valueAsNumber: true })}
            />
          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2 mt-6"
              type="submit"
              variant={"secondary"}
              onClick={() => setIsOpen(true)}
            >
              <FileCheck2 size={18} />
              Editar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
