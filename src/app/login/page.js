"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../lib/supabase/browser";

export default function Home() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.push("/prayer-link");
      router.refresh();
    } else {
      alert("Invalid email or password. Please try again");
      setPassword("");
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          src="/images/ash_logo.png"
          width={150}
          height={150}
          alt="All Saints logo"
          className={styles.logo}
        />
        <h1>All Saints Hoole Prayer Link</h1>
        <h2>Admin Area</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        <p className={styles.cookieMessage}>
          By continuing to log in you are agreeing to the use cookies for this
          site. Cookies are stored to ensure that only authorised users are able
          to access the admin area.
        </p>
      </main>
    </div>
  );
}
