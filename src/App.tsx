import { useContextState } from "./hook/state";
import { AcaoPage } from "./pages/Acao";
import { CampanhaPage } from "./pages/Campanha";
import { ClientesPage } from "./pages/Clientes";
import { ConversorPage } from "./pages/Conversor";
import { EncurtadorPage } from "./pages/Encurtador";
import { LPsPage } from "./pages/LPs";
import { PainelPage } from "./pages/Painel";
import { ShortUrlsPage } from "./pages/ShortURLS";
import { UsuarioPage } from "./pages/Usuario";

export function App() {
  const { isFocus } = useContextState();
  return (
    <>
      <div className="pt-[60px] mt-[60px] overflow-y-auto h-[calc(100vh_-60px)]">
        <div className="max-w-7xl mx-auto px-8">
          {isFocus === "user" && <UsuarioPage />}
          {isFocus === "customers" && <ClientesPage />}
          {isFocus === "campaign" && <CampanhaPage />}
          {isFocus === "action" && <AcaoPage />}
          {isFocus === "lps" && <LPsPage />}
          {isFocus === "shorturl" && <ShortUrlsPage />}
          {isFocus === "conversor" && <ConversorPage />}
          {isFocus === "shorter" && <EncurtadorPage />}
          {isFocus === "dashboard" && <PainelPage />}
        </div>
      </div>
    </>
  );
}
