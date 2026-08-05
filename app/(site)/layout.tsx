import { Navbar } from "@/components/layout/Navbar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ToastViewport } from "@/components/ui/ToastViewport";
import { SiteLoader } from "@/components/ui/SiteLoader";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteLoader />
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
      <CartDrawer />
      <ToastViewport />
    </>
  );
}
