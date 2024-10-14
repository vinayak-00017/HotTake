import { redirect } from "next/navigation";

const Page = () => {
  redirect("/settings/account");
  return null;
};

export default Page;
