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
    <div className="flex bg-gray-900">
      <header className="flex justify-between items-center w-full max-w-7xl mx-auto px-8 py-4">
        <p className="text-white text-xl">Logo</p>
        <nav>
          <ul className="flex gap-8 cursor-pointer">
            <li className="hover:opacity-40 duration-300">
              <button
                className={`${isFocus === "user" ? "font-bold" : "text-white"}`}
                onClick={() => setIsFocus("user")}
              >
                Usuários
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "customers" ? "font-bold" : "text-white"
                }`}
                onClick={() => setIsFocus("customers")}
              >
                Clientes
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "campaign" ? "font-bold" : "text-white"
                }`}
                onClick={() => setIsFocus("campaign")}
              >
                Campanha
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "action" ? "font-bold" : "text-white"
                }`}
                onClick={() => setIsFocus("action")}
              >
                Ação
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "shorturl" ? "font-bold" : "text-white"
                }`}
                onClick={() => setIsFocus("shorturl")}
              >
                ShortURLS
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "conversor" ? "font-bold" : "text-white"
                }`}
                onClick={() => setIsFocus("conversor")}
              >
                Conversor
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "shorter" ? "font-bold" : "text-white"
                }`}
                onClick={() => setIsFocus("shorter")}
              >
                Shortener
              </button>
            </li>
            <li className="hover:opacity-40 duration-300">
              <button
                className={`${
                  isFocus === "dashboard" ? "font-bold" : "text-white"
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
          <p className="text-sm mt-2 text-white">
            Olá, <span className="font-bold">Juvencio</span>!
          </p>
        </div>
      </header>
    </div>
  );
}
