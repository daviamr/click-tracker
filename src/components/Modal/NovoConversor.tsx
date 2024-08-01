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
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import TextareaWithCounter from "../ContadorCaracteres";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { createNewConversor } from "@/interface/auth";

const verifyCreateConversor = z.object({
  name: z.string().min(4, '*Mínimo de 4 caracteres.'),
  characters: z.string().min(8, '*Mínimo de 8 caracteres.'),
});

type conversorData = z.infer<typeof verifyCreateConversor>;
type HandleCreateUsersProps = {
  handleCreateConversor: ({ name, characters }: createNewConversor) => void;
};

export function NovoConversor() {
  const { handleCreateConversor } = useAuth() as HandleCreateUsersProps;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<conversorData>({
    resolver: zodResolver(verifyCreateConversor),
    defaultValues: {
      name: "",
      characters: ""
    },
  });

  function createConversor(data: conversorData) {
    const { name, characters } = data;
    console.log(data);
    handleCreateConversor({ name, characters });
  }

  const charactersValue = watch("characters");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant={"secondary"}>
          <Plus size={18} />
          Novo Conversor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Conversor</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(createConversor)}>
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="characters" className="text-right">
                Conversor
              </Label>
              <TextareaWithCounter
                maxLength={999}
                value={charactersValue}
                onChange={(e) => {
                  setValue('characters', e.target.value);
                }}
              />
              {errors.characters && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.characters.message}
                </span>
              )}
            </div>
            <div className="col-span-4">
              <Label>Título</Label>
              <Input
                type="text"
                placeholder="..."
                {...register("name")}
                className={`${errors.name && "border-rose-400"}`}
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