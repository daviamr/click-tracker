import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Unlink } from "lucide-react";

export function EncurtadorDois() {
  return (
    <>
      <div className="pt-12 px-8 bg-transparent rounded-md border border-input w-[480px] m-auto">
        <h1 className="text-3xl font-semibold w-max m-auto pb-8">
          Encurtador de Link
        </h1>

        <form>
          <div className="flex flex-col items-left">
            <Label htmlFor="link" className="cursor-pointer pb-1 text-sm">Digite ou Cole a URL</Label>
            <Input id="link" type="url" placeholder="https://exemplo.com" />
          </div>
          <div className="pb-12">
            <Button className="mt-8 w-full" variant="secondary">
              <div className="flex items-center gap-2">
                <Unlink size={18} />
                Encurtar
              </div>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
