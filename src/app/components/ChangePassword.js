"use client";

import { useState } from "react";
import { supabaseBrowser } from "../lib/supabase/browser";
import styles from "./ChangePassword.module.css";

export default function ChangePassword() {
  const supabase = supabaseBrowser();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully");
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleChangePassword} className={styles.form}>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
}
