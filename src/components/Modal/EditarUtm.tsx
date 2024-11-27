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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePenLine, Plus } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { createUTM } from "@/interface/auth";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";

const createUserSchema = z.object({
  title: z.string().min(1),
  utm: z.string().min(1),
  key: z.string().min(1),
  obs: z.string()
});

type createUserForm = z.infer<typeof createUserSchema>;
type HandleCreateUsersProps = {
  handleCreateUTM: ({ title }: createUTM) => void;
};
type createUserProps = {
  onCreateUTM: () => void;
};

export function EditarUtm({ onCreateUTM }: createUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { handleCreateUTM } = useAuth() as HandleCreateUsersProps;
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<createUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      title: "",
      utm: ''
    },
  });
  const [utmSelected, setUtmSelected] = useState<string>('');

  async function createUser(data: createUserForm) {
    try {
      const { title } = data;
      await handleCreateUTM({ title });
      console.log(data)
      onCreateUTM();
      setIsOpen(false);
      reset();
    } catch (error) {
      console.log("Erro ao criar usuário:", error);
    }
  }

  const handleSelectedUtm = (value: string) => {
    const utmAtual = value;
    setValue('utm', utmAtual);
    setUtmSelected(utmAtual);
    console.log(utmAtual);
  }

  useEffect(() => { reset() }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="p-2" variant={"outline"}>
          <FilePenLine size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-4 border-b-[1px]">
          <DialogTitle>Editar UTM</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(createUser)}>
          <div className="grid grid-cols-4 gap-4 gap-y-6 py-4">

            <div className="relative col-span-4">
              <Label htmlFor="username" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                Source
              </Label>

              <Input
                id="username"
                type="text"
                placeholder="Digite o nome da source"
                {...register("title")}
                className={`${errors.title && "border-rose-400"}`}
              />
            </div>

            <div className="relative col-span-4">
              <Label htmlFor="username" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                UTM
              </Label>

              <Controller
                name="utm"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleSelectedUtm(value);
                    }}
                  >
                    <SelectTrigger
                      className={`${errors.utm && "border-rose-400"}`}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>UTMs</SelectLabel>
                        <SelectItem value="utm_source">utm_source</SelectItem>
                        <SelectItem value="utm_medium">utm_medium</SelectItem>
                        <SelectItem value="utm_campaign">utm_campaign</SelectItem>
                        <SelectItem value="utm_turn">utm_turn</SelectItem>
                        <SelectItem value="utm_content">utm_content</SelectItem>
                        <SelectItem value="utm_term">utm_term</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="relative col-span-4">
              <Label htmlFor="username" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold z-10">
                Chave
              </Label>

              <Input
                id="username"
                type="text"
                placeholder={!utmSelected ? 'Selecione uma UTM' : 'Digite a chave da UTM'}
                {...register("key")}
                className={`${errors.title && "border-rose-400"}`}
                disabled={!utmSelected}
              />
            </div>

            <div className="relative col-span-4">
              <Label htmlFor="observacao" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold rounded-sm">Observação</Label>
              <Textarea
                id="observacao"
                placeholder="Digite uma observação, campo não obrigatório"
                className="pt-3"
                {...register("obs")}
              />
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