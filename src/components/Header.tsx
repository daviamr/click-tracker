import { Button } from "./ui/button";
import { Building2, CaseLower, Laptop, LayoutDashboard, Link2, LogOut, Megaphone, Radar, UsersRound, Waypoints } from "lucide-react";
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
    <div className="flex bg-white shadow-sm dark:bg-[#1e1e21] h-[60px] fixed top-0 left-0 z-1000 w-full">
      <header className="flex justify-between items-center w-full max-w-7xl mx-auto px-8 py-3 text-[14px]">
        <p className="text-xl relative z-10">
          <span className="absolute w-[140%] h-4 bg-[#799b09] z-[-1] left-[-8px] bottom-0"></span>
          Logo.</p>
        <nav>
          <ul className="flex gap-8 cursor-pointer">
            <li className="hover:opacity-40 duration-300">
              <button
                className={`flex items-center gap-1 ${isFocus === "user" ? "font-bold" : ""}`}
                onClick={() => setIsFocus("user")}
              >
                <UsersRound size={18}/>
                Usuários
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`flex items-center gap-1 ${
                  isFocus === "customers" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("customers")}
              >
                <Building2 size={18}/>
                Clientes
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`flex items-center gap-1 ${
                  isFocus === "campaign" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("campaign")}
              >
                <Megaphone size={18}/>
                Campanhas
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`flex items-center gap-1 ${
                  isFocus === "lps" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("lps")}
              >
                <Laptop size={18}/>
                LP's
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`flex items-center gap-1 ${
                  isFocus === "action" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("action")}
              >
                <Waypoints size={18}/>
                Ações
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`flex items-center gap-1 ${
                  isFocus === "shorturl" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("shorturl")}
              >
                <Link2 size={18}/>
                ShortURLS
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`flex items-center gap-1 ${
                  isFocus === "conversor" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("conversor")}
              >
                <CaseLower size={18}/>
                Conversor
              </button>
            </li>

            <li className="hover:opacity-40 duration-300">
              <button
                className={`flex items-center gap-1 ${
                  isFocus === "shorter" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("shorter")}
              >
                <Radar size={18}/>
                Tracker
              </button>
            </li>
            <li className="hover:opacity-40 duration-300">
              <button
                className={`flex items-center gap-1 ${
                  isFocus === "dashboard" ? "font-bold" : ""
                }`}
                onClick={() => setIsFocus("dashboard")}
              >
                <LayoutDashboard size={18}/>
                Dashboard
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
          <p className="text-sm mt-2 hidden">
            Olá, <span className="font-bold">Juvencio</span>!
          </p>
        </div>
      </header>
    </div>
  );
}
