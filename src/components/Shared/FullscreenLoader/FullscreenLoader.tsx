import React from "react";
import s from "./FullscreenLoader.module.scss";
import { Watch } from "react-loader-spinner";
import Modal from "components/Shared/Modal/Modal";

interface Props {
  message?: string;
}

const FullscreenLoader: React.FC<Props> = ({ message }) => {
  return (
    <Modal noClose={true}>
      <div className={s.content}>
        <Watch
          height="100"
          width="100"
          radius="48"
          color="#7b96ec"
          ariaLabel="watch-loading"
          visible={true}
        />
        <span>{message}</span>
      </div>
    </Modal>
  );
};

export default FullscreenLoader;
