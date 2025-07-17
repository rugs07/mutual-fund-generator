import React, { useState, useMemo, useRef, useEffect } from 'react';
import MUTUAL_FUNDS from './enum';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';


const RISK_CATEGORY_MAP = {
  low: ['Large Cap', 'Index', 'Debt'],
  medium: ['Mid Cap', 'ELSS', 'Flexi Cap'],
  high: ['Small Cap'],
};

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'risk',
    header: 'Risk',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'yearlyROI',
    header: 'Yearly ROI (%)',
    cell: info => info.getValue(),
  },
];

const RISK_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const Home = () => {
  const [amount, setAmount] = useState('');
  const [risk, setRisk] = useState('medium');
  const [period, setPeriod] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [riskDropdown, setRiskDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Filter funds by risk
  const filteredFunds = useMemo(() => {
    const allowedCategories = RISK_CATEGORY_MAP[risk];
    return MUTUAL_FUNDS.filter(
      fund => allowedCategories.includes(fund.category)
    );
  }, [risk]);

  // Top 3 funds by ROI for the filtered set
  const topFunds = useMemo(() => {
    if (!showTable || !amount || isNaN(Number(amount))) return [];
    return [...filteredFunds]
      .sort((a, b) => b.yearlyROI - a.yearlyROI)
      .slice(0, 3);
  }, [filteredFunds, showTable, amount]);

  // Table instance (show all filtered funds, 10 per page)
  const table = useReactTable({
    data: filteredFunds,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const handleGetRecommendations = (e) => {
    e.preventDefault();
    setShowTable(true);
  };

  const handleClear = () => {
    setAmount('');
    setRisk('medium');
    setPeriod('');
    setShowTable(false);
  };

  // Amount allocation for top funds
  const allocation = amount && !isNaN(Number(amount)) && topFunds.length > 0
    ? (Number(amount) / topFunds.length)
    : 0;

  // Outside click handler
  useEffect(() => {
    if (!riskDropdown) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRiskDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [riskDropdown]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#e0e7ff] via-[#f0fdfa] to-[#c7f9e5] relative py-4 px-2">
      {/* Animated SVG background */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" width="100%" height="100%" style={{ minHeight: '100vh' }}>
        <circle cx="15%" cy="20%" r="80" fill="#a5b4fc" opacity="0.18">
          <animate attributeName="cy" values="20%;30%;20%" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="80%" cy="80%" r="120" fill="#38bdf8" opacity="0.13">
          <animate attributeName="cx" values="80%;70%;80%" dur="10s" repeatCount="indefinite" />
        </circle>
        <rect x="60%" y="10%" width="100" height="100" rx="30" fill="#fbbf24" opacity="0.10">
          <animate attributeName="y" values="10%;20%;10%" dur="12s" repeatCount="indefinite" />
        </rect>
        <ellipse cx="50%" cy="60%" rx="60" ry="30" fill="#34d399" opacity="0.10">
          <animate attributeName="rx" values="60;80;60" dur="9s" repeatCount="indefinite" />
        </ellipse>
      </svg>
      <div className="relative z-10 max-w-3xl w-full mx-auto p-4 sm:p-8 bg-white shadow-2xl border border-[#e0e7ff] flex flex-col gap-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-slate-800">Mutual Fund Generator</h1>
        <form onSubmit={handleGetRecommendations} className="flex flex-col gap-6">
          <label className="flex flex-col font-medium text-slate-700 gap-2">
            Investment Amount:
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min="100"
              placeholder="Enter amount (e.g. 10000)"
            />
          </label>

          {/* ---- Here's the updated and working dropdown section ---- */}
          <label className="flex flex-col font-medium text-slate-700 gap-2 relative">
            Risk Factor:
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                className="w-full flex justify-between items-center p-4 border border-slate-300 text-base bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-indigo-300 font-medium text-slate-700"
                onClick={() => setRiskDropdown((open) => !open)}
              >
                {RISK_OPTIONS.find(opt => opt.value === risk)?.label}
                <span className="ml-2 text-slate-400">▼</span>
              </button>
              {riskDropdown && (
                <div className="absolute top-full left-0 w-full bg-white border border-slate-300 shadow z-20">
                  {RISK_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${risk === opt.value ? 'bg-blue-50 font-semibold' : ''}`}
                      onClick={() => {
                        setRisk(opt.value);
                        setRiskDropdown(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
          {/* ---- End dropdown section ---- */}

          <label className="flex flex-col font-medium text-slate-700 gap-2">
            Investment Period (years):
            <Input
              type="number"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              required
              min="1"
              placeholder="e.g. 5"
            />
          </label>
          <div className="flex gap-4 mt-2">
            <Button type="submit" className="flex-1 py-4 text-lg font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-700 transition border-0">
              Get Recommendations
            </Button>
            <Button type="button" onClick={handleClear} className="flex-1 py-4 text-lg font-semibold shadow-lg bg-slate-800 text-white hover:bg-slate-900 border-0">
              Clear
            </Button>
          </div>
        </form>
        {showTable && (
          <>
            {topFunds.length > 0 && (
              <div className="mb-8 border border-blue-200 bg-blue-50 p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Top 3 Funds for You</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {topFunds.map((fund, idx) => (
                    <div key={fund.name} className="border border-blue-200 bg-white p-4 shadow text-slate-800">
                      <div className="font-semibold text-base mb-1">{idx + 1}.</div>
                      <div className="font-semibold text-base mb-1"> {fund.name}</div>
                      <div className="text-sm text-slate-600 mb-1">Category: {fund.category}</div>
                      <div className="text-sm text-slate-600 mb-1">Yearly ROI: <span className="font-bold">{fund.yearlyROI}%</span></div>
                      <div className="text-sm text-blue-700 font-semibold">Your Allocation: ₹{allocation.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2">
              <div className="overflow-x-auto shadow-lg border border-slate-200 bg-white">
                <Table className="font-mono">
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-indigo-100 to-blue-100 font-mono">
                      {table.getHeaderGroups()[0].headers.map(header => (
                        <TableHead key={header.id} className="text-slate-800 text-base font-bold px-6 py-4 border-b border-slate-200 font-mono">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row, idx) => (
                        <TableRow
                          key={row.id}
                          className={`transition hover:bg-blue-50/70 ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'} font-mono`}
                        >
                          {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id} className="px-6 py-4 text-slate-700 text-base border-b border-slate-100 font-mono">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="text-center py-8 text-slate-500 text-lg font-mono">No results.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-6 px-2">
                <Button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-6 py-2 font-semibold bg-slate-800 text-white hover:bg-slate-900 border border-slate-800 shadow-none"
                  style={{ minWidth: 120 }}
                >
                  Previous
                </Button>
                <span className="text-slate-700 font-medium text-base">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <Button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-6 py-2 font-semibold bg-slate-800 text-white hover:bg-slate-900 border border-slate-800 shadow-none"
                  style={{ minWidth: 120 }}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
