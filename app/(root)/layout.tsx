import { Header } from "../../modules/home/header";
import {Footer} from "../../modules/home/footer";
import { Metadata } from "next"; // Import Metadata from the next module
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to the home page",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* header */}
      <Header />
      {/* Background efffect */}

      <div
        className={cn(
          "absolute inset-0",
          // Note: 'bg-size-[...]' is not standard Tailwind.
          // The standard syntax is 'bg-[length:...]'.
          "bg-size-[40px_40px]",

          // Corrected light mode gradient
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",

          // Corrected dark mode gradient
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      {/* This div is likely fine and was just covering the broken grid */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      {/* main */}
      <main className="z-20 relative w-full pt-0 ">{children}</main>
      {/* footer */}
      <Footer />
    </>
  );
}
