// app/page.js or src/app/page.js
import { redirect } from "next/navigation";

export default function HomePage() {
  return redirect("/login");
}
