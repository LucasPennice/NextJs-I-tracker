"use client";
import { CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { UserDataOnly } from "../../entities/User";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { clearAllCookies } from "../utils";
import Dashboard from "./Dashboard";
import { useUserDataContext } from "../context";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { userData, setUserData } = useUserDataContext();

  const router = useRouter();
  const params = useParams();
  const urlId = `${params.userId}`;

  useEffect(() => {
    (async () => {
      try {
        const userDataRes = await fetchUserData(urlId);

        setUserData(userDataRes);
      } catch (error) {
        console.error(error);
        toast.error(`${error}`);
        clearAllCookies();
        return router.push("/");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !userData) return <LoadingDashboardSkeleton />;

  return <Dashboard userData={userData} />;
}

async function fetchUserData(_id: string): Promise<UserDataOnly> {
  const res = await fetch(`/api/user/${_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status == 404) {
    throw new Error("User not found");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  const result = await res.json();

  return result;
}

const LoadingDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Stats Overview */}
        <Skeleton className="bg-zinc-800 border-zinc-700 h-[282px] w-full mb-8" />

        {/* Meal Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item, index) => {
            return (
              <div
                key={index}
                className="bg-zinc-800 border-zinc-700 overflow-hidden hover:bg-zinc-750 transition-colors relative pt-0 rounded-md flex flex-col gap-6"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    width={300}
                    height={300}
                    src={"/placeholder.svg"}
                    alt={"Placeholder"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <Skeleton className="bg-zinc-700 text-lg text-transparent mx-4">
                  a
                </Skeleton>
                <Skeleton className="bg-zinc-700 text-sm text-transparent mx-4">
                  a
                </Skeleton>

                <CardContent className="pt-0">
                  <div className="flex gap-2 pb-3 h-[116px]">
                    <div className="bg-zinc-900 p-3 rounded-md flex flex-col justify-between gap-2 flex-1" />

                    <div className="bg-zinc-900 p-3 rounded-md flex flex-col justify-between gap-2 flex-1" />

                    <div className="bg-zinc-900 p-3 rounded-md flex flex-col justify-between gap-2 flex-1" />
                  </div>
                </CardContent>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
