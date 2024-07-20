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
import { UserRoundCheck, UserRoundPlus } from "lucide-react";

export function NovoUsuario() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2"
        variant={"secondary"}>
        <UserRoundPlus size={18} />
        Adicionar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="col-span-4">
            <Label htmlFor="username" className="text-right">
              Cliente
            </Label>
            <Input id="username" placeholder="Nome do cliente..."/>
          </div>
          <div>
            <Label htmlFor="logo">Logo</Label>
            <input id="logo"
            type="file"
            className="col-span-4"/>
          </div>
        </div>
        <DialogFooter>
          <Button className="flex items-center gap-2" type="submit" variant={'secondary'}>
          <UserRoundCheck size={18}/>
            Criar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}