"use client";
import React from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

const SignInButton = () => {
  return (
    <Button variant="outline" onClick={() => signIn("google")}>
      Sign In
    </Button>
  );
};

export default SignInButton;
