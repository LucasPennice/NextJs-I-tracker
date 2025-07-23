"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Dashboard from "./Dashboard";
import { clearAllCookies } from "../utils";

export interface Meal {
  id: string;
  name: string;
  imageUrl: string;
  carbs: number;
  insulin: number;
  description: string;
  last_updated: Date;
}

export interface UserData {
  meals: Meal[];
  historialInsulinSensitivity: { date: Date; value: number }[];
  insulinSensitivity: number;
}

export const userData = {
  insulinSensitivity: 11,
  historialInsulinSensitivity: [
    { date: new Date("2025-07-16"), value: 4 },
    { date: new Date("2025-07-17"), value: 11 },
    { date: new Date("2025-07-18"), value: 7 },
    { date: new Date("2025-07-19"), value: 15 },
    { date: new Date("2025-07-20"), value: 9 },
    { date: new Date("2025-07-21"), value: 13 },
    { date: new Date("2025-07-22"), value: 6 },
  ],
  meals: [
    {
      id: "1",
      name: "Avocado Toast with Eggs",

      imageUrl: "/placeholder.svg?height=200&width=300",
      carbs: 35,
      insulin: 4,
      last_updated: new Date(),
      description:
        "Whole grain toast topped with mashed avocado and perfectly poached eggs",
    },
    {
      id: "2",
      name: "Greek Yogurt Parfait",
      last_updated: new Date(),
      imageUrl: "/placeholder.svg?height=200&width=300",
      carbs: 28,
      insulin: 3,

      description:
        "Creamy Greek yogurt layered with fresh berries and crunchy granola",
    },
    {
      id: "3",
      name: "Grilled Chicken Salad",
      last_updated: new Date(),
      imageUrl: "/placeholder.svg?height=200&width=300",
      carbs: 15,
      insulin: 2,

      description:
        "Fresh mixed greens with grilled chicken breast, cherry tomatoes, and light vinaigrette",
    },
    {
      id: "4",
      name: "Quinoa Buddha Bowl",
      last_updated: new Date(),
      imageUrl: "/placeholder.svg?height=200&width=300",
      carbs: 45,
      insulin: 5,

      description:
        "Nutritious quinoa bowl with roasted vegetables, chickpeas, and tahini dressing",
    },
    {
      id: "5",
      name: "Salmon with Sweet Potato",
      last_updated: new Date(),
      imageUrl: "/placeholder.svg?height=200&width=300",
      carbs: 30,
      insulin: 3,

      description:
        "Pan-seared salmon with roasted sweet potato and steamed asparagus",
    },
    {
      id: "6",
      name: "Pasta Primavera",
      last_updated: new Date(),
      imageUrl: "/placeholder.svg?height=200&width=300",
      carbs: 60,
      insulin: 7,

      description:
        "Whole wheat pasta with seasonal vegetables in a light garlic olive oil sauce",
    },
    {
      id: "7",
      name: "Turkey Meatballs",
      last_updated: new Date(),
      imageUrl: "/placeholder.svg?height=200&width=300",
      carbs: 25,
      insulin: 3,

      description:
        "Lean turkey meatballs in homemade marinara sauce with herbs",
    },
    {
      id: "8",
      name: "Apple with Almond Butter",
      last_updated: new Date(),
      imageUrl: "/placeholder.svg?height=200&width=300",
      carbs: 20,
      insulin: 2,

      description:
        "Fresh apple slices with natural almond butter for a protein-rich snack",
    },
    {
      id: "9",
      name: "Mixed Berry Smoothie",
      last_updated: new Date(),
      imageUrl: "/placeholder.svg?height=200&width=300",
      carbs: 32,
      insulin: 4,

      description:
        "Antioxidant-rich smoothie with mixed berries, banana, and protein powder",
    },
  ],
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUserData(data);

        console.log(data);
        toast.error("User not found");
        if (!data) {
          clearAllCookies();
          return router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error(`Error fetching user data ${error}`);
        clearAllCookies();
        return router.push("/");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>loading</div>;

  return <Dashboard />;
}
