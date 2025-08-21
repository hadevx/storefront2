import clsx from "clsx";

export default function BlurPanel({ children, className }) {
  return (
    <div
      className={clsx(
        "bg-black/60 backdrop-blur-md rounded-2xl will-change-transform block w-fit mx-auto",
        className
      )}
      role="region">
      {children}
    </div>
  );
}
