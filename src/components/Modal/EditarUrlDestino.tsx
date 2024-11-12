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
import { FilePenLine, Plus } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { campaignData, customerData, DataProps } from "@/interface/auth";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { AlertMessage } from "../alert_message";
import { useAuth } from "@/hook/Auth";

const createBaseShema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  customer: z.string(),
  campaign: z.string(),
  campaignId: z.number(),
});

type editFinalUrl = z.infer<typeof createBaseShema>;

type editFinalUrlProps = {
  id: number;
  name: string;
  url: string;
  client: string;
  campaign: string;
  handleGetFinalURL: () => void;
};
type HandleEditUrl = {
  data: DataProps;
};

export function EditarUrlDestino({
  id,
  name,
  url,
  client,
  campaign,
  handleGetFinalURL,
}: editFinalUrlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useAuth() as HandleEditUrl;
  const { handleEditFinalUrl } = useAuth();
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
  } = useForm<editFinalUrl>({
    resolver: zodResolver(createBaseShema),
    defaultValues: {
      name: name,
      url: url,
      customer: client,
      campaign: campaign,
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

  const handleSelectCustomerChange = (value: string) => {
    const selectedCustomer = customerData.find(
      (customer) => customer.name === value
    );
    if (selectedCustomer) {
      setClientId(selectedCustomer.id);
      setSelectedCustomer(selectedCustomer.id)
    }
  };

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
    selectedCustomer && handleGetSingleClient();
  }, [selectedCustomer]);

  useEffect(() => {
    reset({ id, name: name, url: url, customer: client, campaign: campaign });
    handleSelectCustomerChange(client);
    handleSelectCampaign(campaign);
  }, [isOpen]);

  async function editUrlDestino(data: editFinalUrl) {
    try {
      const { id, name, url, campaign } = data;
      const campanhaEncontrada = campanhas.find((c) => c.name === campaign);

      if (campanhaEncontrada) {
        const idCampanha = campanhaEncontrada.id;
        console.log({ id: id, name: name, url: url, campaignId: idCampanha });
        await handleEditFinalUrl({ id, name, url, campaignId: idCampanha });
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
        <Button className="p-2" variant={"outline"}>
          <FilePenLine size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-4 border-b-[1px]">
          <DialogTitle>Editar URL de destino</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(editUrlDestino)}>
          <input type="hidden" {...register("id")} />
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
                placeholder="https://"
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
                    defaultValue={client}
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
                    defaultValue={campaign}
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
