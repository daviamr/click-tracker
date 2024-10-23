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

type createLPForm = z.infer<typeof createUserSchema>;
type HandleCreateLpProps = {
  handleEditLP: ({id, name, campaignId, url }: editLP) => void;
  data: DataProps;
};
type editLPProps = {
  id: number;
  name: string;
  url: string;
  onEditLP: () => void;
};

export function EditarLP({id, name, url, onEditLP }: editLPProps) {
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
  } = useForm<createLPForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      id,
      name: name,
      customer: "",
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
      console.log(`id da campanha: ${selectedCampaign.id}`);
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
    reset({id, name: name, url: url})
    handleGetClient();
  }, [isOpen]);

  useEffect(() => {
    console.log(selectedCustomer);
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

  async function createLP(data: createLPForm) {
    try {
      console.log(data);
      const {id, name, campaignId, url } = data;
      await handleEditLP({id, name, campaignId, url });
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
        <DialogHeader>
          <DialogTitle>Editar LP</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form action="" onSubmit={handleSubmit(createLP)}>
          <input type="hidden" {...register('id')} />
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="username" className="text-right">
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

            <div className="col-span-4">
              <Label htmlFor="customer" className="text-right">
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
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

            <div className="col-span-4">
              <Label htmlFor="campanha" className="text-right">
                Campanha
              </Label>

              {/* SELECT CAMPAIGN */}

              <Controller
                name="campaignId"
                control={control}
                render={() => (
                  <Select
                    onValueChange={handleSelectCampaign}
                    disabled={!selectedCustomer}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedCustomer
                            ? "Selecione a campanha"
                            : "Cliente não selecionado"
                        }
                      />
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
            <div className="col-span-4">
              <Label htmlFor="urlFinal">URL final</Label>
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