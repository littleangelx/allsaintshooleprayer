"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../lib/supabase/browser";
import styles from "./LogoutButton.module.css";

const LogoutButton = () => {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    // redirect after logout
    router.push("/login");
    router.refresh(); // important for middleware/session reset
  };

  return (
    <button onClick={handleLogout} className={styles.button}>
      Logout
    </button>
  );
};

export default LogoutButton;
