import React, { useEffect, useState } from "react";
import s from "components/Sidebar/Sidebar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

interface Props {
  displayName: string;
  onUpdate: (name: string) => void;
}
const TextField: React.FC<Props> = ({ displayName, onUpdate }) => {
  const [name, setName] = useState(displayName);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (!opened) setName(displayName);
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
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={3}
            maxLength={20}
            required
          />
          <FontAwesomeIcon icon={faCheck} onClick={validate} />
        </>
      ) : (
        <>
          <h2>{displayName}</h2>{" "}
          <FontAwesomeIcon
            icon={faPenToSquare}
            onClick={() => setOpened((prevState) => !prevState)}
          />
        </>
      )}
    </div>
  );
};

export default TextField;