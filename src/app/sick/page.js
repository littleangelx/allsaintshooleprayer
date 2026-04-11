import Image from "next/image";
import { redirect } from "next/navigation";
import { supabaseServer } from "../lib/supabase/server";

import styles from "./page.module.css";
import ListEdit from "../components/ListEdit";

const SickList = async () => {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("admin")
    .eq("user_id", user.id)
    .single();

  if (!profile?.admin) redirect("/not-allowed");

  const { data: sickList } = await supabase
    .from("prayer_lists")
    .select()
    .eq("type", "sick")
    .order("created_at", { ascending: false })
    .limit(1);

  const { data: bereavementList } = await supabase
    .from("prayer_lists")
    .select()
    .eq("type", "bereavement")
    .order("created_at", { ascending: false })
    .limit(1);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          src="/images/ash_logo.png"
          width={80}
          height={80}
          alt="All Saints logo"
          className={styles.logo}
        />
        <ListEdit
          sickList={sickList[0].people}
          bereavementList={bereavementList[0].people}
        />
      </main>
    </div>
  );
};

export default SickList;
