import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from 'zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { Login } from "@/interface/auth";

const loginSchema = z.object({
  email: z.string().min(1, "*Campo obrigatório").email("E-mail invalido."),
  password: z.string().min(4, "A senha deve ter no mínimo 4 caracteres")
});

type login = z.infer<typeof loginSchema>;
type HandleLogin = {
  signIn: ({
    email,
    password
  }: Login) => void;
};

export function LoginPage() {
  const {signIn} = useAuth() as HandleLogin;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });
  
    function handleSignIn(data: login) {
      console.log(data)
      const {email, password} = data
      signIn({email, password})
    }
  return (
    <>
      <div className="flex justify-center items-center h-100 min-h-screen">
        <form action="" onSubmit={handleSubmit(handleSignIn)}>
          <div className="bg-transparent rounded-md border border-input px-20 pt-10 text-right">
            <div className="flex flex-col gap-4">
              <h1 className="text-center text-3xl mb-6">Login</h1>
              <div>
                <Input
                  type="email"
                  id="login"
                  placeholder="Digite seu email"
                  {...register("email")}
                  className={`${errors.email && "border-rose-400 bg-rose-100"}`}
                ></Input>

                {errors.email && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.email.message}
                </span>
              )}
              </div>
              <div>
                <Input
                  type="password"
                  id="senha"
                  placeholder="Digite sua senha"
                  {...register("password")}
                  className={`${errors.password && "border-rose-400 bg-rose-100"}`}
                ></Input>

                {errors.password && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.password.message}
                </span>
              )}
              </div>
            </div>
            <Button
            variant={"outline"}
            className="mt-10 mb-10 w-full">
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
