"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
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
import { awsConfig } from "@/config/aws";
import { cognitoClient } from "@/lib/aws/cognito";
import { authSchema } from "@/lib/validations/auth";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "universal-cookie";

const cookies = new Cookies();

type Inputs = z.infer<typeof authSchema>;

export function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();
  // const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, startTransition] = React.useTransition();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: any) {
    startTransition(async () => {
      try {
        const res = await cognitoClient.send(
          new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: awsConfig.CLIENT_ID,
            AuthParameters: {
              USERNAME: data?.email,
              PASSWORD: data?.password,
            },
          })
        );

        const { AuthenticationResult } = res;

        if (AuthenticationResult) {
          const { AccessToken, IdToken, RefreshToken } = AuthenticationResult;

          cookies.set("access_token", AccessToken, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });

          cookies.set("id_token", IdToken, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });

          cookies.set("refresh_token", RefreshToken, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        }

        router.push("/");
      } catch (ex: any) {
        toast({
          title: "Error",
          description: ex.message,
          // status: "error",
        });
      }
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
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  );
}
