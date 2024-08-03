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

const verifyCreateCustomer = z.object({
  image: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, { message: "*Campo obrigatório" }),
  name: z.string().min(4, "O nome deve ter no mínimo 4 caracteres"),
});

type customerData = z.infer<typeof verifyCreateCustomer>;
type HandleCreateUsersProps = {
  handleCreateCustomers: ({ image, name }: createNewCustomer) => void;
};

export function NovoCliente() {
  const { handleCreateCustomers } = useAuth() as HandleCreateUsersProps;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<customerData>({
    resolver: zodResolver(verifyCreateCustomer),
    defaultValues: {
      name: ""
    },
  });

  function createCustomer(data: customerData) {
    const { image, name } = data;
    console.log(data);
    handleCreateCustomers({ image: image[0], name });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant={"secondary"}>
          <UserRoundPlus size={18} />
          Adicionar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form action="" onSubmit={handleSubmit(createCustomer)}>
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="customer" className="text-right">
                Cliente
              </Label>
              <Input
                id="customer"
                type="text"
                placeholder="Nome do cliente..."
                {...register("name")}
                className={`${
                  errors.name && "border-rose-400 bg-rose-100"
                }`}
              />
              {errors.name && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="logo">Logo</Label>
              <input
                id="logo"
                type="file"
                {...register("image")}
                className={`${
                  errors.image && "border-rose-400 bg-rose-100"
                }"col-span-4"`}
              />
              {errors.image && (
                <span className="text-xs text-rose-400 font-normal">
                  {typeof errors.image.message === "string" ? errors.image.message : "Campo obrigatório"}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2"
              type="submit"
              variant={"secondary"}
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
