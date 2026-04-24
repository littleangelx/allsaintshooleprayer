"use client";

import Image from "next/image";
import styles from "./Header.module.css";
import { useState, useEffect, useRef } from "react";
import { supabaseBrowser } from "../lib/supabase/browser";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const supabase = supabaseBrowser();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("profiles").select("");
      if (data && data.length > 0) {
        setIsAdmin(data[0].admin);
      }
    };
    fetchData();
  }, []);

  // 🔹 Lock scroll
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  // 🔹 Swipe detection
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;

    const swipeDistance = touchStartX.current - touchEndX.current;

    // swipe left to close
    if (swipeDistance > 50) {
      setMenuOpen(false);
    }
  };

  return (
    <header className={styles.header}>
      <Image
        src="/images/ash_logo.png"
        alt="All Saints logo"
        width={200}
        height={200}
        className={styles.logo}
      />

      {/* 🔹 Desktop */}
      <div className={styles.rightSide}>
        <Link href="/prayer-link">Prayer Home</Link>
        {isAdmin && <Link href="/admin/prayer-list">Admin Area</Link>}
        <Link href="/change-password">Update Password</Link>
        <LogoutButton />
      </div>

      {/* 🔹 Hamburger */}
      <button
        className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* 🔹 Backdrop */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
      )}

      {/* 🔹 Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Link href="/prayer-link" onClick={() => setMenuOpen(false)}>
          Prayer Home
        </Link>

        {isAdmin && (
          <Link href="/admin/prayer-list" onClick={() => setMenuOpen(false)}>
            Admin Area
          </Link>
        )}

        <Link href="/change-password" onClick={() => setMenuOpen(false)}>
          Update Password
        </Link>

        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
