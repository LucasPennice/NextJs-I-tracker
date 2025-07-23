"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Key,
  LogIn,
  RefreshCw,
  Shield,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "create">("create");
  const [userId, setUserId] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [showId, setShowId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateUserId = () => {
    // Generate a secure random ID (in real app, this would be done server-side)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 3 || i === 7 || i === 11) result += "-";
    }
    setGeneratedId(result);
    setUserId(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      router.push(`/${userId}`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication process
    setTimeout(() => {
      if (mode === "login") {
        // In real app, validate ID with backend
        localStorage.setItem("userId", userId);
        router.push(`/${userId}`);
      } else {
        // In real app, register new ID with backend
        localStorage.setItem("userId", generatedId);
        alert("New account created successfully!");
      }
      setIsLoading(false);
    }, 1500);
  };

  const validateId = (id: string) => {
    const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return pattern.test(id);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Meal Tracker</h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-green-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LogIn className="h-4 w-4 inline mr-2" />
            Sign In
          </button>
          <button
            onClick={() => setMode("create")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "create"
                ? "bg-green-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <UserPlus className="h-4 w-4 inline mr-2" />
            Create New
          </button>
        </div>

        {/* Main Card */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-green-400" />
              {mode === "login" ? "Enter Your ID" : "Create New Account"}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {mode === "login"
                ? "Enter your unique ID to access your meal data"
                : "Generate a new secure ID for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "login" ? (
                <div className="space-y-2">
                  <Label htmlFor="userId" className="text-zinc-300">
                    Your ID
                  </Label>
                  <div className="relative">
                    <Input
                      id="userId"
                      type={showId ? "text" : "password"}
                      value={userId}
                      onChange={(e) => setUserId(e.target.value.toUpperCase())}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      className="bg-zinc-900 border-zinc-700 text-white pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowId(!showId)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showId ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {userId && !validateId(userId) && (
                    <p className="text-red-400 text-sm">
                      ID format should be: XXXX-XXXX-XXXX-XXXX
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Your New ID</Label>
                    {generatedId ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            type={showId ? "text" : "password"}
                            value={generatedId}
                            readOnly
                            className="bg-zinc-900 border-zinc-700 text-white pr-20"
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                            <button
                              type="button"
                              onClick={copyToClipboard}
                              className="p-1 text-zinc-400 hover:text-white"
                              title="Copy ID"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowId(!showId)}
                              className="p-1 text-zinc-400 hover:text-white"
                              title="Toggle visibility"
                            >
                              {showId ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        {copied && (
                          <Badge className="bg-green-900 text-green-300">
                            ID copied to clipboard!
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={generateUserId}
                        variant="outline"
                        className="w-full bg-zinc-700 border-zinc-600 text-zinc-300 hover:bg-zinc-600"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generate Secure ID
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (mode === "login" && !validateId(userId)) ||
                  (mode === "create" && !generatedId)
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : mode === "login" ? (
                  <LogIn className="h-4 w-4 mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                {isLoading
                  ? "Processing..."
                  : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <div className="space-y-3">
          <Alert className="bg-amber-900/40 border-none">
            <AlertTriangle className="h-6 w-6" color="orange" />
            <AlertDescription className="text-amber-200">
              <strong>Important:</strong> This app will automatically remember
              your ID unless you clear your browser cache.
            </AlertDescription>
          </Alert>

          <Alert className="bg-blue-900/40 border-none">
            <Shield className="h-4 w-4" color="blue" />
            <AlertDescription className="text-blue-200">
              <strong>Keep your ID secure:</strong> Store it in a safe place and
              never share it with others. Anyone with your ID can access your
              meal data.
            </AlertDescription>
          </Alert>
        </div>

        {/* Additional Info */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-400">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-black text-xs font-bold mt-0.5">
                1
              </div>
              <div className="flex-1">
                <p className="text-zinc-300 font-medium">Your ID is your key</p>
                <p>
                  Use your unique ID to access your personal meal tracking data
                  securely.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-black text-xs font-bold mt-0.5">
                2
              </div>
              <div className="flex-1">
                <p className="text-zinc-300 font-medium">Automatic login</p>
                <p>
                  The app remembers your ID locally, so you won&apos;t need to
                  enter it every time.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-black text-xs font-bold mt-0.5">
                3
              </div>
              <div className="flex-1">
                <p className="text-zinc-300 font-medium">Backup your ID</p>
                <p>
                  Save your ID somewhere safe - you&apos;ll need it if you clear
                  your browser data or use a new device.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
