import { Grafico } from "@/components/Grafico";
import { LayoutDashboard } from "lucide-react";

export function PainelPage() {
  return (
    <>
      <div className="flex gap-4 justify-between mb-8">
        <div className="flex items-center gap-2">
          <LayoutDashboard size={24} />
          <h1 className="text-3xl">Dashboard</h1>
        </div>
        {/* <Button
          onClick={() => setIsFocus("shorter")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button> */}
      </div>
      <Grafico />
    </>
  );
}
