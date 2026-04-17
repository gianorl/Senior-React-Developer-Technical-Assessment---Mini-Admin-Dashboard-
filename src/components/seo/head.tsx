import { useEffect } from "react";

type HeadProps = {
  title?: string;
};

export const Head = ({ title = "" }: HeadProps) => {
  useEffect(() => {
    document.title = title ? `${title} | Mini Admin Dashboard` : "Mini Admin Dashboard";
  }, [title]);

  return null;
};
