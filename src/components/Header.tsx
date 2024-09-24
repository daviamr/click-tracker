import { Button } from "./ui/button";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Building2,
  CaseLower,
  Database,
  History,
  Laptop,
  LayoutDashboard,
  Link2,
  LogOut,
  Megaphone,
  Radar,
  Users,
  Waypoints,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useContextState } from "@/hook/state";
import { useState } from "react";

export function Header() {
  const { isFocus, setIsFocus } = useContextState();
  const [isOpen, setIsOpen] = useState<Boolean>(true);
  console.log(isOpen);

  function logOut() {
    try {
      localStorage.removeItem("@shorturl:user");
      window.location.reload();
    } catch {
      console.log("token não encontrado");
    }
  }

  return (
    <>
      <header
        className={`h-screen bg-white shadow-sm dark:bg-[#1e1e21] py-8 overflow-hidden duration-200 ${
          isOpen ? "w-52" : "w-16"
        }`}
      >
        <div className="flex flex-col mb-8 justify-between h-full">
          <div>
            <div className="flex justify-center mb-8">
              <p
                className={`text-xl relative z-10 w-max m-auto font-bold ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <span className="absolute w-[140px] h-4 bg-[#799b09] z-[-1] left-[-8px] bottom-0"></span>
                LinkTracker
              </p>
              <Button onClick={() => setIsOpen(!isOpen)} variant={"ghost"}>
                {isOpen ? (
                  <ArrowLeftFromLine size={16} />
                ) : (
                  <ArrowRightFromLine size={16} />
                )}
              </Button>
            </div>

            <div className="flex items-center px-4 mb-8 gap-2">
              <img
                src="https://i.imgur.com/LDJu8HS.jpeg"
                alt="usuário"
                className={`w-12 rounded-sm`}
              />
              <div className={`${isOpen ? "block" : "hidden"}`}>
                <p className="leading-4 text-[14px]">Bem vindo (a),</p>
                <p className="text-[14px]">Fulano.</p>
              </div>
            </div>

            <nav>
              <ul>
                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "user"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("user")}
                  >
                    <Users size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>Usuários</p>
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "customers"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("customers")}
                  >
                    <Building2 size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>Clientes</p>
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "campaign"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("campaign")}
                  >
                    <Megaphone size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      Campanhas
                    </p>
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "lps"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("lps")}
                  >
                    <Laptop size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>LP's</p>
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "action"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("action")}
                  >
                    <Waypoints size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>Ações</p>
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "shorturl"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("shorturl")}
                  >
                    <Link2 size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      ShortURLS
                    </p>
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "conversor"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("conversor")}
                  >
                    <CaseLower size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      Conversores
                    </p>
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "history"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("history")}
                  >
                    <History size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      Histórico
                    </p>
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "originbase"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("originbase")}
                  >
                    <Database size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      Base Origem
                    </p>
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "shorter"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("shorter")}
                  >
                    <Radar size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>Tracker</p>
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "dashboard"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("dashboard")}
                  >
                    <LayoutDashboard size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      Dashboard
                    </p>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <ul>
            <li
                className={`border-l-4 text-[16px] cursor-pointer border-col`}
              >
                <ModeToggle/>
              </li>

              <li
                className={`border-l-4 text-[16px] cursor-pointer border-col`}
              >
                <button
                  className="flex items-center gap-2 py-3 pl-5 w-full"
                  onClick={() => logOut()}
                >
                  <LogOut size={18} />
                  <p className={`${isOpen ? "block" : "hidden"}`}>Sair</p>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
