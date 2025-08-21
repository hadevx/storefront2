import React from "react";

function Modal({ children }) {
  return <div className="absolute bg-zinc-500 p-10">{children}</div>;
}

export default Modal;
