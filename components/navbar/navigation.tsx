"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Github,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    {
      href: "/",
      label: "Study",
      icon: BookOpen,
    },
    {
      href: "/manage",
      label: "Manage",
      icon: Settings,
    },
  ];

  return (
    <nav className="bg-background border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8 justify-between w-full">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={30}
              height={30}
              alt="Logo images"
            ></Image>
            <h1 className="text-md font-extrabold">DSA List</h1>
          </div>
          <div className="flex space-x-1 items-center">
            {session &&
              navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Button
                    key={item.href}
                    variant={isActive ? "default" : "ghost"}
                    size="lg"
                    asChild
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                );
              })}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage
                      src={session.user?.image || undefined}
                      alt={session.user?.name || "User"}
                    />
                    <AvatarFallback>
                      {getInitials(session.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark mode</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href="https://github.com/iamshubhamjangle/dsa-list"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      toast.success("Signed out successfully!");
                      signOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button size="lg">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
