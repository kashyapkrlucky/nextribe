import Link from "next/link";

interface PageLinkProps {
  url: string;
  text: string;
  size?: string;
}

export default function PageLink({ url, text, size = "sm" }: PageLinkProps) {
  return (
    <Link
      href={url}
      className={` text-indigo-600 hover:underline dark:text-indigo-400 text-${size}`}
    >
      {text}
    </Link>
  );
}
