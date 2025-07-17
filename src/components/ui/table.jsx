import * as React from "react";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={"w-full caption-bottom text-sm " + (className || "")} {...props} />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={"bg-slate-100 " + (className || "")} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr ref={ref} className={className} {...props} />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th ref={ref} className={"px-4 py-2 text-left font-medium " + (className || "")} {...props} />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={"px-4 py-2 " + (className || "")} {...props} />
));
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }; 