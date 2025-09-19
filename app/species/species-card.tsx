"use client";

import type { Database } from "@/lib/schema";
import Image from "next/image";
import SpeciesDetailDialog from "./species-detail-dialog";
import EditSpeciesDialog from "./edit-species-dialog";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard({ species, sessionId }: { species: Species; sessionId: string }) {
  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      <SpeciesDetailDialog species={species} />
      {species.author === sessionId && <EditSpeciesDialog species={species} />}
    </div>
  );
}
