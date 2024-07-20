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

export function NovoConversor() {
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
                <Label>Título</Label>
                <Input type="text" placeholder="..."/>
              </div>
        </div>
        <DialogFooter>
          <Button className="flex items-center gap-2" type="submit" variant={"secondary"}>
          <Plus size={18} />
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
