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

export function EditarConversor() {
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
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="col-span-4">
            <Label htmlFor="url" className="text-right">
              Conversor
            </Label>
            <TextareaWithCounter maxLength={999} />
            <div>
            </div>
          </div>
              <div className="col-span-4">
                <Label>Novo Título</Label>
                <Input type="text" placeholder="..."/>
              </div>
        </div>
        <DialogFooter>
          <Button className="flex items-center gap-2" type="submit" variant={"secondary"}>
          <Pencil size={18} />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
