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
import { useAuth } from "@/hook/Auth";
import { editCustomer } from "@/interface/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifyEditCustomer = z.object({
  id: z.string(),
  image: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, { message: "*Campo obrigatório" }),
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
});

type dataEditCustomer = z.infer<typeof verifyEditCustomer>;
type HandleCreateUsersProps = {
  handleEditCustomer: ({ id, image, name }: editCustomer) => void;
};
type editClientProps = {
  id: string;
  name: string;
  onEditClient: () => void;
}

export function EditarCliente({ id, name, onEditClient }: editClientProps) {
  const { handleEditCustomer } = useAuth() as HandleCreateUsersProps;
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<dataEditCustomer>({
    resolver: zodResolver(verifyEditCustomer),
    defaultValues: {
      name: ""
    },
  });

  useEffect(() => {
    reset({id, name: ''});
  }, [id, reset])

  async function editCustomer(data: dataEditCustomer) {
    const { id, image, name } = data;
    try {
      await handleEditCustomer({ id, image: image[0], name });
      onEditClient();
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao editar cliente:", error);
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="p-2" variant={"outline"}>
          <UserRoundPen size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form action="" onSubmit={handleSubmit(editCustomer)}>
          <input type="hidden"
          value={id}
          {...register("id")}/>
          <div className="grid grid-cols-4 gap-4 py-4">
            <div>
              <Label htmlFor="logo">Logo</Label>
              <input
              id="logo"
              type="file"
              {...register("image")}
                className={`col-span-4${
                  errors.image && "border-rose-400 bg-rose-100"
                }"col-span-4"`}
              />
              {errors.image && (
                <span className="text-xs text-rose-400 font-normal">
                  {typeof errors.image.message === "string" ? errors.image.message : "Campo obrigatório"}
                </span>
              )}
            </div>
            <div className="col-span-4">
              <Label htmlFor="username" className="text-right">
                Cliente
              </Label>
              <Input
              id="username"
              type="text"
              placeholder={name}
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
          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2"
              type="submit"
              variant={"secondary"}
              onClick={() => setIsOpen(true)}
            >
              <UserRoundPen size={18} />
              Editar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
