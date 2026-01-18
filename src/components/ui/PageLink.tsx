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
      className={` text-violet-600 hover:underline dark:text-violet-400 text-${size}`}
    >
      {text}
    </Link>
  );
}
