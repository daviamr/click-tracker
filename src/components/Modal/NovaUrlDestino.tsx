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
import { customerData, DataProps } from "@/interface/auth";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { AlertMessage } from "../alert_message";
import { useAuth } from "@/hook/Auth";

const createBaseShema = z.object({
  name: z.string().min(2, "*Mínimo de 2 caracteres"),
  destinationUrl: z.string().url("*Digite uma url válida"),
  customer: z.string().min(2, "*Mínimo de 2 caracteres"),
  campaign: z.string().min(2, "*Mínimo de 2 caracteres"),
});

type createBaseProps = z.infer<typeof createBaseShema>;

type HandleCreateUrl = {
    data: DataProps;
  };

export function NovaUrlDestino() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useAuth() as HandleCreateUrl;
  const [customerData, setCustomerData] = useState<customerData[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<createBaseProps>({
    resolver: zodResolver(createBaseShema),
    defaultValues: {
      name: "",
      destinationUrl: "",
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

  useEffect(() => {handleGetCustomer()}, [data.jwtToken])

  useEffect(() => {
    !isOpen &&
      reset({ name: "", destinationUrl: "", customer: "", campaign: "" });
  }, [isOpen]);

  async function createBase(data: createBaseProps) {
    try {
      const { name, destinationUrl, customer, campaign } = data;
      console.log(name && name);
      console.log(destinationUrl && destinationUrl);
      console.log(customer && customer);
      console.log(campaign && campaign);
      setIsOpen(false);
      reset();
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
        <DialogHeader>
          <DialogTitle>Cadastrar URL de destino</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(createBase)}>
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="name" className="text-right">
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

            <div className="col-span-4">
              <Label htmlFor="destinationUrl" className="text-right">
                URL de destino
              </Label>
              <Input
                id="destinationUrl"
                type="url"
                placeholder="https://"
                {...register("destinationUrl")}
                className={`${
                  errors.destinationUrl && "border-rose-400 bg-rose-100"
                }`}
              />
              {errors.destinationUrl && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.destinationUrl.message}
                </span>
              )}
            </div>
            <div className="col-span-4">
              <Label htmlFor="campanhas">Cliente</Label>
              {/* SELECT CUSTOMER */}

              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
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
              {/* FINAL SELECT CUSTOMER */}
            </div>
            <div className="col-span-4">
              <Label htmlFor="campanhas">Campanha</Label>
              {/* SELECT CUSTOMER */}

              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
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
              {/* FINAL SELECT CUSTOMER */}
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
