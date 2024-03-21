//components/ClientPortal.tsx

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
type ClientPortalInterface = {
  children: React.ReactNode;
  show?: boolean;
  onClose?: () => void;
};

const ClientPortal = ({ children, show }: ClientPortalInterface) => {
  const ref = useRef<Element | null>(null);
  useEffect(() => {
    ref.current = document.body;
  }, []);
  console.log(ref.current);
  console.log(children);
  return show && ref.current ? createPortal(children, ref.current) : null;
};

export default ClientPortal;
