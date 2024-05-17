import Link from "next/link";

export const NavbarButton = ({ text, href }: { text: string; href: string }) => {
  return (
    <div className="navbar-button">
      <Link href={href}>
        <p>{text}</p>
      </Link>
    </div>
  );
};

