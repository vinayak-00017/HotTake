"use client";

import { Button } from "@/components/ui/button";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { checkUsername } from "@/lib/actions/user";
import Spinner from "../Spinner";

export function SigninDialog() {
  const [username, setUsername] = useState<string>("");
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [isUsernameTaken, setIsUsernameTaken] = useState<boolean>();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState<string>();
  const [token, setToken] = useState<string>("");

  const handleSignin = () => {
    signIn("credentials", { usernameOrEmail, password });
  };

  const handleGoogle = () => {
    signIn("google");
  };

  const handleNext = () => {
    if (isSignup && step == 1) {
      if (!isValidEmail(email)) {
        return setWarning("Enter a valid email address");
      }
    }
    setWarning("");
    setStep((step) => step + 1);
  };

  const handlePrevious = () => {
    setStep((step) => step - 1);
  };

  const isValidEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleUsernameChange = async (event: any) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    setIsLoading(true);

    if (newUsername.length >= 3) {
      const usernameTaken = await checkUsername(event.target.value);

      if (!usernameTaken) {
        setIsUsernameTaken(false);
      } else {
        setIsUsernameTaken(true);
      }
      setIsLoading(false);
    }
  };

  const generateUniqueUsername = useCallback(async () => {
    let unique = false;
    let newUsername = "";

    while (!unique) {
      newUsername = generateRandomUsername();
      unique = !(await checkUsername(newUsername));
    }

    setUsername(newUsername);
  }, []);
  const generateRandomUsername = () => {
    return "user" + Math.floor(Math.random() * 1000000);
  };

  useEffect(() => {
    generateUniqueUsername();
  }, [generateUniqueUsername]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isSignup ? (
              <>
                {step === 1 && "Signup"}
                {step === 2 && "Create your username and password"}
              </>
            ) : (
              "Sign In"
            )}
          </DialogTitle>
        </DialogHeader>
        <div>
          {step === 1 && (
            <div className="flex justify-center">
              <Button onClick={handleGoogle} variant="outline">
                Signin with Google
              </Button>
            </div>
          )}

          <Separator className="my-4 "></Separator>
          {!isSignup && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usernameOrEmail" className="text-right">
                  Email or Username
                </Label>
                <Input
                  id="usernameOrEmail"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          {isSignup && (
            <>
              {step === 1 && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                        className="col-span-3"
                      />
                    </div>
                    {username.length < 3 ? (
                      <div className="text-yellow-500">
                        Username should be 3 or more characters
                      </div>
                    ) : isLoading ? (
                      <Spinner></Spinner>
                    ) : isUsernameTaken ? (
                      <div className="text-red-500">
                        That username is already taken
                      </div>
                    ) : (
                      <div className="text-green-500">
                        Nice! Username available
                      </div>
                    )}
                  </div>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Turnstile
                    siteKey="0x4AAAAAAAYVpm59oDJY_n4F"
                    onSuccess={(token) => {
                      setToken(token);
                    }}
                  ></Turnstile>
                </div>
              )}
            </>
          )}
          <div className=" text-red-500">{warning}</div>
          {step === 1 && (
            <div>
              <span>{!isSignup ? "New to Hottake?" : "Already spicy?"}</span>
              <Button onClick={() => setIsSignup(!isSignup)}>
                {!isSignup ? "SignUp" : "SignIn"}
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          {!isSignup && <Button onClick={handleSignin}>Sign In</Button>}
          <div className=" flex justify-between">
            {isSignup && step > 1 && (
              <Button onClick={handlePrevious}>Previous</Button>
            )}
            {isSignup && <Button onClick={handleNext}>Next</Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
