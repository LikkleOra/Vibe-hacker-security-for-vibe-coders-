import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard!</h1>
      <p className="mb-4">You are logged in.</p>
      <div className="flex gap-4">
        <Link href="/">
          <Button>Go to Scanner</Button>
        </Link>
        <UserButton />
      </div>
    </div>
  );
}
