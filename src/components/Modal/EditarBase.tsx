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
import { Plus, UserRoundPen } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useAuth } from "@/hook/Auth";

const editBaseShema = z.object({
  id: z.number(),
  name: z.string().min(2, "*Mínimo de 2 caracteres"),
  url: z.string().url("*Digite uma url válida"),
});

type editBaseDate = {
  id: number;
  name: string;
  url: string;
  handleGetBase: () => void;
};

type editBaseProps = z.infer<typeof editBaseShema>;

export function EditarBase({ id, name, url, handleGetBase }: editBaseDate) {
  const [isOpen, setIsOpen] = useState(false);
  const { handleEditBase } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<editBaseProps>({
    resolver: zodResolver(editBaseShema),
    defaultValues: {
      id: id,
      name: name,
      url: url,
    },
  });

  useEffect(() => {
    reset({ id: id, name: name, url: url });
  }, [isOpen]);

  async function createBase(data: editBaseProps) {
    try {
      const { name, url } = data;
      await handleEditBase({ id, name, url});
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
        <Button className="p-2" variant={"outline"}>
          <UserRoundPen size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar base</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(createBase)}>
          <input type="hidden" {...register('id')}/>
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
              Editar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
