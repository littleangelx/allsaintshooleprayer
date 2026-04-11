import { redirect } from "next/navigation";
import { supabaseServer } from "../../lib/supabase/server";
import UploadForm from "../../components/UploadForm";

import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default async function AdminPage() {
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

        <div className={styles.listGroup}>
          <p className={styles.heading}>Sick List</p>
          <p className={styles.instructions}>
            You can{" "}
            <Link href="/sick">view and/or edit the sick list here</Link>, or
            upload and overwrite the previous list below
          </p>
          <UploadForm endpoint="/api/upload-sick" label="Sick List" />
        </div>

        <div className={styles.listGroup}>
          <p className={styles.heading}>Bereavement List</p>
          <p className={styles.instructions}>
            You can{" "}
            <Link href="/bereaved">
              view and/or edit the bereaved list here
            </Link>
            , or upload and overwrite the previous list below
          </p>
          <UploadForm
            endpoint="/api/upload-bereaved"
            label="Bereavement List"
          />
        </div>
      </main>
    </div>
  );
}
