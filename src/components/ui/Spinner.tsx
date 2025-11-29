import Image from "next/image";

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-20"> 
        <Image src="/spinner.svg" alt="Loading" width={20} height={20} className="animate-spin" />
    </div>
  );
};
