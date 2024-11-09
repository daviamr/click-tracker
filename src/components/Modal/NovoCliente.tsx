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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundCheck, UserRoundPlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { createNewCustomer } from "@/interface/auth";
import { useState } from "react";
import { TooltipTracker } from "../TooltipTracker";

const verifyCreateCustomer = z.object({
  image: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "*Campo obrigatório",
    }),
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
});

type customerData = z.infer<typeof verifyCreateCustomer>;
type HandleCreateUsersProps = {
  handleCreateCustomers: ({ image, name }: createNewCustomer) => void;
};
type createClientProps = {
  onCreateClient: () => void;
};

export function NovoCliente({ onCreateClient }: createClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { handleCreateCustomers } = useAuth() as HandleCreateUsersProps;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<customerData>({
    resolver: zodResolver(verifyCreateCustomer),
    defaultValues: {
      image: "",
      name: "",
    },
  });

  async function createCustomer(data: customerData) {
    const { image, name } = data;
    console.log(data);
    try {
      await handleCreateCustomers({ image: image[0], name });
      onCreateClient();
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant={"secondary"}>
          <UserRoundPlus size={18} />
          Cadastrar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-4 border-b-[1px]">
          <DialogTitle>Cadastrar Cliente</DialogTitle>
          <DialogDescription>
            Preencha o nome do cliente e selecione um logo para fundo branco.
            Formatos permitidos X,Y, Z. Peso máximo do arquivo 200 kb. Este logo
            será renderizado na página de transição e redirecionamento após
            click do usuário final.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(createCustomer)}>
          <div className="grid grid-cols-4 gap-4 gap-y-6 py-4">

            <div className="relative col-span-4">
              <Label htmlFor="customer" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                Cliente
              </Label>
              <Input
                id="customer"
                type="text"
                placeholder="Nome do cliente..."
                {...register("name")}
                className={`${errors.name && "border-rose-400"}`}
              />
              {errors.name && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="relative col-span-4 flex flex-col gap-1">
                <Label htmlFor="logo" className="absolute px-2 bg-background -top-3 left-1 text-xs font-semibold rounded-sm">Logo</Label>
              <input
                id="logo"
                type="file"
                {...register("image")}
                className={`border border-input rounded-md pt-1 ${
                  errors.image && "border-rose-400"
                }"col-span-4"`}
              />
              {errors.image && (
                <span className="text-xs text-rose-400 font-normal">
                  {typeof errors.image.message === "string"
                    ? errors.image.message
                    : "Campo obrigatório"}
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
