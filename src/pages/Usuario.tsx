import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type userDataProps = {id: number; nome: string; genero: string; email: string; data: string}

export function UsuarioPage() {
  let DataAtual = new Date();
  let DataFormatada = DataAtual.toLocaleString();

  const [userData] = useState<userDataProps[]>([
    {
      id: 0,
      nome: "Irineu",
      genero: "Feminino",
      email: "29/07/2080",
      data: `${DataFormatada}`,
    },
  ]);
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData.map((i, index) => (
            <TableRow key={index}>
              <TableCell>{i.id}</TableCell>
              <TableCell>{i.nome}</TableCell>
              <TableCell>{i.email}</TableCell>
              <TableCell>{i.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
