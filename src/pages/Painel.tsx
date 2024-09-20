import { Grafico } from "@/components/Grafico";
import { LayoutDashboard, SlidersHorizontal } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  campaignData,
  customerData,
  dataAction,
  DataProps,
} from "@/interface/auth";
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { AlertMessage } from "@/components/alert_message";
import { useAuth } from "@/hook/Auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraficoDonut } from "@/components/GraficoDonut";
import { GraficoRegiao } from "@/components/GraficoRegiao";

const verifyFilter = z.object({
  customer: z.string(),
  campaign: z.string(),
  lps: z.string(),
  action: z.string(),
  url: z.string(),
});
type FilterProps = {
  data: DataProps;
};
type verifyFilterProps = z.infer<typeof verifyFilter>;

export function PainelPage() {
  const { data } = useAuth() as FilterProps;
  const [customer, setCustomer] = useState<customerData[]>([]);
  const [campaign, setCampaign] = useState<campaignData[]>([]);
  const [action, setAction] = useState<dataAction[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const {
    control,
    watch,
    formState: {},
  } = useForm<verifyFilterProps>({
    resolver: zodResolver(verifyFilter),
    defaultValues: {
      customer: "",
      campaign: "",
      lps: "",
      action: "",
      url: "",
    },
  });

  const clienteAssistido = watch("customer");
  const campanhaAssistida = watch("campaign");
  const lpAssistida = watch("lps");

  const handleGetCustomer = async () => {
    try {
      const response = await api.get(`/clients`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCustomer(response.data);
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
    handleGetCustomer();
  }, [selectedCustomer]);

  const handleGetCampaign = async () => {
    try {
      const response = await api.get(`/campaigns`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setCampaign(response.data);
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
  }, [selectedCampaign]);

  const handleGetAction = async () => {
    try {
      const response = await api.get(`/actions`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setAction(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as ações, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  useEffect(() => {
    handleGetAction();
  }, [selectedAction]);

  const submitCustomer = (customer: string) => {
    setSelectedCustomer(customer);
  };

  return (
    <>
      <div className="flex gap-4 justify-between mb-8">
        <div className="flex items-center gap-2">
          <LayoutDashboard size={24} />
          <h1 className="text-3xl">Dashboard</h1>
        </div>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 mb-3">
        <p className="font-semibold flex items-center gap-2 text-xl">
          <SlidersHorizontal size={18} />
          Filtros
        </p>
        <form>
          <div className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-2">
              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clientes</SelectLabel>
                        {customer.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="col-span-2">
              <Controller
                name="campaign"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCampaign(value);
                    }}
                    disabled={!clienteAssistido}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          clienteAssistido
                            ? "Campanhas"
                            : "Cliente não selecionado"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Campanhas</SelectLabel>
                        {campaign.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="col-span-2">
              <Controller
                name="lps"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    disabled={!campanhaAssistida}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          campanhaAssistida
                            ? "Selecione a LP"
                            : "Campanha não selecionada"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clientes</SelectLabel>
                        <SelectItem value="lp1">LP 1</SelectItem>
                        <SelectItem value="lp2">LP 2</SelectItem>
                        <SelectItem value="lp3">LP 3</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="col-span-2">
              <Controller
                name="action"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedAction(value);
                    }}
                    disabled={!lpAssistida}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          lpAssistida ? "Ações" : "LP não selecionada"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Ações</SelectLabel>
                        {action.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="col-span-4">
              <div>
                <Label className="font-semibold" htmlFor="urlLink">
                  URL
                </Label>
                <Input type="text" id="urlLink" placeholder="https://" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Button
              variant={"outline"}
              className="min-w-[140px]"
              type="button"
              onClick={() => submitCustomer(clienteAssistido)}
            >
              Filtrar
            </Button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-16">
        <div className="col-span-4">
          <Grafico cliente={selectedCustomer} />
        </div>
        <div className="col-span-3">
          <GraficoRegiao />
        </div>
        <div className="col-span-1">
          <GraficoDonut />
        </div>
      </div>
    </>
  );
}
