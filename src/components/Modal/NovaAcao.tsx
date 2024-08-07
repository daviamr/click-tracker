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
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { FileCheck2, FilePlus2 } from "lucide-react";
import { SelectCliente } from "../SelectClient";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { AlertMessage } from "../alert_message";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";
import { campaignData, createNewAction, customerData, DataProps } from "@/interface/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const verifyCreateAction = z.object({
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  campaignId: z.number(),
});

type actionData = z.infer<typeof verifyCreateAction>;
type HandleCreateUsersProps = {
  handleCreateAction: ({ name, campaignId }: createNewAction) => void;
  data: DataProps
};

export function NovaAcao() {
  const { data, handleCreateAction } = useAuth() as HandleCreateUsersProps
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);

  const cliente = customerData.filter((customer) => selectedClient === customer.name).map((customer) => customer.id).join(", ") || "Cliente não encontrado";

  const handleSelectChange = (value: string) => {
    setSelectedClient(value);
  };

  useEffect(() => {
    async function handleGetUsers()
    {
    try {
      const response = await api.get('/clients',
        {headers: {
        "Authorization": `Bearer ${data.jwtToken}`,
      }})
      setCustomerData(response.data)
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
  handleGetUsers()
},[customerData])

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
}, [campanhas]);

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<actionData>({
  resolver: zodResolver(verifyCreateAction),
  defaultValues: {
    name: "",
  },
});

function createAction(data: actionData) {
  const { name, campaignId } = data;
  console.log(data);
  
  handleCreateAction({ name, campaignId});
}

  return (
    <Dialog>
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
        <form action="" onSubmit={handleSubmit(createAction)}>
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="cliente">Cliente</Label>
              <SelectCliente onChange={handleSelectChange}/>
            </div>
            <div className="col-span-4">
              <Label htmlFor="campanha">Campanha</Label>
              <Select disabled={!selectedClient}>
                <SelectTrigger>
                  <SelectValue 
                  placeholder={!selectedClient ? 'Cliente não selecionado' : 'Selecione a campanha'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Campanhas</SelectLabel>
                    {campanhas.map((i,index) => (
                        <SelectItem value={i.name} key={index}>{i.name}</SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <Label htmlFor="nome" className="text-right">
                Ação
              </Label>
              <Input type="text"
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
          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2 mt-6"
              type="submit"
              variant={"secondary"}
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
