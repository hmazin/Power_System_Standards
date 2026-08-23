import { StandardsExplorer } from "@/components/standards-explorer";
import { getStandards } from "@/lib/standards";

export default function Home() {
  const standards = getStandards();

  return <StandardsExplorer standards={standards} />;
}
