import { Grafico } from "@/components/Grafico";
import { Button } from "@/components/ui/button";
import { useContextState } from "@/hook/state";
import { CircleArrowLeft } from "lucide-react";

export function PainelPage() {
  const { setIsFocus } = useContextState();

  return (
    <>
      <div className="flex gap-4 justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="bg-[#8b8b8b63] rounded-full w-3 h-3"></span>
          <h1 className="text-3xl">Painel</h1>
        </div>
        <Button
          onClick={() => setIsFocus("shorter")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button>
      </div>
      <Grafico/>
    </>
  );
}
