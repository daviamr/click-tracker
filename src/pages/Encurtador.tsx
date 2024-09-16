import { Label } from "@radix-ui/react-label";
import { Radar } from "lucide-react";
import { useState } from "react";
import { EncutadorUm } from "./EncurtadorUm";
import { EncurtadorDois } from "./EncurtadorDois";
import { EncurtadorTres } from "./EncurtadorTres";

export function EncurtadorPage() {
  const [selectedOption, setSelectedOption] = useState<string>("trackera");

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Radar size={24} />
          <h1 className="text-3xl">Tracker</h1>
        </div>
        {/* <Button
          onClick={() => setIsFocus("conversor")}
          variant={"outline"}
          className="flex gap-2 items-center"
        >
          <CircleArrowLeft size={18} />
          Voltar
        </Button> */}
      </div>

      <div className="flex flex-col justify-center mt-10 mb-10">
        <div
          className="flex 
        justify-center mb-6"
        >
          <Label
            className={`p-2 px-16 rounded-l-lg cursor-pointer ${
              selectedOption === "trackera"
                ? "font-semibold bg-[#a2d515]"
                : "bg-[#608104]"
            }`}
            onClick={() => setSelectedOption("trackera")}
          >
            Tracker A
          </Label>
          <Label
            className={`p-2 px-16 cursor-pointer ${
              selectedOption === "trackerb"
                ? "font-semibold bg-[#a2d515]"
                : "bg-[#608104]"
            }`}
            onClick={() => setSelectedOption("trackerb")}
          >
            Tracker B
          </Label>
          <Label
            className={`p-2 px-16 rounded-r-lg cursor-pointer ${
              selectedOption === "trackerc"
                ? "font-semibold bg-[#a2d515]"
                : "bg-[#608104]"
            }`}
            onClick={() => setSelectedOption("trackerc")}
          >
            Tracker C
          </Label>
        </div>
        {selectedOption === "trackera" && <EncutadorUm />}
        {selectedOption === "trackerb" && <EncurtadorDois />}
        {selectedOption === "trackerc" && <EncurtadorTres />}
      </div>
    </>
  );
}
