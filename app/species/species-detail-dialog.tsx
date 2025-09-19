"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Database } from "@/lib/schema";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailDialog({ species }: { species: Species }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
          <DialogDescription>{species.common_name}</DialogDescription>
        </DialogHeader>

        {species.image && (
          <div className="relative h-48 w-full mb-4">
            <Image
              src={species.image}
              alt={species.scientific_name}
              fill
              style={{ objectFit: "cover" }}
              className="rounded"
            />
          </div>
        )}

        <div className="space-y-2">
          <p>
            <strong>Kingdom:</strong> {species.kingdom}
          </p>
          {species.total_population && (
            <p>
              <strong>Total Population:</strong> {species.total_population.toLocaleString()}
            </p>
          )}
          {species.description && (
            <p>
              <strong>Description:</strong> {species.description}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
