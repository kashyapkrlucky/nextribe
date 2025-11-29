import Link from "next/link";
import { UserMenu } from "../auth/UserMenu";

interface NavBarProps {
  user?: { name: string; email: string; id: string };
}

const navigation = [
  { name: "Sign In", href: "/sign-in" },
  { name: "Sign Up", href: "/sign-up" },
];

const NavBar = ({ user }: NavBarProps) => {
  return (
    <header className="bg-blue-600 h-16">
      <div className="w-full flex flex-row justify-between px-4 lg:px-0 max-w-7xl mx-auto">
        <div className="lg:w-1/2 flex flex-col lg:flex-row gap-8 items-center py-4">
          <Link className="font-bold text-xl text-gray-100" href={"/"}>
            NextTribe
          </Link>
        </div>
        <div className="lg:w-1/2 flex flex-row p-4 lg:p-0 gap-8 items-center justify-center lg:justify-end">
          {user?.id ? (
            <div className="flex items-center">
              <UserMenu user={user} />
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
