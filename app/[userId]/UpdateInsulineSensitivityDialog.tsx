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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InsulinSensitivityEntry, UserDataOnly } from "@/entities/user.entity";
import { DialogClose } from "@radix-ui/react-dialog";
import { Droplets, Edit, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useUserDataContext } from "../context";

export function UpdateInsulineSensitivityDialog({
  item,
  updateInsulinSensitivity,
  close,
  open,
  setActiveDialogId,
}: {
  item?: InsulinSensitivityEntry;
  updateInsulinSensitivity: (value: number) => InsulinSensitivityEntry[];
  setActiveDialogId: (value: string | null) => void;
  close: () => void;
  open: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const { userData } = useUserDataContext();

  const formSchema = z.object({
    value: z
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
  });

  const [formData, setFormData] = useState<z.infer<typeof formSchema>>({
    value: item?.value ?? 0,
  });

  const handleInputChange = (
    field: keyof z.infer<typeof formSchema>,
    value: number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    setLoading(true);

    e.preventDefault();

    const parse = formSchema.safeParse(formData);

    if (parse.success === false) {
      const issues = parse.error.issues.map((e) => `${e.path}: ${e.message}`);

      for (const issue of issues) {
        toast.warning(issue);
      }

      setLoading(false);

      return;
    }

    try {
      if (!userData) throw new Error("User data not found");

      const updatedHistorical = updateInsulinSensitivity(formData.value);

      await editInsulinSensitivity(userData._id, {
        historialInsulinSensitivity: updatedHistorical,
        insulinSensitivity: formData.value,
      });
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }

    close();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setActiveDialogId(open ? "insulinSensitivity" : null);
      }}
    >
      <DialogTrigger
        className="absolute right-4 top-0 z-30 cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setActiveDialogId("insulinSensitivity")}
      >
        <div className="bg-zinc-700 p-3 rounded-md">
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

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  Update Insulin Sensitivity
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Select the new insulin sensitivity value for today, can be
                  edited within the day. This measures how many grams of
                  carbohydrates one unit of insulin can cover.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="carbs" className="text-zinc-300">
                      Insulin Sensitivity (g/U) *
                    </Label>
                    <Input
                      id="carbs"
                      type="number"
                      step="0.1"
                      min={0}
                      value={formData.value}
                      onChange={(e) =>
                        handleInputChange("value", parseFloat(e.target.value))
                      }
                      placeholder="30"
                      className="bg-zinc-900 border-zinc-700 text-white"
                      required
                    />
                  </div>
                </div>

                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-6 cursor-pointer"
                  size="lg"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Droplets className="h-4 w-4 mr-2" />
                  )}
                  {loading ? " Processing..." : " Update Insulin Sensitivity"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

async function editInsulinSensitivity(
  userId: string,
  body: Pick<UserDataOnly, "historialInsulinSensitivity" | "insulinSensitivity">
): Promise<UserDataOnly> {
  const res = await fetch(`/api/user/${userId}/insulinSensitivity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to update insulin sensitivity");
  }

  return await res.json();
}
