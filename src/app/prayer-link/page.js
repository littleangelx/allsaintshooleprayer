"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { supabaseBrowser } from "../lib/supabase/browser";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { redirect } from "next/navigation";

const PrayerLink = async () => {
  const supabase = supabaseBrowser(); // or your server client

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [sick, setSick] = useState([]);
  const [bereaved, setBereaved] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: latestSick, error: sickError } = await supabase
        .from("prayer_lists")
        .select("*")
        .eq("type", "sick")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setSick(latestSick.people);

      const { data: latestBereaved, error: bereavedError } = await supabase
        .from("prayer_lists")
        .select("*")
        .eq("type", "bereavement")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setBereaved(latestBereaved.people);
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.pageContainer}>
        <h1>Hold them in your</h1>
        <div className={styles.heading}>
          <h1>prayers</h1>
          <Image
            src="/images/wiggle.png"
            alt=""
            width={30}
            height={2}
            className={styles.wiggle}
          />
        </div>
        <p className={styles.introText}>
          Thank you for signing up to the All Saints Prayer Page. A serene space
          to share names and offer prayerful support to those in our community
          facing illness or loss. The lists are reviewed monthly.
        </p>

        <div className={styles.prayerGrid}>
          <div className={styles.sickList}>
            <div className={styles.topSection}>
              <Image
                src="/images/sick-icon.png"
                alt=""
                width={30}
                height={30}
              />
              <div className={styles.rightSide}>
                <h2>Please pray for the sick</h2>
                <p>God's presence, healing, and strength</p>
              </div>
            </div>
            <div className={styles.listContainer}>
              {sick.map((person) => (
                <p key={person}>{person}</p>
              ))}
            </div>
          </div>
          <div className={styles.sickList}>
            <div className={styles.topSection}>
              <Image
                src="/images/bereaved-icon.png"
                alt=""
                width={30}
                height={30}
              />
              <div className={styles.rightSide}>
                <h2>Please pray for the bereaved</h2>
                <p>God's presence, comfort and peace</p>
              </div>
            </div>
            <div className={styles.listContainer}>
              {bereaved.map((person) => (
                <p key={person}>{person}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PrayerLink;
