"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Droplet, Save, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Meal } from "./page";

export const MutateFoodForm = ({
  close,
  meal,
  mutateMeal,
}: {
  close: () => void;
  meal?: Meal;
  mutateMeal: (newMeal: Meal) => void;
}) => {
  const formSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().min(0).max(100),
    carbs: z
      .number()
      .min(1, "Must be a positive number greater than 0")
      .max(1000, "Cannot exceed 1000g")
      .refine(
        (val) => {
          const decimalPart = val.toString().split(".")[1];
          return !decimalPart || decimalPart.length <= 2;
        },
        {
          message: "Maximum of 2 decimal places allowed",
        }
      ),
    insulin: z
      .number()
      .min(1, "Must be a positive number greater than 0")
      .max(100, "Cannot exceed 100 units")
      .refine(
        (val) => {
          const decimalPart = val.toString().split(".")[1];
          return !decimalPart || decimalPart.length <= 4;
        },
        {
          message: "Maximum of 4 decimal places allowed",
        }
      ),
    image: z.file().or(z.null()).or(z.string()),
  });

  const [formData, setFormData] = useState<z.infer<typeof formSchema>>({
    name: meal?.name ?? "",
    description: meal?.description ?? "",
    carbs: meal?.carbs ?? 0,
    insulin: meal?.insulin ?? 0,
    image: meal?.imageUrl ?? null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof z.infer<typeof formSchema>,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parse = formSchema.safeParse(formData);

    if (parse.success === false) {
      const issues = parse.error.issues.map((e) => `${e.path}: ${e.message}`);

      for (const issue of issues) {
        toast.warning(issue);
      }

      return;
    }

    alert(
      "acordate de ir al back a guardar la comida y la imagen y conseguir el id"
    );
    mutateMeal({
      id: meal?.id ?? `${Math.random()}`,
      ...formData,
      imageUrl: "",
      last_updated: new Date(),
    });

    close();
  }

  return (
    <div className="rounded-md max-h-screen overflow-y-scroll bg-zinc-900 text-zinc-100 py-8">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-2 text-white">Add New Food</h1>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white">Food Image</CardTitle>
                <CardDescription className="text-zinc-400">
                  Upload an image of your food item
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Image
                    width={300}
                    height={300}
                    src={imagePreview || "/placeholder.svg"}
                    alt="Food preview"
                    className="w-full h-48 object-cover rounded-md"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Take Photo or Upload Image
                  </Label>
                </div>
              </CardContent>
            </Card>
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Enter the basic details about your food item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-zinc-300">
                      Food Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="e.g., Grilled Chicken Salad"
                      className="bg-zinc-900 border-zinc-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-zinc-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={`${formData.description}`}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe the food item, ingredients, or preparation method..."
                      className="bg-zinc-900 border-zinc-700 text-white min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="carbs" className="text-zinc-300">
                        Carbohydrates (g) *
                      </Label>
                      <Input
                        id="carbs"
                        type="number"
                        step="0.1"
                        min={0}
                        value={formData.carbs}
                        onChange={(e) =>
                          handleInputChange("carbs", parseFloat(e.target.value))
                        }
                        placeholder="30"
                        className="bg-zinc-900 border-zinc-700 text-white"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insulin Information */}
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-green-400" />
                    Insulin Estimation
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    How much insulin you think you need for this food item, you
                    can edit later
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex-1">
                    <Label htmlFor="insulin" className="text-zinc-300">
                      Insulin Units Required *
                    </Label>
                    <Input
                      id="insulin"
                      type="number"
                      step="0.1"
                      min={0}
                      value={formData.insulin}
                      onChange={(e) =>
                        handleInputChange("insulin", parseFloat(e.target.value))
                      }
                      placeholder="2.5"
                      className="bg-zinc-900 border-zinc-700 text-white"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Add Food Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
