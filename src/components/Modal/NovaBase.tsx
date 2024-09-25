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

const createBaseShema = z.object({
  name: z.string().min(2, "*Mínimo de 2 caracteres"),
  link: z.string().url("*Digite uma url válida"),
});

type createBaseProps = z.infer<typeof createBaseShema>;

export function NovaBase() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createBaseProps>({
    resolver: zodResolver(createBaseShema),
    defaultValues: {
      name: "",
      link: "",
    },
  });

  useEffect(() => {!isOpen && reset({name: '', link: ''})}, [isOpen])

  async function createBase(data: createBaseProps) {
    try {
      const { name, link } = data;
      console.log(name && name);
      console.log(link && link);
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
        <DialogHeader>
          <DialogTitle>Nova base</DialogTitle>
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
              <Label htmlFor="link" className="text-right">
                Link
              </Label>
              <Input
                id="link"
                type="url"
                placeholder="https://"
                {...register("link")}
                className={`${errors.link && "border-rose-400 bg-rose-100"}`}
              />
              {errors.link && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.link.message}
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
