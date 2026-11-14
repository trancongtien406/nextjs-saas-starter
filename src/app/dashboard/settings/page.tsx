import { PageHeader } from "@/components/dashboard/page-header";
import { SettingsForm } from "@/components/dashboard/forms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/current";

export const metadata = { title: "Settings — Orbit" };

export default async function SettingsPage() {
  const { user, team, role } = await requireUser();
  return (
    <>
      <PageHeader title="Settings" description="Your profile and workspace preferences." />
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader><div><CardTitle>General</CardTitle><CardDescription>Update your name and workspace details.</CardDescription></div></CardHeader>
          <CardContent><SettingsForm name={user.name} email={user.email} teamName={team.name} canEditTeam={role !== "member"} /></CardContent>
        </Card>
        <Card className="border-rose-200">
          <CardHeader><div><CardTitle className="text-rose-700">Danger zone</CardTitle><CardDescription>Deleting the workspace removes all customers, metrics and invoices.</CardDescription></div></CardHeader>
          <CardContent><Button variant="danger" disabled={role !== "owner"}>Delete workspace</Button></CardContent>
        </Card>
      </div>
    </>
  );
}
