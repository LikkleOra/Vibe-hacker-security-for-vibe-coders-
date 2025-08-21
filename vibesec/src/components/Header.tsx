import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  const { openSignIn, isLoaded, isSignedIn } = useClerk();

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
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Scan
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <Button
            onClick={() => {
              if (!isLoaded) return;
              if (isSignedIn) return;
              openSignIn();
            }}
          >
            Sign In
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
}
