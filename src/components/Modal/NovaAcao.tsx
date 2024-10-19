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

const verifyCreateAction = z.object({
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  campaignId: z.number(),
  selectCliente: z.string().min(1, ""),
  startAt: z.string().min(1, "*Campo obrigatório"),
  endAt: z.string().min(1, "*Campo obrigatório"),
  utm: z.string().min(1, '*Campo obrigatório'),
  cost: z.string().min(1, '*Campo obrigatório'),
  key: z.string().min(1, '*Campo obrigatório'),
});

type actionData = z.infer<typeof verifyCreateAction>;
type HandleCreateUsersProps = {
  handleCreateAction: ({
    name,
    campaignId,
    startAt,
    endAt,
    utm,
    cost,
    key
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
  const [utm, setUtm] = useState<string>("utm_source");
  const [chave, setChave] = useState<string>('');

  const handleSelectChange = (value: string) => {
    const selectedCustomer = customerData.find(
      (customer) => customer.name === value
    );
    if (selectedCustomer) {
      setClientId(selectedCustomer.id);
      setSelectedClient(value);
    }
  };

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

  useEffect(() => {
    reset({name: '', campaignId: 0, startAt: '', endAt: '', utm: utm, cost: '', key: ''})}, [isOpen])

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
      selectCliente: "",
      startAt: "",
      endAt: "",
      utm: utm,
      cost: '',
      key: '',
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
    const { name, campaignId, startAt, endAt, utm, cost, key } = data;
    console.log(name, campaignId, startAt, endAt, utm, cost, key);
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
          startAt: inicioIso,
          endAt: fimIso,
          utm: utm,
          cost,
          key: chave,
        });
        console.log({
          name,
          campaignId,
          startAt: inicioIso,
          endAt: fimIso,
          utm: utm,
          cost,
          key: chave,
        });
        onCreateAction();
        setIsOpen(false);
        reset();
      } catch (error) {
        console.error("Erro ao criar ação:", error);
      }
    }
  };
  console.log(errors)

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
              <Label htmlFor="selectCliente">Cliente</Label>
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
              <SelectLP />
            </div>
            <div className="col-span-1">
              <Label htmlFor="cost">Custo</Label>
              <Input id="cost" type="text"
              placeholder="0,99"
              {...register("cost")}
                className={`${errors.cost && "border-rose-400 bg-rose-100"}`}
              />
              {errors.cost && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.cost.message}
                </span>
              )}
            </div>
            <div className="col-span-2">
              <Label htmlFor="utm">UTM</Label>
              {/* SELECT UTM */}
              <Controller
                name="utm"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // Atualiza o valor no formulário
                      setUtm(value);
                    }}
                    defaultValue="utm_source"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Chaves</SelectLabel>
                        <SelectItem value="utm_source">utm_source</SelectItem>
                        <SelectItem value="utm_medium">utm_medium</SelectItem>
                        <SelectItem value="utm_campaign">
                          utm_campaign
                        </SelectItem>
                        <SelectItem value="utm_turn">utm_turn</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.utm && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT CUSTOMER */}
            </div>
            <div className="col-span-2">
              <Label htmlFor="key">Chave</Label>
              {/* SELECT KEY */}

              <Controller
                name="key"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // Atualiza o valor no formulário
                      setChave(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {utm === "utm_source" && (
                        <SelectGroup>
                          <SelectLabel>Chaves</SelectLabel>
                          <SelectItem value="instagram">instagram</SelectItem>
                          <SelectItem value="inbound">inbound</SelectItem>
                          <SelectItem value="google">google</SelectItem>
                          <SelectItem value="emkt">emkt</SelectItem>
                          <SelectItem value="facebook">facebook</SelectItem>
                        </SelectGroup>
                      )}
                      {utm === "utm_medium" && (
                        <SelectGroup>
                          <SelectLabel>Chaves</SelectLabel>
                          <SelectItem value="shifters">shifters</SelectItem>
                          <SelectItem value="bd">bd</SelectItem>
                          <SelectItem value="cpc">cpc</SelectItem>
                          <SelectItem value="selecoes">selecoes</SelectItem>
                          <SelectItem value="pinup">pinup</SelectItem>
                          <SelectItem value="inbox">inbox</SelectItem>
                        </SelectGroup>
                      )}
                      {utm === "utm_campaign" && (
                        <SelectGroup>
                          <SelectLabel>Chaves</SelectLabel>
                          <SelectItem value="form">form</SelectItem>
                          <SelectItem value="display">display</SelectItem>
                        </SelectGroup>
                      )}
                      {utm === "utm_turn" && (
                        <SelectGroup>
                          <SelectLabel>Chaves</SelectLabel>
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.key && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT KEY */}
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
