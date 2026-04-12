import ChangePassword from "../components/ChangePassword";
import Header from "../components/Header";
import styles from "./page.module.css";

const page = () => {
  return (
    <div>
      <Header />
      <div className={styles.page}>
        <ChangePassword />
      </div>
    </div>
  );
};

export default page;
