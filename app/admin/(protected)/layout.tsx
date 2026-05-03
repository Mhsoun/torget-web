import { AdminNav } from "@/components/admin/AdminNav";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getCachedBusinessConfig } from "@/lib/config";
import { requireAdminAccessToken } from "@/lib/admin-session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminAccessToken();

  const config = await getCachedBusinessConfig();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background h-14 flex items-center px-6 justify-between">
        <span className="font-bold text-lg">{config.name} Admin</span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <Button variant="ghost" size="sm" type="submit">
            Sign out
          </Button>
        </form>
      </header>
      <div className="flex flex-1">
        <aside className="w-52 border-r bg-background">
          <AdminNav />
        </aside>
        <main className="flex-1 p-6 bg-muted/20">{children}</main>
      </div>
    </div>
  );
}
