import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/Login";

export function AuthRoutes () {
    return (
        <>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="*" element={<div>Página não encontrada</div>}/>
        </Routes>
        </>
    )
}