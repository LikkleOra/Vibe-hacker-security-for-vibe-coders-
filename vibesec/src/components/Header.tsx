import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="text-2xl font-bold text-primary">
        VibeSec
      </Link>
      <nav className="flex items-center space-x-4">
        <SignedIn>
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
            Dashboard
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
      </nav>
    </header>
  );
}
