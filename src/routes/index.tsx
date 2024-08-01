import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./App.routes";
import { AuthRoutes } from "./Auth.routes";
import { useAuth } from "@/hook/Auth";
import { DataProps } from "@/interface/auth";

type dataUseProps = { data: DataProps }

export function Routes() {
    const {data} = useAuth() as dataUseProps;

  return (
    <>
      <BrowserRouter>
        {data?.jwtToken ? <AppRoutes/> : <AuthRoutes/>}
      </BrowserRouter>
    </>
  );
}