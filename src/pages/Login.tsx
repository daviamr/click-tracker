import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { Login } from "@/interface/auth";
import { AtSign, LogIn, RectangleEllipsis } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "*Campo obrigatório").email("E-mail invalido."),
  password: z.string().min(4, "A senha deve ter no mínimo 4 caracteres"),
});

type login = z.infer<typeof loginSchema>;
type HandleLogin = {
  signIn: ({ email, password }: Login) => void;
};

export function LoginPage() {
  const { signIn } = useAuth() as HandleLogin;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleSignIn(data: login) {
    console.log(data);
    const { email, password } = data;
    signIn({ email, password });
  }
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#0c0f01] to-[#0a0a0a]">
        <form onSubmit={handleSubmit(handleSignIn)}>
          <div className="flex flex-col gap-16">
            <p className={`text-4xl relative z-10 w-max m-auto font-bold text-white`}>
              <span className="absolute w-[230px] h-5 bg-[#799b09] z-[-1] left-[-8px] bottom-0"></span>
              LinkTracker
            </p>

            <div className="flex flex-col gap-4">
              <h1 className="font-semibold text-center text-white">
                Faça seu login abaixo
              </h1>
              <div className="relative min-w-[300px]">
                <Input
                  type="email"
                  id="login"
                  placeholder="Digite seu email"
                  autoComplete="email"
                  {...register("email")}
                  className={`pl-10 py-5 text-[15px] bg-transparent text-white ${
                    errors.email && "border-rose-400 bg-rose-100"
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-rose-400 font-normal text-left">
                    {errors.email.message}
                  </span>
                )}
                <AtSign
                  className="absolute top-3 left-3 opacity-50 text-white"
                  size={20}
                />
              </div>
              <div className="relative">
                <Input
                  type="password"
                  id="senha"
                  placeholder="Digite sua senha"
                  {...register("password")}
                  className={`pl-10 py-5 text-[15px] bg-transparent text-white ${
                    errors.email && "border-rose-400 bg-rose-100"
                  }`}
                />

                {errors.password && (
                  <span className="text-xs text-rose-400 font-normal text-left">
                    {errors.password.message}
                  </span>
                )}
                <RectangleEllipsis
                  className="absolute top-3 left-3 opacity-50 text-white"
                  size={20}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button variant={"outline"} className="flex gap-2 mt-10 mb-10 px-14 w-max">
              Entrar
              <LogIn size={20}/>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
