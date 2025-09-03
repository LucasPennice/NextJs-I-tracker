"use client";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { NavigationMenu } from "../../components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { DialogClose } from "@radix-ui/react-dialog";
import { PopoverClose } from "@radix-ui/react-popover";
import { LogOutIcon, Plus, SearchIcon, X } from "lucide-react";
import Image from "next/image";
import { clearAllCookies } from "../utils";
import { MutateFoodForm } from "./MutateFoodForm";
import { SearchCombobox } from "./SearchCombobox";

import { Skeleton } from "../../components/ui/skeleton";
import { MealDataOnly } from "../../entities/Meal";
import { UserDataOnly } from "../../entities/User";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ActiveDialogContext,
  QueryContext,
  SearchContext,
  UserDataContext,
} from "../context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeDialogId, setActiveDialogId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [userData, setUserData] = useState<UserDataOnly | null>(null);

  const router = useRouter();

  const addNewMeal = (newMeal: MealDataOnly) => {
    setUserData((prev) => {
      if (!prev) return null;

      return { ...prev, meals: [...prev.meals, newMeal] };
    });

    toast.success("Meal added successfully!");
  };

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
        {userData ? (
          <div className="w-screen flex items-center">
            <Image height={18} width={120} src={"/logo.png"} alt={"logo"} />
            <div className="flex-1"></div>
            <SearchCombobox
              meals={userData.meals}
              open={searchOpen}
              setOpen={setSearchOpen}
              query={query}
              setQuery={setQuery}
              userData={userData}
            />
            <div
              className="hidden sm:flex text-muted-foreground text-sm bg-zinc-900 px-4 py-2 rounded-md mr-2 cursor-pointer hover:scale-95 transition-transform"
              onClick={() => setSearchOpen(true)}
            >
              <span className="mr-4">Search</span>

              <kbd className="bg-zinc-800 text-zinc-500 pointer-events-none inline-flex h-5 items-center gap-1 rounded  px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
            <div
              className="block sm:hidden  bg-zinc-900 px-2 py-2 rounded-md mr-2"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon size={20} color="#D4D4D8" />
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
                  mode="adding"
                  userId={userData._id}
                  close={() => setActiveDialogId(null)}
                  mutateMeal={addNewMeal}
                  userBaselineSensitivity={userData.insulinSensitivity}
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
        ) : (
          <div className="w-screen flex items-center">
            <Image height={18} width={120} src={"/logo.png"} alt={"logo"} />
            <div className="flex-1"></div>
            <Skeleton className="hidden sm:flex text-muted-foreground text-sm bg-zinc-900 px-4 py-2 rounded-md mr-2 cursor-pointer hover:scale-95 transition-transform">
              <span className="mr-4">Search</span>

              <kbd className="bg-zinc-800 text-zinc-500 pointer-events-none inline-flex h-5 items-center gap-1 rounded  px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Skeleton>
            <Skeleton className="block sm:hidden  bg-zinc-900 px-2 py-2 rounded-md mr-2">
              <SearchIcon size={20} color="#D4D4D8" />
            </Skeleton>
            <Skeleton className="bg-green-500/30 border-none whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs hover:bg-green-400/40  h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer mr-2 w-[120px]">
              <div className="flex items-center justify-center gap-2">
                <Plus className="h-4 w-4 text-green-400" />
                <div className="text-md font-bold text-green-400">Add Meal</div>
              </div>
            </Skeleton>
            <Skeleton className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 bg-zinc-500/10 text-zinc-300 cursor-pointer mr-2">
              <LogOutIcon />
            </Skeleton>
          </div>
        )}
      </NavigationMenu>
      <ActiveDialogContext.Provider
        value={{ activeDialogId, setActiveDialogId }}
      >
        <SearchContext.Provider value={{ searchOpen, setSearchOpen }}>
          <QueryContext.Provider value={{ query, setQuery }}>
            <UserDataContext.Provider value={{ userData, setUserData }}>
              {children}
            </UserDataContext.Provider>
          </QueryContext.Provider>
        </SearchContext.Provider>
      </ActiveDialogContext.Provider>
    </div>
  );
}
