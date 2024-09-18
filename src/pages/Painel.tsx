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
  urlData,
} from "@/interface/auth";
import { api } from "@/services/Api";
import { AxiosError } from "axios";
import { AlertMessage } from "@/components/alert_message";
import { useAuth } from "@/hook/Auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectLP } from "@/components/SelectLP";
import { Button } from "@/components/ui/button";

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
  const [url, setUrl] = useState<urlData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const {
    control,
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

  const handleGetUrl = async () => {
    try {
      const response = await api.get(`/base-url`, {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setUrl(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar as URLs, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };
  useEffect(() => {
    handleGetUrl();
  }, [selectedUrl]);

  return (
    <>
      <div className="flex gap-4 justify-between mb-8">
        <div className="flex items-center gap-2">
          <LayoutDashboard size={24} />
          <h1 className="text-3xl">Dashboard</h1>
        </div>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 mb-3">
      <p className="font-semibold flex items-center gap-2 mb-3 text-xl">
        <SlidersHorizontal size={18}/>
        Filtros
      </p>
        <form>
          <div className="grid grid-cols-10 gap-2">
            <div className="col-span-2">
              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCustomer(value);
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Campanhas" />
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
              <SelectLP />
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ações" />
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
            <div className="col-span-2">
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedUrl(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="URLs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>URLs</SelectLabel>
                        {url.map((i, index) => (
                          <SelectItem value={i.url} key={index}>
                            {i.url}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Button variant={"outline"} className="min-w-[140px]" type="button">
              Filtrar
            </Button>
          </div>
        </form>
      </div>
      <Grafico cliente={selectedCustomer}/>
    </>
  );
}
