import { useContextState } from "./hook/state";
import { AcaoPage } from "./pages/Acao";
import { BaseOrigemPage } from "./pages/BaseOrigem";
import { CampanhaPage } from "./pages/Campanha";
import { ClientesPage } from "./pages/Clientes";
import { ConversorPage } from "./pages/Conversor";
import { EncurtadorPage } from "./pages/Encurtador";
import { HistoricoPage } from "./pages/Historico";
import { LPsPage } from "./pages/LPs";
import { PainelPage } from "./pages/Painel";
import { ShortUrlsPage } from "./pages/ShortURLS";
import { UrlDestinoPage } from "./pages/UrlDestino";
import { UsuarioPage } from "./pages/Usuario";
import { UtmPage } from "./pages/Utm";

export function App() {
  const { isFocus } = useContextState();
  return (
    <>
      <div className="overflow-y-auto w-full">
        <div className="mx-auto">
          <div className="flex flex-col items-end border-r-8 border-[#a2d515] px-4 gap-1 py-1">
            <div className="flex items-center gap-2">
              <span className="block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              <p className="text-[14px] opacity-50">Você está logado.</p>
            </div>
            <p className="text-[14px]">
              Bem vindo, <strong>Fulano</strong>.
            </p>
          </div>
          {isFocus === "user" && <UsuarioPage />}
          {isFocus === "customers" && <ClientesPage />}
          {isFocus === "campaign" && <CampanhaPage />}
          {isFocus === "action" && <AcaoPage />}
          {isFocus === "lps" && <LPsPage />}
          {isFocus === "shorturl" && <ShortUrlsPage />}
          {isFocus === "conversor" && <ConversorPage />}
          {isFocus === "history" && <HistoricoPage />}
          {isFocus === "originbase" && <BaseOrigemPage />}
          {isFocus === "destinationurl" && <UrlDestinoPage />}
          {isFocus === "utm" && <UtmPage />}
          {isFocus === "shorter" && <EncurtadorPage />}
          {isFocus === "dashboard" && <PainelPage />}
        </div>
      </div>
    </>
  );
}
