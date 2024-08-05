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
import { editURL } from "@/interface/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifyCreateURL = z.object({
  id: z.number(),
  url: z.string().url({message: '*Digite uma URL válida.'}),
});

type urlData = z.infer<typeof verifyCreateURL>;
type HandleCreateUsersProps = {
  handleEditURL: ({ id, url }: editURL) => void;
};

export function EditarUrl({id, url} : {id: number, url: string}) {

  const { handleEditURL } = useAuth() as HandleCreateUsersProps;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<urlData>({
    resolver: zodResolver(verifyCreateURL),
    defaultValues: {
      url: ""
    },
  });

  function editURL(data: urlData) {
    console.log(data);
    const { id, url } = data;
    handleEditURL({ id, url });
  }

  useEffect(() => {
    reset({ id, url: ""});
  }, [id, reset]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-2"
        variant={"outline"}>
        <Pencil size={18}/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar URL</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form action="" onSubmit={handleSubmit(editURL)}>
        <input type="hidden"
          value={id}
          {...register("id")}/>
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="col-span-4">
            <Label htmlFor="url" className="text-right">
                Nova URL
            </Label>
            <Input
            id="url"
            placeholder={url}
            {...register('url')}
            className={`${errors.url && "border-rose-400 bg-rose-100"}`}
              />
              {errors.url && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.url.message}
                </span>)}
          </div>
        </div>
        <DialogFooter>
          <Button className="flex items-center gap-2" type="submit" variant={'secondary'}>
          <Pencil size={18}/>
            Editar
            </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}