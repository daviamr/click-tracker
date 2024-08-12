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
  createNewAction,
  customerData,
  DataProps,
} from "@/interface/auth";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const verifyCreateAction = z.object({
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  campaignId: z.number(),
  selectCliente: z.string().min(1,'')
});

type actionData = z.infer<typeof verifyCreateAction>;
type HandleCreateUsersProps = {
  handleCreateAction: ({ name, campaignId }: createNewAction) => void;
  data: DataProps;
};

export function EditarAcao() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useAuth() as HandleCreateUsersProps;
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);

  const cliente =
    customerData
      .filter((customer) => selectedClient === customer.name)
      .map((customer) => customer.id)
      .join(", ") || "Cliente não encontrado";

  const handleSelectChange = (value: string) => {
    setSelectedClient(value);
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
        const response = await api.get(`/campaigns?clientId=${cliente}`, {
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
  }, [cliente]);

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
      name: '',
      campaignId: 0,
      selectCliente: '',
    },
  });

  const handleSelectCampaign = (value: string) => {
    const selectedCampaign = campanhas.find((campanha) => campanha.name === value);
    if (selectedCampaign) {
      setValue("campaignId", selectedCampaign.id);
      console.log(`id da campanha: ${selectedCampaign.id}`);
    }
  };

  const createAction = (data: actionData) => {
    const { name, campaignId } = data;

    if (campaignId === 0) {
      alert('Campanha não encontrada.')
    } else {
      console.log(`${name}`);
      setIsOpen(false);
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="p-2" variant={"outline"}>
        <FilePenLine size={18}/>
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
        <form onSubmit={handleSubmit(createAction)}>
          <div className="grid grid-cols-4 gap-4 py-4">
            
            <div className="col-span-4">
              <Label htmlFor="cliente">Cliente</Label>
              {/* SELECT CUSTOMER */}

              <Controller
              name="selectCliente"
              control={control}
              render={({field}) => (
              <Select onValueChange={(value) => {
                field.onChange(value); // Atualiza o valor no formulário
                handleSelectChange(value); // Atualiza o estado do cliente selecionado
              }}
            >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent
                className={`${errors.selectCliente}`}>
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
              )}/>
              {errors.selectCliente && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT CUSTOMER */}
            </div>
            <div className="col-span-4">
              <Label htmlFor="campanha">Campanha</Label>
              <Select disabled={!selectedClient} onValueChange={handleSelectCampaign}>
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
                    {campanhas.map((i, index) => (
                      <SelectItem
                        value={i.name}
                        key={index}
                      >
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
