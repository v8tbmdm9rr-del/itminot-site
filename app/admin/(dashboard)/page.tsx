import { getMenuItems } from "@/lib/menuStore";
import { AdminMenuEditor } from "@/components/admin/AdminMenuEditor";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const items = await getMenuItems();
  return <AdminMenuEditor initialItems={items} />;
}
