import { authOptions } from "@/lib/nextAuthAdapter";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/auth/login");
  redirect(`/dashboard/users/1`);
}
