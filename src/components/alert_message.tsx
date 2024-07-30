import { Bounce, toast } from "react-toastify"

export function AlertMessage(message: string, type: string) {
    return (
      <>
        {type === "error" &&
          toast.error(`${message}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,})}
  
        {type === "success" &&
          toast.success(`${message}`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          })}
      </>
    );
  }