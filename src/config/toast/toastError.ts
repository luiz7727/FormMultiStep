import { toast } from "react-toastify";

export function toastError(message: string | undefined) {
  toast.error(message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    theme: "colored",
    progress: undefined,
  })
}
