import Image from "next/image";
import Link from "next/link";
import { NavbarButton } from "../components/navbar_button";

export const Navbar = () => {
    return (
      <div className="navbar-main">
        <div className="navbar-title">
          <Link href="/">
            <div className="navbar-title-text">
                clever seat
            </div>
          </Link>
        </div>
        {/* <div className="navbar-icon">
            <Link href="/">
                <Image
                    src="/chair.svg"
                    alt="logo"
                    width={38.4}
                    height={36}
                />
            </Link>
        </div> */}
        <div className="navbar-buttons">
            <NavbarButton text="About" href="/about"/>
            <NavbarButton text="Login" href="/login"/>
        </div>
      </div>
    )
  };
  