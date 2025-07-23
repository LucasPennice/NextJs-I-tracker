"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogClose } from "@radix-ui/react-dialog";
import { PopoverClose } from "@radix-ui/react-popover";
import Fuse from "fuse.js";
import {
  Droplet,
  Droplets,
  Edit,
  FileWarning,
  LogOutIcon,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { toast } from "sonner";
import { checkInsulinMissmatch, clearAllCookies } from "../utils";
import { MutateFoodForm } from "./MutateFoodForm";
import { SearchCombobox } from "./SearchCombobox";
import { UpdateInsulineSensitivityDialog } from "./UpdateInsulineSensitivityDialog";
import { Meal, userData } from "./page";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2D7FC8",
  },
  mobile: {
    label: "Mobile",
    color: "#2D7FC8",
  },
} satisfies ChartConfig;

export default function Dashboard() {
  const [activeDialogId, setActiveDialogId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [meals, setMeals] = useState<Meal[]>(userData.meals);
  const [query, setQuery] = useState("");
  const [userInsulinSensitivity, setUserInsulinSensitivity] = useState(
    userData.historialInsulinSensitivity
  );

  const fuse = useMemo(
    () =>
      new Fuse(meals, {
        keys: ["name"],
        threshold: 0.5,
      }),
    [meals]
  );

  const filteredMeals = query ? fuse.search(query).map((r) => r.item) : meals;

  const updateMeal = (updated: Meal) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === updated.id ? updated : meal))
    );
    toast.success("Meal updated successfully!");
  };

  const addNewMeal = (newMeal: Meal) => {
    setMeals((prev) => [...prev, newMeal]);
    toast.success("Meal added successfully!");
  };

  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setQuery("");
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <NavigationMenu className="sticky top-0 h-14 bg-zinc-800 border-zinc-700 px-4 py-2 z-40">
        <div className="w-screen flex items-center">
          Hpña
          <div className="flex-1"></div>
          <SearchCombobox
            meals={meals}
            open={searchOpen}
            setOpen={setSearchOpen}
            query={query}
            setQuery={setQuery}
            userData={userData}
          />
          <div
            className="text-muted-foreground text-sm bg-zinc-900 px-4 py-2 rounded-md mr-2 cursor-pointer hover:scale-95 transition-transform"
            onClick={() => setSearchOpen(true)}
          >
            <span className="mr-4">Search</span>

            <kbd className="bg-zinc-800 text-zinc-500 pointer-events-none inline-flex h-5 items-center gap-1 rounded  px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <Card
            className="bg-green-500/30 border-none whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs hover:bg-green-400/40  h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer mr-2 w-[120px]"
            onClick={() => setActiveDialogId("newMeal")}
          >
            <CardContent className="flex items-center justify-center gap-2">
              <Plus className="h-4 w-4 text-green-400" />
              <div className="text-md font-bold text-green-400">Add Meal</div>
            </CardContent>
          </Card>
          <Dialog
            open={activeDialogId === "newMeal"}
            onOpenChange={(open) => {
              setActiveDialogId(open ? "newMeal" : null);
            }}
          >
            <DialogContent
              showCloseButton={false}
              className="p-0 m-0 border-none bg-transparent"
            >
              <DialogClose asChild>
                <button className="absolute right-4 top-4 rounded-md bg-zinc-700 p-2 hover:bg-zinc-600 cursor-pointer">
                  <X className="h-4 w-4 text-white" />
                </button>
              </DialogClose>
              <DialogHeader className="hidden">
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <MutateFoodForm
                close={() => setActiveDialogId(null)}
                mutateMeal={addNewMeal}
              />
            </DialogContent>
          </Dialog>
          <Popover>
            <PopoverTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 bg-zinc-500/10 text-zinc-300 cursor-pointer mr-2">
              <LogOutIcon />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 bg-zinc-800 border-zinc-700 text-white items-center">
              <div>Confirm</div>
              <div className="flex w-full">
                <PopoverClose className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 mr-2 bg-gray-500/10 text-white cursor-pointer flex-1">
                  No
                </PopoverClose>
                <Button
                  className="mr-2 bg-red-500/10 text-red-500 cursor-pointer flex-1"
                  onClick={() => {
                    clearAllCookies();
                    router.push("/");
                  }}
                >
                  Yes
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </NavigationMenu>

      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Stats Overview */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Card className="bg-zinc-800 border-zinc-700 flex-1">
            <CardContent className="p-4 text-center relative">
              <UpdateInsulineSensitivityDialog
                open={activeDialogId === "insulinSensitivity"}
                setActiveDialogId={setActiveDialogId}
                close={() => setActiveDialogId(null)}
                item={(() => {
                  const today = new Date().toISOString().slice(0, 10); // "2025-07-22"

                  const item = userInsulinSensitivity.find(
                    (entry) =>
                      new Date(entry.date).toISOString().slice(0, 10) === today
                  );

                  return item;
                })()}
                updateInsulinSensitivity={(newValue: number) => {
                  if (entryAlredyInToday(userInsulinSensitivity)) {
                    const newArr = [...userInsulinSensitivity];
                    newArr[newArr.length - 1] = {
                      date: new Date(),
                      value: newValue,
                    };
                    setUserInsulinSensitivity(newArr);
                  } else {
                    setUserInsulinSensitivity((prev) => [
                      ...prev,
                      { date: new Date(), value: newValue },
                    ]);
                  }
                }}
              />

              <ChartContainer
                config={chartConfig}
                className="max-h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart accessibilityLayer data={userInsulinSensitivity}>
                    <CartesianGrid
                      vertical={false}
                      stroke="#353535" // Tailwind zinc-700
                    />
                    <Legend
                      wrapperStyle={{
                        color: "#cbd5e1", // zinc-300
                        fontSize: "0.875rem",
                      }}
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      tick={{ fill: "#94b1b8" }}
                      axisLine={false}
                      tickFormatter={(value) => value.toLocaleDateString()}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || payload.length === 0)
                          return null;

                        const item = payload[0].payload;

                        return (
                          <div className="bg-zinc-700 text-zinc-300 rounded-md px-4 py-2 text-md">
                            <span className="text-lg font-bold">
                              {item.value}u
                            </span>{" "}
                            insulin sensitivity at{" "}
                            <span className="text-lg font-bold">
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                        );
                      }}
                    />

                    <Bar
                      dataKey="value"
                      name="Insulin Sensitivity"
                      fill="var(--color-desktop)"
                      radius={4}
                      activeBar={false}
                      background={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Meal Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMeals
            .sort((a, b) => b.last_updated.getTime() - a.last_updated.getTime())
            .map((meal) => {
              const estimatedInsulin = (
                meal.carbs / userData.insulinSensitivity
              ).toFixed(4);

              const insulinMissmatch = checkInsulinMissmatch(
                parseFloat(estimatedInsulin),
                meal.insulin
              );

              return (
                <Card
                  key={meal.id}
                  className="bg-zinc-800 border-zinc-700 overflow-hidden hover:bg-zinc-750 transition-colors relative pt-0"
                >
                  <Dialog
                    key={`dialog_${meal.id}`}
                    open={activeDialogId === meal.id}
                    onOpenChange={(open) => {
                      setActiveDialogId(open ? meal.id : null);
                    }}
                  >
                    <DialogTrigger className="absolute right-4 top-4 z-30 cursor-pointer hover:scale-105 transition-transform">
                      <div className="bg-zinc-800 p-3 rounded-md">
                        <Edit color="white" size={16} />
                      </div>
                    </DialogTrigger>
                    <DialogContent
                      showCloseButton={false}
                      className="p-0 m-0 border-none bg-transparent"
                    >
                      <DialogClose asChild>
                        <button className="absolute right-4 top-4 rounded-md bg-zinc-700 p-2 hover:bg-zinc-600 cursor-pointer">
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </DialogClose>
                      <DialogHeader className="hidden">
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      <MutateFoodForm
                        close={() => setActiveDialogId(null)}
                        meal={meal}
                        mutateMeal={updateMeal}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Meal imageUrl */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      width={300}
                      height={300}
                      src={meal.imageUrl || "/placeholder.svg"}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <CardHeader>
                    <CardTitle className="text-white text-lg">
                      {meal.name}
                    </CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">
                      {meal.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Nutrition Info */}
                    <div className="flex gap-2">
                      <div className="bg-zinc-900 p-3 rounded-md flex flex-col justify-between gap-2">
                        <div>
                          <p className="text-orange-400 text-bold text-2xl">
                            C
                          </p>
                          <p className="text-sm text-zinc-400">Carbs</p>
                        </div>

                        <div>
                          <span className="text-2xl font-bold text-white">
                            {meal.carbs}
                          </span>
                          <span className="text-md font-bold text-white/50 ml-1">
                            g
                          </span>
                        </div>
                      </div>

                      <div className="bg-zinc-900 p-3 rounded-md flex flex-col justify-between gap-2 ">
                        <div>
                          <Droplet className="h-6 w-6 text-green-400" />
                          <span className="text-sm text-zinc-400">
                            Insulin Applied
                          </span>
                        </div>

                        <div>
                          <span className="text-2xl font-bold text-white">
                            {meal.insulin}
                          </span>
                          <span className="text-md font-bold text-white/50 ml-1">
                            u
                          </span>
                        </div>
                      </div>

                      <div className="bg-zinc-900 p-3 rounded-md flex flex-col justify-between gap-2 ">
                        <div>
                          <Droplets className="h-6 w-6 text-cyan-400" />

                          <span className="text-sm text-zinc-400">
                            Estimated Insulin
                          </span>
                        </div>

                        <div>
                          <span className="text-2xl font-bold text-white">
                            {estimatedInsulin}
                          </span>
                          <span className="text-md font-bold text-white/50 ml-1">
                            u
                          </span>
                        </div>
                      </div>
                    </div>

                    {insulinMissmatch && (
                      <div className="bg-orange-700/20 p-3 rounded-md items-center flex gap-4 mt-4">
                        <FileWarning className="h-6 w-6 text-orange-400" />
                        <div className="text-orange-400 flex-1">
                          There&apos;s a discrepancy between the estimated
                          insulin and the last recorded value
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}

const entryAlredyInToday = (
  userInsulinSensitivity: typeof userData.historialInsulinSensitivity
) => {
  const today = new Date().toISOString().slice(0, 10); // "2025-07-22"

  const item = userInsulinSensitivity.find(
    (entry) => new Date(entry.date).toISOString().slice(0, 10) === today
  );

  if (item === undefined) return false;

  return true;
};
