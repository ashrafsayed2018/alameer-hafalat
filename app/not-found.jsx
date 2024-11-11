"use client";
import Link from "next/link";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center  items-center py-16 px-8 text-center font-sans bg-[#E7FFFF]">
      <h1 className="error  text-[150px] text-[#008B62] font-normal drop-shadow-[1px_1px_1px_#00593E]">
        404
      </h1>
      <div className="page my-8 text-2xl font-semibold text-[#444]">
        أوبس!!! الصفحة التي تبحث عنها غير موجودة
      </div>
      <Link
        className="back-home inline-block border-2 border-[#222] bg-[#222] rounded-md text-white font-semibold uppercase py-[0.75rem] px-4 transition-all duration-200 ease-linear shadow-[0_15px_15px_-11px_rgba(0,0,0,0.4)] hover:bg-[#222] hover:text-[#ddd]"
        href="/"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}

export default NotFound;
