import React, { useEffect, useState } from "react";
import s from "components/Sidebar/Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

interface Props {
  displayName: string;
  onUpdate: (name: string) => void;
}

const TextField = ({ displayName, onUpdate }: Props) => {
  const [name, setName] = useState(displayName);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setName(displayName);
  }, [opened]);

  const validate = () => {
    if (name.trim() && name.length >= 3 && name.length <= 30) {
      onUpdate(name);
      setOpened(false);
    }
  };

  return (
    <div className={s.profile__displayName}>
      {opened ? (
        <>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={3}
            maxLength={20}
            required
          />
          <button className={s.button} onClick={validate}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </>
      ) : (
        <>
          <h2>{displayName}</h2>
          <button
            className={s.button}
            onClick={() => setOpened((prevState) => !prevState)}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </>
      )}
    </div>
  );
};

export default TextField;
