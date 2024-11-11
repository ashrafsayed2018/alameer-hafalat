"use client";
import Link from "next/link";

function Button({ href, text, styles, children }) {
  return (
    <Link href={href} className={styles}>
      {text}
      {children}
    </Link>
  );
}

export default Button;
