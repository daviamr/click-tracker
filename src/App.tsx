import { Header } from "./components/Header"
import { useContextState } from "./hook/state"
import { CampanhaPage } from "./pages/Campanha";
import { ClientesPage } from "./pages/Clientes";
import { ConversorPage } from "./pages/Conversor";
import { EncutadorPage } from "./pages/Encurtador";
import { PainelPage } from "./pages/Painel";
import { ShortUrlsPage } from "./pages/ShortURLS";
import { UsuarioPage } from "./pages/Usuario";

export function App() {
  const {isFocus} = useContextState();
  return (
    <>
    <Header/>
    <div className="mt-16 max-w-7xl mx-auto px-8">
      {isFocus === "user" && <UsuarioPage/>}
      {isFocus === "customers" && <ClientesPage/>}
      {isFocus === "campaign" && <CampanhaPage/>}
      {isFocus === "shorturl" && <ShortUrlsPage/>}
      {isFocus === "conversor" && <ConversorPage/>}
      {isFocus === "shorter" && <EncutadorPage/>}
      {isFocus === "dashboard" && <PainelPage/>}
    </div>
    </>
  )
}
