"use client";
import { Badge } from "../../components/ui/badge";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import { DialogClose } from "@radix-ui/react-dialog";
import { Droplet, Droplets, X } from "lucide-react";
import { useEffect } from "react";
import { MealDataOnly } from "../../entities/Meal";
import { UserDataOnly } from "../../entities/User";

export function SearchCombobox({
  meals,
  open,
  setOpen,
  query,
  setQuery,
  userData,
}: {
  meals: MealDataOnly[];
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  userData: UserDataOnly;
}) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Enter") {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  return (
    <CommandDialog
      showCloseButton={false}
      open={open}
      onOpenChange={setOpen}
      className="border-zinc-700"
    >
      <DialogClose asChild>
        <button className="absolute right-2 top-2 rounded-md bg-zinc-700 p-2 hover:bg-zinc-600 cursor-pointer">
          <X className="h-4 w-4 text-zinc-400" />
        </button>
      </DialogClose>

      <CommandInput
        autoFocus
        value={query}
        // @ts-expect-error "e.target.value type error, value's there"
        onInput={(e) => setQuery(e.target.value)}
        placeholder="Search meal..."
        className="h-9"
      />
      <CommandList>
        <CommandGroup>
          {meals.map((meal) => {
            const estimatedInsulin = (
              meal.carbs / userData.insulinSensitivity
            ).toFixed(4);

            return (
              <CommandItem key={meal._id}>
                <div className="flex items-center w-full">
                  <span className="truncate max-w-[120px] sm:max-w-[300px]">
                    {meal.name}
                  </span>

                  <div className="flex-1"></div>

                  <Badge className="mr-1 flex items-center bg-green-500/10 text-green-500 w-[60px] font-bold">
                    <Droplet color="green" />
                    {meal.insulin}u
                  </Badge>

                  <Badge className="mr-1 flex items-center bg-cyan-500/10 text-cyan-500 w-[80px] font-bold">
                    <Droplets color="cyan" />
                    {estimatedInsulin}u
                  </Badge>

                  <Badge className="flex items-center bg-yellow-500/10 text-yellow-500 w-[60px] font-bold">
                    <span className="font-bold">C</span>
                    {meal.carbs}gr
                  </Badge>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
