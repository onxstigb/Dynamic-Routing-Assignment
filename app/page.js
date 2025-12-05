// redeploy trigger for Vercel
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/characters");
}
