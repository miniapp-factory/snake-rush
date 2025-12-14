import { description, title } from "@/lib/metadata";
import { Metadata } from "next";
import { generateMetadata } from "@/lib/farcaster-embed";
import { SlotMachine } from "@/components/slot-machine";

export { generateMetadata };

export const metadata: Metadata = {
  other: {
    'base:app_id': '692248127fdd1c4812036588',
  },
};

export default function Home() {
  // NEVER write anything here, only use this page to import components
  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow">
      <span className="text-2xl">{title}</span>
      <span className="text-muted-foreground">{description}</span>
      <SlotMachine />
    </main>
  );
}
