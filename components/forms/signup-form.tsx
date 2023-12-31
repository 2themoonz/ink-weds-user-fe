"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { signUpSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
import { cognitoClient } from "@/lib/aws/cognito";
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { awsConfig } from "@/config/aws";
import { useToast } from "@/components/ui/use-toast";

type Inputs = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: Inputs) {
    // if (!isLoaded) return;

    startTransition(async () => {
      try {
        await cognitoClient.send(
          new SignUpCommand({
            ClientId: awsConfig.CLIENT_ID,
            Username: data.email,
            Password: data.password,
          })
        );
        toast({
          title: "Success",
          description: "Check your email for a verification code.",
        });
        router.push("/auth/signup/verify-email");
      } catch (ex) {
        console.log({ ex });
      }
      // try {
      //   await signUp.create({
      //     emailAddress: data.email,
      //     password: data.password,
      //   });
      //   // Send email verification code
      //   await signUp.prepareEmailAddressVerification({
      //     strategy: "email_code",
      //   });
      //   router.push("/signup/verify-email");
      //   toast.message("Check your email", {
      //     description: "We sent you a 6-digit verification code.",
      //   });
      // } catch (err) {
      //   catchClerkError(err);
      // }
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="rodneymullen180@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Continue
          <span className="sr-only">Continue to email verification page</span>
        </Button>
      </form>
    </Form>
  );
}
