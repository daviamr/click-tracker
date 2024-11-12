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
import { FilePenLine, UserRoundCheck } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import {
  campaignData,
  customerData,
  DataProps,
  editLP,
} from "@/interface/auth";
import { useEffect, useState } from "react";
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { AlertMessage } from "../alert_message";

const createUserSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "*Campo obrigatório"),
  customer: z.string(),
  campaignId: z.number().min(1, "*Campo obrigatório"),
  url: z.string().min(8, "Campo obrigatório"),
});

type editLPForm = z.infer<typeof createUserSchema>;
type HandleCreateLpProps = {
  handleEditLP: ({ id, name, campaignId, url }: editLP) => void;
  data: DataProps;
};
type editLPProps = {
  id: number;
  clientName: string;
  campaignName: string;
  name: string;
  url: string;
  onEditLP: () => void;
};

export function EditarLP({
  id,
  clientName,
  campaignName,
  name,
  url,
  onEditLP,
}: editLPProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, handleEditLP } = useAuth() as HandleCreateLpProps;
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<editLPForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      id,
      name: name,
      customer: clientName,
      url: url,
    },
  });

  const handleSelectCustomerChange = (value: string) => {
    const selectedCustomer = customerData.find(
      (customer) => customer.name === value
    );
    if (selectedCustomer) {
      setClientId(selectedCustomer.id);
    }
  };

  const handleSelectCampaign = (value: string) => {
    const selectedCampaign = campanhas.find(
      (campanha) => campanha.name === value
    );
    if (selectedCampaign) {
      setValue("campaignId", selectedCampaign.id);
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

  const handleGetSingleClient = async () => {
    try {
      const response = await api.get(`/campaigns?clientId=${clientId}`, {
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
          "Não foi possível carregar o cliente, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    reset({ id, name: name, customer: clientName, url: url });
    handleSelectCustomerChange(clientName);
    handleSelectCampaign(campaignName);
    handleGetClient();
  }, [isOpen]);

  useEffect(() => {
    if (selectedCustomer) {
      handleGetSingleClient();
    }
  }, [selectedCustomer]);

  const handleGetCampaign = async () => {
    try {
      const response = await api.get(`/campaigns`, {
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
  };

  useEffect(() => {
    handleGetCampaign();
  }, [data.jwtToken]);

  async function editLP(data: editLPForm) {
    try {
      const { id, name, campaignId, url } = data;
      console.log([{
        id: id,
        name: name,
        clientId: clientId,
        campaingId: campaignId,
        url: url,
      }])
      await handleEditLP({ id, name, campaignId, url });
      onEditLP();
      setIsOpen(false);
      reset();
    } catch (error) {
      console.log("Erro: " + error);
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
        <DialogHeader className="pb-4 border-b-[1px]">
          <DialogTitle>Editar LP</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form action="" onSubmit={handleSubmit(editLP)}>
          <input type="hidden" {...register("id")} />
          <div className="grid grid-cols-4 gap-4 gap-y-6 py-4">

            <div className="relative col-span-4">
              <Label htmlFor="username" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
                Nome
              </Label>

              <Input
                id="username"
                type="text"
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

            <div className="relative col-span-4">
              <Label htmlFor="customer" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
                Cliente
              </Label>

              {/* SELECT CUSTOMER */}

              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCustomer(value);
                      handleSelectCustomerChange(value);
                    }}
                    defaultValue={clientName}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`${errors.campaignId}`}>
                      <SelectGroup>
                        <SelectLabel>Campanhas</SelectLabel>
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
              {errors.campaignId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT CAMPAIGN */}
            </div>

            <div className="relative col-span-4">
              <Label htmlFor="campanha" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
                Campanha
              </Label>

              {/* SELECT CAMPAIGN */}

              <Controller
                name="campaignId"
                control={control}
                render={() => (
                  <Select
                    onValueChange={handleSelectCampaign}
                    defaultValue={campaignName}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={`${errors.campaignId}`}>
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
                )}
              />
              {errors.campaignId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT CAMPAIGN */}
            </div>

            <div className="relative col-span-4">
              <Label htmlFor="urlFinal" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">URL final</Label>
              <Input
                id="urlFinal"
                type="text"
                defaultValue={url}
                {...register("url")}
                className={`${errors.url && "border-rose-400 bg-rose-100"}`}
              />

              {errors.url && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.url.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2"
              type="submit"
              variant={"secondary"}
              onClick={() => setIsOpen(true)}
            >
              <UserRoundCheck size={18} />
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
