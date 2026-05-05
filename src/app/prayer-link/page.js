"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../lib/supabase/browser";
import { useState, useEffect } from "react";

import Header from "../components/Header";
import styles from "./page.module.css";

const PrayerLink = () => {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [sick, setSick] = useState([]);
  const [bereaved, setBereaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: latestSick } = await supabase
        .from("prayer_lists")
        .select("*")
        .eq("type", "sick")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { data: latestBereaved } = await supabase
        .from("prayer_lists")
        .select("*")
        .eq("type", "bereavement")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setSick(latestSick?.people || []);
      setBereaved(latestBereaved?.people || []);
      setLoading(false);
    };

    checkUserAndFetch();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <main className={styles.pageContainer}>
        <h1>Hold them in your</h1>
        <div className={styles.heading}>
          <h1>prayers</h1>
          <img
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
              <img src="/images/sick-icon.png" alt="" width={30} height={30} />
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
              <img
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
