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
import { Link, Link2 } from "lucide-react";

export function NovaUrl() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2"
        variant={"secondary"}>
        <Link size={18}/>
        Nova URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova URL</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <div className="col-span-4">
            <Label htmlFor="url" className="text-right">
                URL
            </Label>
            <Input id="url" placeholder="https://exemple.com"/>
          </div>
        </div>
        <DialogFooter>
          <Button className="flex items-center gap-2" type="submit" variant={'secondary'}>
          <Link2 size={18} />
            Criar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}