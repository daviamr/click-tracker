import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Code, FileX2, RefreshCw } from "lucide-react";
import { api } from "@/services/Api";
import { baseProps, DataProps } from "@/interface/auth";
import { useEffect, useState } from "react";
import { AlertMessage } from "@/components/alert_message";
import { AxiosError } from "axios";
import { useAuth } from "@/hook/Auth";
import { EditarBase } from "@/components/Modal/EditarBase";
import { NovaUTM } from "@/components/Modal/NovaUtm";

type utmPageProps = { data: DataProps };

export function UtmPage() {
    const { data } = useAuth() as utmPageProps;
    const { deleteBase } = useAuth();
    const [utm, setUtm] = useState<baseProps[]>([]);
    const [refreshStatus, setRefreshStatus] = useState<Boolean>(false);

    const handleGetBase = async () => {
        try {
            const response = await api.get("/data-sources", {
                headers: {
                    Authorization: `Bearer ${data.jwtToken}`,
                },
            });
            setUtm(response.data);
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                AlertMessage(error.response.data.message, "error");
            } else {
                AlertMessage(
                    "Não foi possível carregar as campanhas, tente novamente mais tarde.",
                    "error"
                );
            }
        }
    };

    useEffect(() => {
        handleGetBase();
    }, [data.jwtToken]);

    /* deletar campanha */
    const handleDeleteBase = async (id: number) => {
      await deleteBase({ id });
      handleGetBase();
    };

    const refresh = () => {
        setRefreshStatus(true);
        setTimeout(() => {
            setRefreshStatus(false);
            AlertMessage("Planilha atualizada com sucesso.", "success");
        }, 1000);
    };

    return (
        <>
            <div>
                <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
                    <Code size={30} className="animate-pulse" />
                    UTM e Chave
                </h1>
            </div>
            <div className="flex gap-2 justify-end border-solid border-y-[1px] py-2 px-4">
                <Button
                    className="flex gap-2"
                    variant={"secondary"}
                    onClick={refresh}
                    disabled={!!refreshStatus}
                >
                    <RefreshCw
                        size={18}
                        className={`${refreshStatus && "animate-spin"}`}
                    />
                    Atualizar
                </Button>
                <NovaUTM onCreateUTM={handleGetBase} />
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="pl-4">UTM</TableHead>
                        <TableHead>Chaves</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {utm.map((i) => (
                        <TableRow key={i.id}>
                            <TableCell>{i.name}</TableCell>
                            <TableCell>{i.url}</TableCell>
                            <TableCell className="flex items-center justify-end gap-2 pr-4">
                                <EditarBase
                                    id={i.id}
                                    name={i.name}
                                    url={i.url}
                                    handleGetBase={handleGetBase}
                                />
                                <Button
                                    className="p-2 duration-300 hover:text-red-700"
                                    variant={"outline"}
                                    onClick={() => handleDeleteBase(i.id)}
                                >
                                    <FileX2 size={18} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
