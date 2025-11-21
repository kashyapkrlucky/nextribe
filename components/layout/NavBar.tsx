import Link from "next/link";
import React from "react";
import Button from "../ui/Button";

interface NavBarProps {
  user?: { name?: string };
}

const navigation = [
  { name: "Sign In", href: "/sign-in" },
  { name: "Sign Up", href: "/sign-up" },
];

const NavBar = ({ user }: NavBarProps) => {
  return (
    <header className="bg-blue-600 h-16">
      <div className="w-full flex flex-row justify-between px-4">
        <div className="lg:w-1/2 flex flex-col lg:flex-row gap-8 items-center py-4">
          <Link className="font-bold text-xl text-gray-100" href={"/"}>
            NextTribe
          </Link>
        </div>
        <div className="lg:w-1/2 flex flex-row p-4 lg:p-0 gap-8 items-center justify-center lg:justify-end">
          {user && user.name ? (
            <div className="flex items-center gap-4">
              <div className="text-gray-100 text-sm font-medium">
                Hi, {user.name}
              </div>
              <form action="/api/auth/logout" method="post">
                <Button className="ml-2 bg-gray-100 text-gray-800">
                  Logout
                </Button>
              </form>
            </div>
          ) : (
            <>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm/6 font-medium text-gray-100"
                >
                  {item.name}
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
