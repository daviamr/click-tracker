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
import { z } from 'zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { CreateNewUser } from "@/interface/auth";
import { useState } from "react";

const createUserSchema = z.object({
  name: z.string().min(1, "*Campo obrigatório"),
  email: z.string().min(1, "*Campo obrigatório").email("E-mail invalido."),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type createUserForm = z.infer<typeof createUserSchema>;
type HandleCreateUsersProps = {
  handleCreateUsers: ({
    email,
    name,
    password,
  }: CreateNewUser) => void;
};

export function NovoUsuario() {
  const [isOpen, setIsOpen] = useState(false);
  const {handleCreateUsers} = useAuth() as HandleCreateUsersProps;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  function createUser(data: createUserForm) {
    console.log(data)
    const {name, email, password} = data
    handleCreateUsers({name, email, password})
    setIsOpen(false);
    reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2"
        variant={"secondary"}>
        <UserRoundPlus size={18} />
        Criar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form action="" onSubmit={handleSubmit(createUser)}>
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="col-span-2">

            <Label htmlFor="username" className="text-right">
              Nome
            </Label>

            <Input id="username" type="text" placeholder="Nome do usuário..."
            {...register("name")}
            className={`${errors.name && "border-rose-400 bg-rose-100"}`}/>

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

            <Input id="password" type="password" placeholder="Senha do usuário..." {...register("password")}
            {...register("password")}
            className={`${errors.password && "border-rose-400 bg-rose-100"}`}/>

            {errors.password && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.password.message}
                </span>
              )}

          </div>
          <div className="col-span-4">

            <Label htmlFor="email">E-mail</Label>
            <Input type="email" placeholder="usuaro@email.com" {...register("email")}
            {...register("email")}
            className={`${errors.email && "border-rose-400 bg-rose-100"}`}/>

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
          variant={'secondary'}
          onClick={() => setIsOpen(true)}>
          <UserRoundCheck size={18}/>
            Criar
            </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}