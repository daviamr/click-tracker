import { Button } from "./ui/button";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Braces,
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
import { TooltipHeader } from "./TooltipHeader";
import { useTheme } from "@/hook/theme-provider";
import { LogoA } from "./logoA";
import { LogoB } from "./logoB";
import { LogoC } from "./logoC";

export function Header() {
  const [isOpen, setIsOpen] = useState<Boolean>(true);
  const { isFocus, setIsFocus } = useContextState();
  const {theme} = useTheme();

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
        className={`h-full bg-white shadow-sm dark:bg-[#1e1e21] py-8 overflow-hidden duration-200 ${
          isOpen ? "w-52" : "w-16"
        }`}
      >
        <div className="flex flex-col mb-8 justify-between h-full">
          <div>
            <div className={`flex justify-center mb-8 ${!isOpen ? 'flex-col items-center gap-2' : ''}`}>
              {isOpen && theme === "dark" && <LogoA/>}
              {isOpen && theme === "light" && <LogoB/>}
              {!isOpen ? <LogoC/> : ''}
              <Button onClick={() => setIsOpen(!isOpen)} variant={"ghost"}>
                {isOpen ? (
                  <ArrowLeftFromLine size={16} />
                ) : (
                  <ArrowRightFromLine size={16} />
                )}
              </Button>
            </div>

            <div className="flex items-center mb-8 gap-2">
              {/* <img
                src="https://i.imgur.com/LDJu8HS.jpeg"
                alt="usuário"
                className={`w-12 rounded-sm`}
              /> */}
              <div className={`${isOpen ? "block" : "hidden"}`}>
                <p className="px-4 border-l-4 border-[#a2d515] leading-4 text-[14px]">Bem vindo (a), Fulano</p>
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("user")}
                  >
                    <Users size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>Usuários</p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="Usuários"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("customers")}
                  >
                    <Building2 size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>Clientes</p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="Clientes"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("campaign")}
                  >
                    <Megaphone size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      Campanhas
                    </p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="Campanhas"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("lps")}
                  >
                    <Laptop size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      LPs, Sites e Portais
                    </p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="LPs, Sites e Portais"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("action")}
                  >
                    <Waypoints size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>Ações</p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="Ações"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("shorturl")}
                  >
                    <Link2 size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      SmartURLs
                    </p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="SmartURLs"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("conversor")}
                  >
                    <CaseLower size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      Conversores
                    </p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="Conversores"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("history")}
                  >
                    <History size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      Histórico
                    </p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="Histórico"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("originbase")}
                  >
                    <Database size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      Origem Base
                    </p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="Origem Base"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
                  </button>
                </li>

                <li
                  className={`border-l-4 text-[16px] cursor-pointer border-col ${
                    isFocus === "destinationurl"
                      ? "border-[#a2d515] text-[#a2d515] dark:bg-[#232327] font-semibold"
                      : ""
                  }`}
                >
                  <button
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("destinationurl")}
                  >
                    <Braces size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      URLs de Destino
                    </p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="URLs de Destino"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("shorter")}
                  >
                    <Radar size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>Trackers</p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="Trackers"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
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
                    className="relative flex items-center gap-2 py-3 pl-5 w-full"
                    onClick={() => setIsFocus("dashboard")}
                  >
                    <LayoutDashboard size={18} />
                    <p className={`${isOpen ? "block" : "hidden"}`}>
                      Dashboard
                    </p>
                    <TooltipHeader
                      align="start"
                      side="right"
                      content="Dashboard"
                      className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                        isOpen ? "hidden" : "block"
                      }`}
                    />
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div>
            <ul
              className={`${isOpen ? "flex items-center justify-around" : ""}`}
            >
              <li
                className={`relative ${
                  isOpen
                    ? ""
                    : "border-l-4 text-[16px] cursor-pointer border-col"
                }`}
              >
                <TooltipHeader
                  align="start"
                  side="right"
                  content="Tema"
                  className={`hover:bg-transparent absolute w-[60px] h-[42px] top-0 right-0 ${
                    isOpen ? "hidden" : "block"
                  }`}
                />

                <ModeToggle
                  className={`z-1000 flex items-center gap-2 py-3 w-full ${
                    isOpen ? "pl-0" : "pl-5"
                  }`}
                />
              </li>

              <li
                className={`${
                  isOpen
                    ? ""
                    : "border-l-4 text-[16px] cursor-pointer border-col"
                }`}
              >
                <button
                  className={`relative flex items-center gap-2 py-3 w-full ${
                    isOpen ? "pl-0" : "pl-5"
                  }`}
                  onClick={() => logOut()}
                >
                  <LogOut size={18} />
                  <p className={`${isOpen ? "block" : "hidden"}`}>Sair</p>
                  <TooltipHeader
                    align="start"
                    side="right"
                    content="Sair"
                    className={`hover:bg-transparent absolute w-[60px] h-[42px] top-[0px] right-[0px] ${
                      isOpen ? "hidden" : "block"
                    }`}
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
