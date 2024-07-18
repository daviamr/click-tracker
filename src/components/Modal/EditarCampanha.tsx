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
import { FilePenLine } from "lucide-react";
import { SelectCliente } from "../SelectClient";

export function EditarCampanha() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-2" variant={"outline"}>
        <FilePenLine size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Campanha</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="col-span-4">
            <Label htmlFor="nome" className="text-right">
              Nome
            </Label>
            <Input id="nome" placeholder="Nome da campanha..."/>
          </div>
          <div>
            <Label htmlFor="campanhas">Cliente</Label>
            <SelectCliente/>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" variant={'secondary'}>Editar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}