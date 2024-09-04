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
import { customerData, DataProps, editCampaign } from "@/interface/auth";
import { useAuth } from "@/hook/Auth";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { AlertMessage } from "../alert_message";
import { api } from "@/services/Api";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const verifyEditCampaign = z.object({
  id: z.number(),
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  clientId: z.string(),
  startAt: z.string(),
  endAt: z.string(),
});

type campaignData = z.infer<typeof verifyEditCampaign>;
type HandleCreateUsersProps = {
  handleEditCampaign: ({ id, name, clientId }: editCampaign) => void;
  data: DataProps;
};
type editCampaignProps = {
  name: string;
  id: number;
  nameClient: string;
  dataInicio: string;
  dataFim: string;
  onEditCampaign: () => void;
};

export function EditarCampanha({
  name,
  id,
  nameClient,
  dataInicio,
  dataFim,
  onEditCampaign,
}: editCampaignProps) {

  const { data, handleEditCampaign } = useAuth() as HandleCreateUsersProps;
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dataPadraoFormatada = (data: string) => {
    return data.slice(0, 16);
  }

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
      startAt: dataPadraoFormatada(dataInicio),
      endAt: dataPadraoFormatada(dataFim),
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        id,
        name: name,
        startAt: dataPadraoFormatada(dataInicio),
        endAt: dataPadraoFormatada(dataFim),
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const selectedClient = customerData.find(client => client.name === nameClient);
    if (selectedClient) {
      setValue("clientId", selectedClient.name);
    }
  }, [isOpen, nameClient, customerData, setValue]);

  async function editCampaign(data: campaignData) {
    console.log("enviado");
    const { id, name, clientId, startAt, endAt } = data;
    const idClient = customerData.find((i) => i.name === clientId)?.id;
    const dataInicioFormatado = new Date(startAt);
    const dataFimFormatado = new Date(endAt);
    const inicioIso = dataInicioFormatado.toISOString();
    const fimIso = dataFimFormatado.toISOString();

    console.log(id, name, idClient);

    if (idClient) {
      try {
        await handleEditCampaign({ id, name, clientId: idClient, startAt: inicioIso, endAt: fimIso });
        onEditCampaign();
      } catch (error) {
        console.error("Erro editar campanha:", error);
      }
      setIsOpen(false);
      reset({ id, name: "", clientId: "" });
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
