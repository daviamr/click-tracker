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
import { UserRoundPen } from "lucide-react";

export function EditarUsuario() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-2" variant={"outline"}>
          <UserRoundPen size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <div>
            <Label htmlFor="logo">Logo</Label>
            <input id="logo" type="file" className="col-span-4" />
          </div>
          <div className="col-span-4">
            <Label htmlFor="username" className="text-right">
              Cliente
            </Label>
            <Input id="username"  placeholder="Nome do cliente..."/>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" variant={'secondary'}>Editar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}