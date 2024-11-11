import Image from "next/image";

function Close({ styles, handleClose }) {
  return (
    <div
      className="close hoverBgColor w-14 h-14 flex items-center justify-center rounded-full cursor-pointer"
      onClick={handleClose}
    >
      <Image
        src="/icons/times.svg"
        alt="close"
        width={22}
        height={22}
        priority={true}
        className="text-white h-6 w-6"
      />
    </div>
  );
}

export default Close;
