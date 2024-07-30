import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./App.routes";
import { AuthRoutes } from "./Auth.routes";
import { useAuth } from "@/hook/Auth";
import { DataProps } from "@/interface/auth";

export function Routes() {
    const {data} = useAuth() as DataProps;

  return (
    <>
      <BrowserRouter>
        {data?.jwtToken ? <AppRoutes/> : <AuthRoutes/>}
      </BrowserRouter>
    </>
  );
}