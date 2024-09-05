import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useContextState } from "@/hook/state";

export function Header() {
  const { isFocus, setIsFocus } = useContextState();

  function logOut () {
    try {
      localStorage.removeItem('@shorturl:user')
      window.location.reload()
    } catch {
      console.log('token não encontrado');
    }
  }

  return (
    <div className="flex bg-white shadow-sm dark:bg-[#1e1e21]">
      <header className="flex justify-between items-center w-full max-w-7xl mx-auto px-8 py-4">
        <p className="text-xl relative z-10">
          <span className="absolute w-[140%] h-4 bg-[#799b09] z-[-1] left-[-8px] bottom-0"></span>
          Logo.</p>
        <nav>
          <ul className="flex gap-8 cursor-pointer">
            <li className="hover:opacity-40 duration-300">
              <button
                className={`${isFocus === "user" ? "font-bold" : ""}`}
                onClick={() => setIsFocus("user")}
              >
                Usuários
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "customers" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("customers")}
              >
                Clientes
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "campaign" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("campaign")}
              >
                Campanhas
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "action" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("action")}
              >
                Ações
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "shorturl" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("shorturl")}
              >
                ShortURLS
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "conversor" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("conversor")}
              >
                Conversor
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "shorter" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("shorter")}
              >
                Tracker
              </button>
            </li>
            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "dashboard" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("dashboard")}
              >
                Painel
              </button>
            </li>
          </ul>
        </nav>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <ModeToggle />
            <Button
            variant={"secondary"}
            onClick={() => logOut()}>
              <LogOut size={18} />
            </Button>
          </div>
          <p className="text-sm mt-2 ">
            Olá, <span className="font-bold">Juvencio</span>!
          </p>
        </div>
      </header>
    </div>
  );
}
