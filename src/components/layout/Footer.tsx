import PageLink from "../ui/PageLink";

export default function Footer() {
  return (
    <footer className="flex flex-wrap gap-1 px-2 text-xs text-gray-400">
      <PageLink url="/support" text="About" size="xs" />
      <span>•</span>
      <PageLink url="/support" text="Support" size="xs" />
      <span>•</span>
      <PageLink url="/terms" text="Terms" size="xs" />
      <p className="text-xs">Nextribes 2025, All rights reserved</p>
    </footer>
  );
}
