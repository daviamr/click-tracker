import { Button } from "@/components/ui/button";
import { useContextState } from "@/hook/state";
import { Label } from "@radix-ui/react-label";
import { CircleArrowLeft } from "lucide-react";
import { useState } from "react";
import { EncutadorUm } from "./EncurtadorUm";
import { EncurtadorDois } from "./EncurtadorDois";
import { EncurtadorTres } from "./EncurtadorTres";
import { TooltipDemo } from "@/components/ToolTip";

export function EncurtadorPage() {
  const { setIsFocus } = useContextState();
  const [selectedOption, setSelectedOption] = useState<string>('trackera');

  return (
    <>
      <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
          <span className="bg-[#8b8b8b63] rounded-full w-3 h-3"></span>
          <h1 className="text-3xl">Tracker</h1>
          <TooltipDemo side="right" align="start" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, suscipit quam iusto quisquam possimus deleniti aut nobis rerum."/>
        </div>
        <Button
          onClick={() => setIsFocus("conversor")}
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

      <div className="flex flex-col justify-center mt-10 mb-10">
        <div className="flex 
        justify-center mb-6">
        <Label
        className={`p-2 px-16 rounded-l-lg cursor-pointer ${selectedOption === 'trackera' ? 'font-semibold bg-[#a2d515]' : 'bg-[#608104]'}`}
        onClick={() => setSelectedOption('trackera')}>
            Tracker A
        </Label>
        <Label
        className={`p-2 px-16 cursor-pointer ${selectedOption === 'trackerb' ? 'font-semibold bg-[#a2d515]' : 'bg-[#608104]'}`}
        onClick={() => setSelectedOption('trackerb')}>
            Tracker B
        </Label>
        <Label
        className={`p-2 px-16 rounded-r-lg cursor-pointer ${selectedOption === 'trackerc' ? 'font-semibold bg-[#a2d515]' : 'bg-[#608104]'}`}
        onClick={() => setSelectedOption('trackerc')}>
            Tracker C
        </Label>
        </div>
        {selectedOption === 'trackera' && <EncutadorUm/>}
        {selectedOption === 'trackerb' && <EncurtadorDois/>}
        {selectedOption === 'trackerc' && <EncurtadorTres/>}
      </div>
    </>
  );
}
