import { SelectCampanha } from "@/components/SelectCampaign";
import { SelectEncurtador } from "@/components/SelectShort";
import { Button } from "@/components/ui/button";
import { useContextState } from "@/hook/state";
import { CircleArrowLeft, Upload } from "lucide-react";

export function EncutadorPage() {
  const { setIsFocus } = useContextState();
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
      <div className="">
        <div className="flex items-end flex-wrap gap-4">
          <SelectCampanha />
          <SelectEncurtador />
          <input
            type="file"
            className="cursor-pointer p-1 bg-transparent rounded-md border border-input col-span-3"
          />
          <Button variant={"secondary"}>
            <Upload size={18} className="mr-2" />
            Upload
          </Button>
          <div className="flex flex-col gap-1">
            <label htmlFor="urlFinal" className="font-semibold">Preencha a URL final</label>
          <input id="urlFinal" type="text" className="pl-4 bg-transparent rounded-md border border-input min-h-[36px]"/>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="urlFinal" className="font-semibold">Parâmetro que será substituído</label>
          <input id="urlFinal" type="text" placeholder="" className="pl-4 bg-transparent rounded-md border border-input min-h-[36px]"/>
          </div>
          <Button variant='secondary'>
            Baixar
          </Button>
        </div>
      </div>
    </>
  );
}
