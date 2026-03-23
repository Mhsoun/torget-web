import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, Users } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const token = session?.accessToken ?? "";

  let stats = { totalItems: 0, totalOrders: 0, totalLeads: 0, openInquiries: 0 };
  try {
    stats = await getDashboardStats(token);
  } catch {
    // show zeros if unavailable
  }

  const cards = [
    { label: "Total Items", value: stats.totalItems, icon: Package },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart },
    { label: "Open Inquiries", value: stats.openInquiries, icon: MessageSquare },
    { label: "Total Leads", value: stats.totalLeads, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
