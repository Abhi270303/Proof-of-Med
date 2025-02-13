"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2, LogIn } from "lucide-react";
import React from "react";

const LoginChecker = ({ children }) => {
  const { authenticated, ready, login, logout } = usePrivy();
  console.log(authenticated, ready);
  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-b from-orange-50/50 to-white dark:from-orange-950/20 dark:to-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-600 dark:text-orange-400" />
          <p className="text-sm text-orange-600/80 dark:text-orange-400">
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-b from-orange-50/50 to-white dark:from-orange-950/20 dark:to-background p-4 md:p-6">
        <Card className="max-w-md w-full p-6 sm:p-8 rounded-3xl border-0 shadow-xl shadow-orange-900/5">
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm text-orange-600/80 dark:text-orange-400">
                Please login to continue to the application
              </p>
            </div>

            <Button
              onClick={login}
              size="lg"
              className="w-full h-12 bg-[#EA580B] hover:bg-[#EA580B]/90 text-white rounded-xl transition-all duration-200"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default LoginChecker;
