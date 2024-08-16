import { Button } from "@/components/ui/button";
import { useContextState } from "@/hook/state";
import { Label } from "@radix-ui/react-label";
import { CircleArrowLeft } from "lucide-react";
import { useState } from "react";
import { EncutadorUm } from "./EncurtadorUm";
import { EncurtadorDois } from "./EncurtadorDois";

export function EncurtadorPage() {
  const { setIsFocus } = useContextState();
  const [selectedOption, setSelectedOption] = useState<string>('option1');

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">Encurtador</h1>
        <Button
          onClick={() => setIsFocus("campaign")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button>
      </div>
      <div className="flex justify-end">
        {/* <Button variant={"secondary"} className="flex gap-2 items-center">
          <Download size={18} />
          Baixar arquivo exemplo
        </Button> */}
      </div>

      <div className="flex flex-col justify-center m-10">
        <div className="flex 
        justify-center mb-6">
        <Label
        className={`bg-slate-800 p-2 px-16 rounded-l-lg cursor-pointer ${selectedOption === 'option1' ? 'font-semibold bg-slate-600' : ''}`}
        onClick={() => setSelectedOption('option1')}>
            OPÇÃO 1
        </Label>
        <Label
        className={`bg-slate-800 p-2 px-16 rounded-r-lg cursor-pointer ${selectedOption === 'option2' ? 'font-semibold bg-slate-600' : ''}`}
        onClick={() => setSelectedOption('option2')}>
            OPÇÃO 2
        </Label>
        </div>
        {selectedOption === 'option1' ? <EncutadorUm/> : <EncurtadorDois/>}
      </div>
    </>
  );
}
