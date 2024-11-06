import { Label } from "@radix-ui/react-label";
import { Radar } from "lucide-react";
import { useState } from "react";
import { EncurtadorDois } from "./EncurtadorDois";
import { EncurtadorTres } from "./EncurtadorTres";
import { TooltipTracker } from "@/components/TooltipTracker";
import { TrackerA } from "./TrackerA";

export function EncurtadorPage() {
  const [selectedOption, setSelectedOption] = useState<string>("trackera");

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Radar size={30} className="animate-pulse" />
          Trackers
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div
          className="flex flex-col 
        items-center justify-center w-full"
        >
          <div className="flex w-[601px] text-center">
            <Label
              className={`grow p-2 rounded-l-lg cursor-pointer rounded-bl-none ${
                selectedOption === "trackera"
                  ? "font-semibold bg-[#a2d515]"
                  : "bg-[#608104]"
              }`}
              onClick={() => setSelectedOption("trackera")}
            >
              <div className="flex justify-center">
                Tracker A
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Utilize esta opção para gerar uma planilha com links individualizados e personalizados, permitindo acompanhar exatamente qual destinatário clicou em cada link. A geração de relatórios pode ser feita tanto click a click - com registro de data/hora/IP e fingerprint de cada click, - quanto através da totalização de dados, segmentada por cliente, campanha, LP/Site/Portal e/ou ação.'
                  className="bg-white border-white text-[#000000] hover:bg-white hover:border-white hover:text-[#000000]"
                />
              </div>
            </Label>
            <Label
              className={`grow p-2 cursor-pointer ${
                selectedOption === "trackerb"
                  ? "font-semibold bg-[#a2d515]"
                  : "bg-[#608104]"
              }`}
              onClick={() => setSelectedOption("trackerb")}
            >
              <div className="flex justify-center">
                Tracker B
                <TooltipTracker
                  side="right"
                  align="start"
                  content="Utilize esta opção quando não houver a possibilidade de realizar o tracking individualizado, como por exemplo em campanhas de tráfego pago no Google ou em redes sociais, disparos de ofertas em grupos de whatsapp, etc. A plataforma irá gerar um link único que será utilizado para contabilizar os clicks redirecionados ao link de destino final. A geração de relatórios será feita somente através da totalização de dados, segmentada por cliente, campanha, LP/Site/Portal e/ou ação."
                  className="bg-white border-white text-[#000000] hover:bg-white hover:border-white hover:text-[#000000]"
                />
              </div>
            </Label>
            <Label
              className={`grow p-2 rounded-r-lg rounded-br-none cursor-pointer ${
                selectedOption === "trackerc"
                  ? "font-semibold bg-[#a2d515]"
                  : "bg-[#608104]"
              }`}
              onClick={() => setSelectedOption("trackerc")}
            >
              <div className="flex justify-center">
                Tracker C
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Utilize o Tracker C para os casos onde você somente possa personalizar um parâmetro específico de uma URL fornecida pelo cliente/parceiro, não sendo possível utilizar nossas ShortURLs. Para isso, você deve definir qual é o parâmetro a ser substituído na "URL destino" e selecionar as opções desejadas para a individualização dos links. A geração de relatórios só poderá ser feita utilizando a consolidação dos dados fornecida pelo cliente/parceiro.'
                  className="bg-white border-white text-[#000000] hover:bg-white hover:border-white hover:text-[#000000]"
                />
              </div>
            </Label>
          </div>
          {/* <div className="bg-transparent rounded-md border border-input h-max p-4">
            <p className="flex items-center text-2xl font-semibold gap-2 mb-4 text-[#a2d515]">
              <Info size={30} />
              {selectedOption === "trackera" && "Tracker A"}
              {selectedOption === "trackerb" && "Tracker B"}
              {selectedOption === "trackerc" && "Tracker C"}
            </p>
            <p>
              {selectedOption === "trackera" &&
                "Utilize esta opção para gerar uma planilha com links individualizados e personalizados, permitindo acompanhar exatamente qual destinatário clicou em cada link. A geração de relatórios pode ser feita tanto click a click - com registro de data/hora/IP e fingerprint de cada click, - quanto através da totalização de dados, segmentada por cliente, campanha, LP/Site/Portal e/ou ação."}

              {selectedOption === "trackerb" &&
                "Utilize esta opção quando não houver a possibilidade de realizar o tracking individualizado, como por exemplo em campanhas de tráfego pago no Google ou em redes sociais, disparos de ofertas em grupos de whatsapp, etc. A plataforma irá gerar um link único que será utilizado para contabilizar os clicks redirecionados ao link de destino final. A geração de relatórios será feita somente através da totalização de dados, segmentada por cliente, campanha, LP/Site/Portal e/ou ação."}

              {selectedOption === "trackerc" &&
                'Utilize o Tracker C para os casos onde você somente possa personalizar um parâmetro específico de uma URL fornecida pelo cliente/parceiro, não sendo possível utilizar nossas ShortURLs. Para isso, você deve definir qual é o parâmetro a ser substituído na "URL destino" e selecionar as opções desejadas para a individualização dos links. A geração de relatórios só poderá ser feita utilizando a consolidação dos dados fornecida pelo cliente/parceiro.'}
            </p>
          </div> */}
        </div>

        {selectedOption === "trackera" && <TrackerA />}
        {selectedOption === "trackerb" && <EncurtadorDois />}
        {selectedOption === "trackerc" && <EncurtadorTres />}
      </div>
    </>
  );
}
