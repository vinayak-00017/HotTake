import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { UserProfile } from "./ProfileHeader";
import { useEffect, useState } from "react";
import { checkUsername } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Spinner";

const EditProfileDialog = ({ user }: { user: UserProfile }) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [isValidUsername, setIsValidUsername] = useState<boolean | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["checkUsername", username],
    queryFn: async () => setIsValidUsername(await checkUsername(username)),
    enabled: false,
  });

  useEffect(() => {
    if (username.length >= 3 && username !== user.username) {
      refetch();
    } else {
      setIsValidUsername(null);
    }
  }, [username, user.username, refetch]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save whenre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              defaultValue="Spicy warrior"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              defaultValue="@hottakeUser"
              className="col-span-3"
            />
          </div>
          {username.length < 3 ? (
            <div className="text-yellow-500">
              Username should be 3 or more characters
            </div>
          ) : isLoading ? (
            <Spinner></Spinner>
          ) : isValidUsername === true ? (
            <div className="text-red-500">That username is already taken</div>
          ) : isValidUsername === false ? (
            <div className="text-green-500">Nice! Username available</div>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
