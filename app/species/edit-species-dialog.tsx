"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Database } from "@/lib/schema";

type Species = Database["public"]["Tables"]["species"]["Row"];

const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

const speciesSchema = z.object({
  scientific_name: z.string().trim().min(1),
  common_name: z.string().nullable(),
  kingdom: kingdoms,
  total_population: z.number().int().positive().min(1).nullable(),
  image: z.string().url().nullable(),
  description: z.string().nullable(),
});

type FormData = z.infer<typeof speciesSchema>;

export default function EditSpeciesDialog({ species }: { species: Species }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      scientific_name: species.scientific_name ?? "",
      common_name: species.common_name,
      kingdom: species.kingdom as any,
      total_population: species.total_population,
      image: species.image,
      description: species.description,
    },
  });

  const onSubmit = async (input: FormData) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from("species")
      .update({
        scientific_name: input.scientific_name,
        common_name: input.common_name,
        kingdom: input.kingdom,
        total_population: input.total_population,
        image: input.image,
        description: input.description,
      })
      .eq("id", species.id);

    if (error) {
      return toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setOpen(false);
    router.refresh();

    return toast({
      title: "Species updated",
      description: `${input.scientific_name} was updated successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="mt-2 w-full">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
          <DialogDescription>Update this species’ information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
            <div className="grid w-full items-center gap-4">

              <FormField
                control={form.control}
                name="scientific_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scientific Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Cavia porcellus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="common_name"
                render={({ field }) => {
                const { value, ...rest } = field;
                return (
                    <FormItem>
                        <FormLabel>Common Name</FormLabel>
                        <FormControl>
                            <Input value={value ?? ""} placeholder="Guinea pig" {...rest} />
                        </FormControl>
                    <FormMessage />
                    </FormItem>
                    );
                }}
                />

              <FormField
                control={form.control}
                name="kingdom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kingdom</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a kingdom" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {kingdoms.options.map((k) => (
                            <SelectItem key={k} value={k}>
                              {k}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_population"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Population</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        placeholder="300000"
                        onChange={(e) => field.onChange(e.target.value ? +e.target.value : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => {
                    const { value, ...rest } = field;
                    return (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                                <Input value={value ?? ""} placeholder="https://example.com/pic.jpg" {...rest} />
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                        );
                    }}
                    />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                    const { value, ...rest } = field;
                    return (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input value={value ?? ""} placeholder="Species description..." {...rest} />
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                        );
                    }}
                    />

              <div className="flex">
                <Button type="submit" className="ml-1 mr-1 flex-auto">
                  Save Changes
                </Button>
                <DialogClose asChild>
                  <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
