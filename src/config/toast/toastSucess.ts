import { toast } from "react-toastify";

export function toastSuccess(message:string) {
  toast.success(message,{
    position:"top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    theme: "colored",
    progress: undefined,
  }) 
}