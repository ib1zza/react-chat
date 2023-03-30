import React, { useEffect } from "react";
import { OverlayScrollbars } from "overlayscrollbars";

const config = {
  scrollbars: {
    autoHide: "leave",
  },
};

export const useScrollbar = (
  root: React.RefObject<HTMLElement>,
  hasScroll: boolean
) => {
  useEffect(() => {
    console.log("scrollbar hook");
    let scrollbars: OverlayScrollbars | undefined;

    if (root.current && hasScroll) {
      console.log("apply scrollbar");
      scrollbars = OverlayScrollbars(root.current);
    }

    return () => {
      if (scrollbars) {
        console.log("scrollbar destroy");
        scrollbars.destroy();
      }
    };
  }, [root, hasScroll]);
};
