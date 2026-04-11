"use client";
import { useState } from "react";

import styles from "./ListEdit.module.css";

const ListEdit = ({ sickList, bereavementList }) => {
  const [sick, setSick] = useState(sickList);
  const [bereave, setBereave] = useState(bereavementList);
  const [newSick, setNewSick] = useState("");
  const [newBereave, setNewBereave] = useState("");

  const handleMoveSickToBereaved = (person) => {
    setBereave((prev) => [person, ...prev]);
    setSick((prev) => prev.filter((el) => el !== person));
  };

  const handleRemoveSick = (person) => {
    setSick((prev) => prev.filter((el) => el !== person));
  };

  const handleRemoveBereave = (person) => {
    setBereave((prev) => prev.filter((el) => el !== person));
  };

  const handleAddSick = () => {
    if (newSick.length === 0) return;
    setSick((prev) => [newSick, ...prev]);
  };

  const handleAddBereave = () => {
    if (newBereave.length === 0) return;    
    setBereave((prev) => [newBereave, ...prev]);
  };

  return (
    <div className={styles.listsLayout}>
      <div className="sick">
        <h2>Sick List</h2>
        {sick.map((person) => (
          <div key={person} className={styles.personRow}>
            <p className={styles.person}>{person}</p>
            <p
              className={styles.remove}
              onClick={() => handleRemoveSick(person)}
            >
              Remove
            </p>
            <p
              className={styles.move}
              onClick={() => handleMoveSickToBereaved(person)}
            >
              Move to bereavement list
            </p>
          </div>
        ))}
        <div className={styles.inputContainer}>
          <input
            className={styles.addInput}
            type="text"
            placeholder="Add person to list"
            onChange={(e) => setNewSick(e.target.value)}
          />
          <button className={styles.addBtn} onClick={handleAddSick}>
            Add
          </button>
        </div>
      </div>
      <div className="bereavement">
        <h2>Bereavement List</h2>
        {bereave.map((person) => (
          <div key={person} className={styles.personRow}>
            <p className={styles.person}>{person}</p>
            <p
              className={styles.remove}
              onClick={() => handleRemoveBereave(person)}
            >
              Remove
            </p>
          </div>
        ))}
        <div className={styles.inputContainer}>
          <input
            className={styles.addInput}
            type="text"
            placeholder="Add person to list"
            onChange={(e) => setNewBereave(e.target.value)}
          />
          <button className={styles.addBtn} onClick={handleAddBereave}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListEdit;
