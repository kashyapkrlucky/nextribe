import toast from "react-hot-toast";

export default function CustomToast(type: string, message: string) {
    if (type === "success") {
        return toast.success(message, {
            position: "bottom-right",
            duration: 3000,
        })
    } else if (type === "error") {
        return toast.error(message, {
            position: "bottom-right",
            duration: 3000,
        })
    } else if (type === "warning") {
        return toast.custom(message, {
            position: "bottom-right",
            duration: 3000,
            style: {
                borderRadius: "10px",
                padding: "10px",
                backgroundColor: "#f59e0b",
                color: "#fff",
            },
        })
    } else {
        return toast(message, {
            position: "bottom-right",
            duration: 3000,
        })
    }
}