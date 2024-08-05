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
import { Pencil } from "lucide-react";
import TextareaWithCounter from "../ContadorCaracteres";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { editConversor } from "@/interface/auth";
import { useAuth } from "@/hook/Auth";
import { useEffect } from "react";

const verifyEditConversor = z.object({
  id: z.number(),
  name: z.string().min(4, "*Mínimo de 4 caracteres."),
  characters: z.string().min(8, "*Mínimo de 8 caracteres."),
});

type conversorData = z.infer<typeof verifyEditConversor>;
type HandleCreateUsersProps = {
  handleEditConversor: ({ id, name, characters }: editConversor) => void;
};

export function EditarConversor({id, name, characters,} : {id: number; name: string; characters: string;}) {
  const { handleEditConversor } = useAuth() as HandleCreateUsersProps;
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
  } = useForm<conversorData>({
    resolver: zodResolver(verifyEditConversor),
    defaultValues: {
      id,
      name: "",
      characters: "",
    },
  });
  const charactersValue = watch("characters");

  function editConversor(data: conversorData) {
    console.log(data);
    const { id, name, characters } = data;
    handleEditConversor({ id, name, characters });
  }

  useEffect(() => {
    reset({ id, name: "", characters: ""});
  }, [id, reset]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-2" variant={"outline"}>
          <Pencil size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Conversor</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form action="" onSubmit={handleSubmit(editConversor)}>
        <input type="hidden"
          value={id}
          {...register("id")}/>
          <div className="grid grid-cols-4 gap-4 py-4">
            <div className="col-span-4">
              <Label htmlFor="url" className="text-right">
                Conversor
              </Label>
              <TextareaWithCounter
                maxLength={999}
                value={charactersValue}
                placeholder={characters}
                onChange={(e) => {
                  setValue("characters", e.target.value);
                }}
              />
              {errors.characters && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.characters.message}
                </span>
              )}
              <div></div>
            </div>
            <div className="col-span-4">
              <Label>Novo Título</Label>
              <Input
                type="text"
                placeholder={name}
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
              <Pencil size={18} />
              Editar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
