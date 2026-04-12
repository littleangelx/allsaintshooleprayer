"use client";

import Image from "next/image";
import styles from "./Header.module.css";
import { useState, useEffect } from "react";
import { supabaseBrowser } from "../lib/supabase/browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = supabaseBrowser();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("profiles").select("");

      setIsAdmin(data[0].admin);
    };

    fetchData();
  }, []);

  console.log(isAdmin);
  return (
    <header className={styles.header}>
      <Image
        src="/images/ash_logo.png"
        alt="All Saints logo"
        width={200}
        height={200}
        className={styles.logo}
      />
      <div className={styles.rightSide}>
        <Link href="/prayer-link">Prayer Home</Link>
        {isAdmin && <Link href="/admin/prayer-list">Admin Area</Link>}
        <Link href="/change-password">Update Password</Link>
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
