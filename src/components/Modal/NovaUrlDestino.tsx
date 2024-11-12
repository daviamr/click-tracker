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
import { Plus } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  campaignData,
  customerData,
  DataProps,
} from "@/interface/auth";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { AlertMessage } from "../alert_message";
import { useAuth } from "@/hook/Auth";

const createBaseShema = z.object({
  name: z.string().min(2, "*Mínimo de 2 caracteres"),
  url: z.string().url("*Digite uma url válida"),
  customer: z.string().min(2, "*Mínimo de 2 caracteres"),
  campaign: z.string().min(2, "*Mínimo de 2 caracteres"),
  campaignId: z.number(),
});

type createBaseProps = z.infer<typeof createBaseShema>;

type createNewBaseProps = {
  handleGetFinalURL: () => void;
};
type HandleCreateUrl = {
  data: DataProps;
};

export function NovaUrlDestino({ handleGetFinalURL }: createNewBaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useAuth() as HandleCreateUrl;
  const { handleCreateFinalURL } = useAuth();
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<createBaseProps>({
    resolver: zodResolver(createBaseShema),
    defaultValues: {
      name: "",
      url: "https://",
      customer: "",
      campaign: "",
    },
  });

  const handleGetCustomer = async () => {
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
          "Não foi possível buscar os clientes, tente novamente mais tarde!",
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
    handleGetCustomer();
  }, [data.jwtToken]);

  useEffect(() => {
    console.log(selectedCustomer);
    if (selectedCustomer) {
      handleGetSingleClient();
    }
  }, [selectedCustomer]);

  useEffect(() => {
    reset();
  }, [isOpen]);

  const handleSelectCampaign = (value: string) => {
    const selectedCampaign = campanhas.find(
      (campanha) => campanha.name === value
    );
    if (selectedCampaign) {
      setValue("campaignId", selectedCampaign.id);
      console.log(`id da campanha: ${selectedCampaign.id}`);
    }
  };

  const handleSelectCustomerChange = (value: string) => {
    const selectedCustomer = customerData.find(
      (customer) => customer.name === value
    );
    if (selectedCustomer) {
      setClientId(selectedCustomer.id);
    }
  };

  async function createBase(data: createBaseProps) {
    try {
      const { name, url, campaign } = data;
      const campanhaEncontrada = campanhas.find((c) => c.name === campaign);

      if (campanhaEncontrada) {
        const idCampanha = campanhaEncontrada.id;
        await handleCreateFinalURL({ name, url, campaignId: idCampanha });
        handleGetFinalURL();
        setIsOpen(false);
        reset();
      } else {
        console.log("Campanha não encontrada.");
      }
    } catch (error) {
      console.log("Erro ao criar base:", error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant={"secondary"}>
          <Plus size={18} />
          Cadastrar URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-4 border-b-[1px]">
          <DialogTitle>Cadastrar URL de destino</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(createBase)}>
          <div className="grid grid-cols-4 gap-4 gap-y-6 py-4">

            <div className="relative col-span-4">
              <Label htmlFor="name" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Nome da base..."
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
              <Label htmlFor="destinationUrl" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
                URL de destino
              </Label>
              <Input
                id="destinationUrl"
                type="url"
                defaultValue={`https://`}
                {...register("url")}
                className={`${errors.url && "border-rose-400 bg-rose-100"}`}
              />
              {errors.url && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.url.message}
                </span>
              )}
            </div>

            <div className="relative col-span-4">
              <Label htmlFor="campanhas" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">Cliente</Label>
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
                    <SelectContent className={`${errors.customer}`}>
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
              {errors.customer && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT CAMPAIGN */}
            </div>

            <div className="relative col-span-4">
              <Label htmlFor="campanhas" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">Campanha</Label>
              {/* SELECT CAMPAIGN */}

              <Controller
                name="campaign"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleSelectCampaign(value);
                    }}
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
              {errors.campaign && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT CAMPAIGN */}
            </div>

          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2"
              type="submit"
              variant={"secondary"}
              onClick={() => setIsOpen(true)}
            >
              <Plus size={18} />
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
