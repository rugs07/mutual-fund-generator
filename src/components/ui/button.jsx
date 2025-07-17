import * as React from "react";

const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={"inline-flex items-center justify-center rounded bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition " + (className || "")} {...props} />
));
Button.displayName = "Button";

export { Button }; 