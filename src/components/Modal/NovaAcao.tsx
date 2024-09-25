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
import { FileCheck2, FilePlus2 } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { AlertMessage } from "../alert_message";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";
import {
  campaignData,
  createNewAction,
  customerData,
  DataProps,
} from "@/interface/auth";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectLP } from "../SelectLP";
import { SelectUTM } from "../SelectUTM";
import { SelectChave } from "../SelectChave";

const verifyCreateAction = z.object({
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  campaignId: z.number(),
  customPath: z.string(),
  selectCliente: z.string().min(1, ""),
  startAt: z.string().min(1, "*Campo obrigatório"),
  endAt: z.string().min(1, "*Campo obrigatório"),
});

type actionData = z.infer<typeof verifyCreateAction>;
type HandleCreateUsersProps = {
  handleCreateAction: ({
    name,
    campaignId,
    customPath,
    startAt,
    endAt,
  }: createNewAction) => void;
  data: DataProps;
};

type createActionProps = {
  onCreateAction: () => void;
};

export function NovaAcao({ onCreateAction }: createActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, handleCreateAction } = useAuth() as HandleCreateUsersProps;
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  // const [isChecked, setIsChecked] = useState(false);
  const [clientId, setClientId] = useState<string>("");

  const handleSelectChange = (value: string) => {
    const selectedCustomer = customerData.find(
      (customer) => customer.name === value
    );
    if (selectedCustomer) {
      setClientId(selectedCustomer.id);
      setSelectedClient(value);
    }
  };

  // const handleChecked = () => {
  //   setIsChecked(!isChecked)
  // }

  const handleGetClient = async () => {
    try {
      const response = await api.get("/clients", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCustomerData(response.data);
      console.log(response.data);
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
    handleGetClient();
  }, [data.jwtToken]);

  useEffect(() => {
    async function handleGetSingleClient() {
      try {
        const response = await api.get(`/campaigns?clientId=${clientId}`, {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setCampanhas(response.data);
        console.log(response.data);
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
    if (clientId) {
      handleGetSingleClient();
    }
  }, [clientId]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<actionData>({
    resolver: zodResolver(verifyCreateAction),
    defaultValues: {
      name: "",
      campaignId: 0,
      customPath: "",
      selectCliente: "",
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

  const createAction = async (data: actionData) => {
    const { name, campaignId, customPath, startAt, endAt } = data;
    const dataInicioFormatado = new Date(startAt);
    const dataFimFormatado = new Date(endAt);
    const inicioIso = dataInicioFormatado.toISOString();
    const fimIso = dataFimFormatado.toISOString();

    if (campaignId === 0) {
      alert("Campanha não encontrada.");
    } else {
      try {
        await handleCreateAction({
          name,
          campaignId,
          customPath,
          startAt: inicioIso,
          endAt: fimIso,
        });
        console.log({
          name,
          campaignId,
          customPath,
          startAt: inicioIso,
          endAt: fimIso,
        });
        onCreateAction();
        setIsOpen(false);
        reset();
      } catch (error) {
        console.error("Erro ao criar ação:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant={"secondary"}>
          <FilePlus2 size={18} />
          Criar Ação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Ação</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(createAction)}>
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="cliente">Cliente</Label>
              {/* SELECT CUSTOMER */}

              <Controller
                name="selectCliente"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // Atualiza o valor no formulário
                      handleSelectChange(value); // Atualiza o estado do cliente selecionado
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent className={`${errors.selectCliente}`}>
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
              {errors.selectCliente && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT CUSTOMER */}
            </div>
            <div className="col-span-4">
              <Label htmlFor="campanha">Campanha</Label>
              <Select
                disabled={!selectedClient}
                onValueChange={handleSelectCampaign}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedClient
                        ? "Cliente não selecionado"
                        : "Selecione a campanha"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Campanhas</SelectLabel>
                    {campanhas.map((i) => (
                      <SelectItem value={i.name} key={i.id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <Label htmlFor="lprelacionada">LP Relacionada</Label>
              <SelectLP/>
            </div>
            <div className="col-span-1">
              <Label htmlFor="custo">Custo</Label>
              <Input
              type="text"
              placeholder="R$ 0,99"/>
            </div>
            <div className="col-span-2">
              <Label htmlFor="utm">UTM</Label>
              <SelectUTM/>
            </div>
            <div className="col-span-2">
              <Label htmlFor="utm">Chave</Label>
              <SelectChave/>
            </div>
            <div className="col-span-4">
              <Label htmlFor="nome" className="text-right">
                Ação
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Digite a ação..."
                {...register("name")}
                className={`${errors.name && "border-rose-400 bg-rose-100"}`}
              />
              {errors.name && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.name.message}
                </span>
              )}
            </div>
            {/* <div className="flex gap-4 col-span-4">
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
            className="col-span-4"/>
          </div> */}
            <div className="col-span-2">
              <Label id="dataInicio">Data/Hora Início</Label>
              <Input
                id="dataInicio"
                type="datetime-local"
                {...register("startAt")}
                className={`${errors.startAt && "border-rose-400 bg-rose-100"}`}
              />
              {errors.startAt && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
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
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
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
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
