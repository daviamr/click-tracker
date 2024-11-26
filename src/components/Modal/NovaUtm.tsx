import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoveRight, Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { createUTM } from "@/interface/auth";
import { useEffect, useState } from "react";

const createUserSchema = z.object({
    title: z.string().min(1),
    utm: z.string().min(1),
    key: z.string().min(1)
});

type createUserForm = z.infer<typeof createUserSchema>;
type HandleCreateUsersProps = {
    handleCreateUTM: ({ title }: createUTM) => void;
};
type createUserProps = {
    onCreateUTM: () => void;
};

export function NovaUTM({ onCreateUTM }: createUserProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { handleCreateUTM } = useAuth() as HandleCreateUsersProps;
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<createUserForm>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            title: "",
        },
    });
    const utmValue = watch('utm');

    async function createUser(data: createUserForm) {
        try {
            const { title } = data;
            await handleCreateUTM({ title });
            console.log(data)
            onCreateUTM();
            setIsOpen(false);
            reset();
        } catch (error) {
            console.log("Erro ao criar usuário:", error);
        }
    }

    useEffect(() => {reset()}, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2" variant={"secondary"}>
                    <Plus size={18} />
                    Cadastrar UTM
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="pb-4 border-b-[1px]">
                    <DialogTitle>Nova UTM</DialogTitle>
                    <DialogDescription>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
                        veritatis ipsa nisi hic at!
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(createUser)}>
                    <div className="grid grid-cols-4 gap-4 gap-y-6 py-4">

                        <div className="relative col-span-4">
                            <Label htmlFor="username" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                                Nome do conjunto
                            </Label>

                            <Input
                                id="username"
                                type="text"
                                placeholder="Conjunto UTM X Chave Y"
                                {...register("title")}
                                className={`${errors.title && "border-rose-400"}`}
                            />
                        </div>

                        <div className="flex gap-4 items-center col-span-4">
                            <div className="relative col-span-4">
                                <Label htmlFor="username" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                                    UTM
                                </Label>

                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="utm_example"
                                    {...register("utm")}
                                    className={`${errors.title && "border-rose-400"}`}
                                />
                            </div>
                            <div>
                                <MoveRight size={18} className={`duration-300 ${utmValue && 'text-[#a2d515]'}`}/>
                            </div>
                            <div className="relative col-span-4">
                                <Label htmlFor="username" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold z-10">
                                    Chave
                                </Label>

                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="facebook"
                                    {...register("key")}
                                    className={`${errors.title && "border-rose-400"}`}
                                    disabled={!utmValue}
                                />
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button
                            className="flex items-center gap-2"
                            type="submit"
                            variant={"secondary"}
                            onClick={() => setIsOpen(true)}
                        >
                            <Plus size={18} />
                            Criar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
