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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileCheck2, FilePlus2 } from "lucide-react";
import { custom, z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { createNewCampaign, customerData, DataProps } from "@/interface/auth";
import { api } from "@/services/Api";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { AlertMessage } from "../alert_message";

// async function loadSelectOptions() {
//   const {data} = useAuth() as DataProps
//   const response = await api.get('/clients',
//     {headers: {
//     "Authorization": `Bearer ${data.jwtToken}`,
//   }})
//   return response.data
// }

const verifyCreateCampaign = z.object({
  name: z.string().min(4, "*Mínimo de 4 caracteres"),
  clientId: z.string().min(1, ''),
});

type campaignData = z.infer<typeof verifyCreateCampaign>;
type HandleCreateUsersProps = {
  handleCreateCampaign: ({ name, clientId }: createNewCampaign) => void;
  data: DataProps
};

export function NovaCampanha() {

  // GET NA API RETORNANDO OS CLIENTES
  const {data, handleCreateCampaign} = useAuth() as HandleCreateUsersProps
    const [customerData, setCustomerData] = useState<customerData[]>([]);
  
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
            "Não foi possível deletar uma conta agora, tente novamente mais tarde!",
            "error"
          );
        }
      }
    }
    handleGetUsers()
  },[])
  //FINAL GET

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<campaignData>({
    resolver: zodResolver(verifyCreateCampaign),
    defaultValues: {
      name: "",
    },
  });

  function createCampaign(data: campaignData) {
    const { name, clientId } = data;
    const idClient = customerData.find(i => i.name === clientId)?.id;
    
    console.log(data);
    if (idClient) {
      handleCreateCampaign({ name, clientId: idClient });
    } else {
      console.error('Id do cliente não encontrado.')
    }
  }

  return (
    <Dialog>
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
        <form action=""
        onSubmit={handleSubmit(createCampaign)}>
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
            <div>
              <Label htmlFor="campanhas">Cliente</Label>
              {/* SELECT CUSTOMER */}

              <Controller
              name="clientId"
              control={control}
              render={({field}) => (
              <Select onValueChange={field.onChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent
                className={`${errors.clientId}`}>
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
              {errors.clientId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT CUSTOMER */}
            </div>
          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2"
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
