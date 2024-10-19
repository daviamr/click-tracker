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
import { UserRoundCheck, UserRoundPen } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { EditNewUser } from "@/interface/auth";
import { useEffect, useState } from "react";

const createUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "*Campo obrigatório"),
  email: z.string().min(1, "*Campo obrigatório").email("E-mail invalido."),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type editUserForm = z.infer<typeof createUserSchema>;
type HandleEditUserProps = {
  handleEditUser: ({ id, email, name, password }: EditNewUser) => void;
};

type editUserProps = {
  id: string;
  name: string;
  email: string;
  onEditUser: () => void;
};

export function EditarUsuario({
  id,
  name,
  email,
  onEditUser,
}: editUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { handleEditUser } = useAuth() as HandleEditUserProps;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<editUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      id: id,
      email: email,
      name: name,
    },
  });

  useEffect(() => {reset({id: id, name: name, email: email, password: ''})}, [isOpen]);

  async function createUser(data: editUserForm) {
    try {
      const {id, name, email, password } = data;
      await handleEditUser({id, name, email, password });
      onEditUser();
      setIsOpen(false);
      reset();
    } catch(error) {
      console.log('Erro:', error)
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
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form action="" onSubmit={handleSubmit(createUser)}>
          <input type="hidden" {...register('id')}/>
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="username" className="text-right">
                Nome
              </Label>

              <Input
                id="username"
                type="text"
                {...register("name")}
                className={`${errors.name && "border-rose-400 bg-rose-100"}`}
              />

              {errors.name && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="password" className="text-right">
                Senha
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Nova senha..."
                {...register("password")}
                className={`${
                  errors.password && "border-rose-400 bg-rose-100"
                }`}
              />

              {errors.password && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="col-span-4">
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                defaultValue={email}
                {...register("email")}
                className={`${errors.email && "border-rose-400 bg-rose-100"}`}
              />

              {errors.email && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.email.message}
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
