import { createFileRoute } from "@tanstack/react-router";
import { WeddingWalkthrough } from "@/components/wedding/WeddingWalkthrough";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Avindu & Yavishka · 3D Wedding Journey" },
      { name: "description", content: "Explore the wedding venue and discover the wedding details of Avindu & Yavishka, 20 January 2027." },
      { property: "og:title", content: "Avindu & Yavishka · 3D Wedding Journey" },
      { property: "og:description", content: "Step into our forever. Explore our wedding venue in an interactive 3D experience." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return <WeddingWalkthrough />;
}
