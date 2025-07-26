"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GlowingEffect } from "@/components/ui/glowing-effect";
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
import { MealDataOnly } from "@/entities/meal.entity";
import { InsulinSensitivityEntry, UserDataOnly } from "@/entities/user.entity";
import { Image, ImageKitProvider } from "@imagekit/next";
import { DialogClose } from "@radix-ui/react-dialog";
import Fuse from "fuse.js";
import NextImage from "next/image";
import {
  ChevronRight,
  Clipboard,
  Droplet,
  Droplets,
  Edit,
  FileWarning,
  Plus,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { toast } from "sonner";
import {
  useActiveDialogContext,
  useQueryContext,
  useUserDataContext,
} from "../context";
import { checkInsulinMissmatch } from "../utils";
import { MutateFoodForm } from "./MutateFoodForm";
import { UpdateInsulineSensitivityDialog } from "./UpdateInsulineSensitivityDialog";

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

export default function Dashboard({ userData }: { userData: UserDataOnly }) {
  const { activeDialogId, setActiveDialogId } = useActiveDialogContext();
  const { query } = useQueryContext();
  const { setUserData } = useUserDataContext();

  const fuse = useMemo(
    () =>
      new Fuse(userData.meals, {
        keys: ["name"],
        threshold: 0.5,
      }),
    [userData.meals]
  );

  const filteredMeals = query
    ? fuse.search(query).map((r) => r.item)
    : userData.meals;

  const updateMeal = (updated: MealDataOnly) => {
    setUserData((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        meals: prev.meals.map((meal) =>
          meal._id === updated._id ? updated : meal
        ),
      };
    });

    toast.success("Meal updated successfully!");
  };

  const updateInsulinSensitivity = (
    newEntry: InsulinSensitivityEntry
  ): InsulinSensitivityEntry[] => {
    let result: InsulinSensitivityEntry[] = [];
    if (entryAlredyInToday(userData.historialInsulinSensitivity)) {
      result = [...userData.historialInsulinSensitivity];
      result[result.length - 1] = newEntry;
    } else {
      result = [...userData.historialInsulinSensitivity, newEntry];
    }

    setUserData((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        insulinSensitivity: newEntry.value,
        historialInsulinSensitivity: result,
      };
    });

    return result;
  };

  const params = useParams();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${params.userId}`);
      toast.success("Login key copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex justify-between gap-4">
          <div
            className="cursor-pointer bg-zinc-800 border-zinc-700 p-4 rounded-md mb-4 relative hover:scale-90 transition-all"
            onClick={copyToClipboard}
          >
            <div className="bg-zinc-700 p-2 rounded-md absolute right-4">
              <Clipboard color="white" size={12} />
            </div>
            <p className="text-md sm:text-xl font-medium mb-2 pr-8 w-[110px] sm:w-fit">
              Your login key is:{" "}
            </p>
            <p className="opacity-45 text-xs truncate max-w-[100px] sm:max-w-[400px] sm:text-md">
              {params.userId}
            </p>
          </div>

          <a
            href="https://www.patreon.com/LucasPennice"
            target="_blank"
            className="flex flex-1 gap-4 items-center justify-between cursor-pointer bg-zinc-800 border-zinc-700 rounded-md mb-4 py-4 relative h-auto border px-4"
          >
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={120}
              inactiveZone={0.01}
            />

            <div>
              <p className="text-md sm:text-xl font-medium mb-2">
                Support Insuline Tracker on Patreon
              </p>
              <p className="text-xs sm:text-md opacity-50">
                Help us stay free and independent
              </p>
            </div>

            <ChevronRight />
          </a>
        </div>
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

                  const item = userData.historialInsulinSensitivity.find(
                    (entry) =>
                      new Date(entry.date).toISOString().slice(0, 10) === today
                  );

                  return item;
                })()}
                updateInsulinSensitivity={(newValue: number) =>
                  updateInsulinSensitivity({
                    value: newValue,
                    date: new Date(),
                  })
                }
              />

              <ChartContainer
                config={chartConfig}
                className="max-h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    accessibilityLayer
                    data={userData.historialInsulinSensitivity}
                  >
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
                      tickFormatter={(_) => new Date().toLocaleDateString()}
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
          {userData.meals.length === 0 && (
            <div className="col-span-full text-center text-zinc-400 flex flex-col justify-center items-center gap-4">
              <p className="font-medium text-xl">No meals found</p>
              <Card
                className="bg-green-500/30 border-none whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs hover:bg-green-400/40  h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer mr-2 w-[120px]"
                onClick={() => setActiveDialogId("newMeal")}
              >
                <CardContent className="flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4 text-green-400" />
                  <div className="text-md font-bold text-green-400">
                    Add Meal
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {filteredMeals
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
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
                  key={meal._id}
                  className="bg-zinc-800 border-zinc-700 overflow-hidden hover:bg-zinc-750 transition-colors relative pt-0"
                >
                  <Dialog
                    key={`dialog_${meal._id}`}
                    open={activeDialogId === meal._id}
                    onOpenChange={(open) => {
                      setActiveDialogId(open ? meal._id : null);
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
                        mode="editing"
                        userId={userData._id}
                        close={() => setActiveDialogId(null)}
                        meal={meal}
                        mutateMeal={updateMeal}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Meal imageUrl */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/golr2f0mv">
                      <Image
                        width={300}
                        height={300}
                        src={
                          meal.imageUrl === ""
                            ? "/placeholder.svg"
                            : meal.imageUrl
                        }
                        alt={meal.name}
                        blurDataURL="data:image/svg+xml;base64,L1Q]+w-;M{-;~qfQfQfQM{fQt7fQ"
                        placeholder={"blur"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </ImageKitProvider>
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
  userInsulinSensitivity: InsulinSensitivityEntry[]
) => {
  const today = new Date().toISOString().slice(0, 10); // "2025-07-22"

  const item = userInsulinSensitivity.find(
    (entry) => new Date(entry.date).toISOString().slice(0, 10) === today
  );

  if (item === undefined) return false;

  return true;
};
