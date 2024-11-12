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
import { createNewURL } from "@/interface/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifyCreateURL = z.object({
  url: z.string().url({ message: "*Digite uma URL válida." }),
});

type urlData = z.infer<typeof verifyCreateURL>;
type HandleCreateUsersProps = {
  handleCreateURL: ({ url }: createNewURL) => void;
};

type createUrlProps = {
  onCreateUrl: () => void;
};

export function NovaUrl({ onCreateUrl }: createUrlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { handleCreateURL } = useAuth() as HandleCreateUsersProps;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<urlData>({
    resolver: zodResolver(verifyCreateURL),
    defaultValues: {
      url: "https://",
    },
  });

  async function createURL(data: urlData) {
    const { url } = data;
    const newUrl = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

    try {
      await handleCreateURL({ url: newUrl });
      onCreateUrl();
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Erro ao criar url:", error);
    }
  }

  useEffect(() => {reset()}, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant={"secondary"}>
          <Link size={18} />
          Nova URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-4 border-b-[1px]">
          <DialogTitle>Nova URL</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(createURL)}>
          <div className="grid grid-cols-4 gap-4 py-4">

            <div className="relative col-span-4">
              <Label htmlFor="url" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">
                URL
              </Label>
              <Input
                id="url"
                defaultValue={`https://`}
                {...register("url")}
                className={`${errors.url && "border-rose-400"}`}
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
              <Link2 size={18} />
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
