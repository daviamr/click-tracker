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
import { Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useAuth } from "@/hook/Auth";

const createBaseShema = z.object({
  name: z.string().min(2, "*Mínimo de 2 caracteres"),
  url: z.string().url("*Digite uma url válida"),
});

type createBaseProps = z.infer<typeof createBaseShema>;

type baseProps = {
  handleGetBase: () => void;
} 

export function NovaBase({handleGetBase}: baseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {handleCreateBase} = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createBaseProps>({
    resolver: zodResolver(createBaseShema),
    defaultValues: {
      name: "",
      url: "https://",
    },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);
  

  async function createBase(data: createBaseProps) {
    try {
      const { name, url } = data;
      await handleCreateBase({name, url});
      handleGetBase();
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
          Cadastrar base
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-4 border-b-[1px]">
          <DialogTitle>Nova base</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(createBase)}>
          <div className="grid grid-cols-4 gap-4 gap-y-6 py-4">

            <div className="relative col-span-4">
              <Label htmlFor="name" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
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

            <div className="relative col-span-4">
              <Label htmlFor="link" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
                Link
              </Label>
              <Input
                id="link"
                type="url"
                defaultValue={`https://`}
                {...register("url")}
                className={`${errors.url && "border-rose-400 bg-rose-100"}`}
              />
              {errors.url && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.url.message}
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
              <Plus size={18} />
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
