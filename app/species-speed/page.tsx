/* eslint-disable */
import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import AnimalSpeedGraph from "./animal-speed-graph";



export default async function SpeciesSpeedPage() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // Render the intro + graph
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species Speed</TypographyH2>
        {/* You could add a button or dialog here if needed */}
      </div>
      <Separator className="my-4" />
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Top 10 Fastest Animals by Diet</h1>
        <p className="text-white-700">
          This bar chart compares the average speeds of the top 10 fastest animals in our dataset, grouped by their diet type: carnivore, herbivore, or omnivore. Each bar represents one animal, with its height corresponding to its average speed (km/h). Colors indicate diet, allowing for quick visual comparison across dietary groups. The chart highlights patterns such as carnivores generally being faster than herbivores and omnivores, and provides an easy-to-read visualization of animal mobility differences.
        </p>
      </section>
      <AnimalSpeedGraph />
    </>
  );
}
