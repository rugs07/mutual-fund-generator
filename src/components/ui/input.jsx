import * as React from "react";

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={"border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 " + (className || "")} {...props} />
));
Input.displayName = "Input";

export { Input }; 