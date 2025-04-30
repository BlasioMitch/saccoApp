import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { HiPencil, HiTrash, HiPlus, HiEllipsisVertical, HiEye, HiCurrencyDollar } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLoan } from '../../reducers/loansReducer';
import { fetchAccounts } from '../../reducers/accountsReducer';
import { toast } from 'sonner';
import LoanDetailsModal from '../Loans/LoanDetailsModal';
import DeleteConfirmationModal from '../Loans/DeleteConfirmationModal';
import LoanForm from '../forms/LoanForm';
import TransactionForm from '../forms/TransactionForm';

const ActionMenu = ({ isOpen, onClose, onEdit, onDelete, onView, onMakePayment }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-dblack-800 ring-1 ring-black ring-opacity-5 z-50">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={onView}
          className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-dblack-700"
          role="menuitem"
        >
          <HiEye className="mr-3 h-5 w-5" />
          View Details
        </button>
        <button
          onClick={onEdit}
          className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-dblack-700"
          role="menuitem"
        >
          <HiPencil className="mr-3 h-5 w-5" />
          Edit
        </button>
        <button
          onClick={onMakePayment}
          className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-dblack-700"
          role="menuitem"
        >
          <HiCurrencyDollar className="mr-3 h-5 w-5" />
          Make Payment
        </button>
        <button
          onClick={onDelete}
          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-dblack-700"
          role="menuitem"
        >
          <HiTrash className="mr-3 h-5 w-5" />
          Delete
        </button>
      </div>
    </div>
  );
};

const LoanTable = () => {
  const dispatch = useDispatch();
  const loans = useSelector((state) => state.loans.loans);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  
  // Modal states
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteLoan(id));
      toast.success('Loan deleted successfully');
      setActiveMenu(null);
    } catch (error) {
      toast.error('Error deleting loan');
    }
  };

  const columns = [
    {
        id: 'accountNumber',
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="flex items-center gap-1"
            >
              Account Number
              {column.getIsSorted() === 'asc' ? (
                <FaSortUp />
              ) : column.getIsSorted() === 'desc' ? (
                <FaSortDown />
              ) : (
                <FaSort />
              )}
            </button>
          );
        },
        accessorFn: (row) => row.account?.accountNumber, // This directly pulls account.accountNumber
        cell: ({ getValue }) => <div>{getValue()}</div>,
      },
    {
        id: 'ownerName',
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="flex items-center gap-1"
            >
              Owner Name
              {column.getIsSorted() === 'asc' ? (
                <FaSortUp />
              ) : column.getIsSorted() === 'desc' ? (
                <FaSortDown />
              ) : (
                <FaSort />
              )}
            </button>
          );
        },
        accessorFn: (row) => {
          const owner = row.account?.owner;
          return owner ? `${owner.first_name} ${owner.last_name}` : '';
        },
        cell: ({ getValue }) => (
          <div className="text-sm text-gray-600">{getValue()}</div>
        ),
      },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = row.getValue('amount');
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
      },
    },
    {
      accessorKey: 'interestRate',
      header: 'Interest Rate',
      cell: ({ row }) => {
        const rate = row.getValue('interestRate');
        return `${rate}%`;
      },
    },
    {
      accessorKey: 'term',
      header: 'Term (Months)',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === 'Active'
                ? 'bg-green-100 text-green-800'
                : status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'monthlyPayment',
      header: 'Monthly Payment',
      cell: ({ row }) => {
        const payment = row.getValue('monthlyPayment');
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(payment);
      },
    },
    {
      accessorKey: 'totalInterest',
      header: 'Total Interest',
      cell: ({ row }) => {
        const interest = row.getValue('totalInterest');
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(interest);
      },
    },
    {
      accessorKey: 'remainingBalance',
      header: 'Remaining Balance',
      cell: ({ row }) => {
        const balance = row.getValue('remainingBalance');
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(balance);
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('startDate'));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('endDate'));
        return date.toLocaleDateString();
      },
    },
  ];

  const actionColumn = {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const isOpen = activeMenu === row.original.id;
      
      return (
        <div className="relative action-menu">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(isOpen ? null : row.original.id);
            }}
            className="p-1 text-slate-400 hover:text-dcyan-500"
          >
            <HiEllipsisVertical className="h-5 w-5" />
          </button>
          <ActionMenu
            isOpen={isOpen}
            onClose={() => setActiveMenu(null)}
            onEdit={() => {
              setSelectedLoan(row.original);
              setIsEditModalOpen(true);
              setActiveMenu(null);
            }}
            onDelete={() => {
              setSelectedLoan(row.original);
              setIsDeleteModalOpen(true);
              setActiveMenu(null);
            }}
            onView={() => {
              setSelectedLoan(row.original);
              setIsDetailsModalOpen(true);
              setActiveMenu(null);
            }}
            onMakePayment={() => {
              setSelectedLoan(row.original);
              setIsPaymentModalOpen(true);
              setActiveMenu(null);
            }}
          />
        </div>
      );
    },
  };

  const allColumns = [...columns, actionColumn];

  const table = useReactTable({
    data: loans,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <>
      <div className="flex flex-col h-full">
        <div className={`${loans.length > 0 ? 'px-4 py-3 flex justify-between items-center border-b border-dblack-700' : 'hidden'}`}>
          <input
            type="text"
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
          placeholder="Search..."
          className="w-1/2 p-2 bg-dblack-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-dcyan-500"
          />
          <button
            onClick={() => {
              setSelectedLoan(null);
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-dcyan-700 text-white rounded-md hover:bg-dcyan-800 transition-colors"
          >
            <HiPlus className="h-5 w-5" />
            Add Loan
          </button>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <div className="h-full overflow-x-auto">
            {loans && loans.length > 0 ? (
              <table className="min-w-full table-auto">
                <thead className="bg-dblack-600 text-slate-400 sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-2 text-left"
                        >
                          <div className="whitespace-nowrap">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="even:bg-dblack-800 hover:bg-dblack-700"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-2">
                          <div className="whitespace-nowrap p-1">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-gray-400 mb-4">No loans found</p>
                <button
                  onClick={() => {
                    setSelectedLoan(null);
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-dcyan-700 text-white rounded-md hover:bg-dcyan-800 transition-colors"
                >
                  <HiPlus className="h-5 w-5" />
                  Create New Loan
                </button>
              </div>
            )}
          </div>
        </div>

        {loans && loans.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t border-dblack-700">
            <div className="flex items-center gap-2">
              <span className="text-sm text-dblack-50">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="p-1 bg-dblack-600 text-dblack-50 rounded-md"
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 bg-dblack-600 text-dblack-50 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 bg-dblack-600 text-dblack-50 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <LoanDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        loan={selectedLoan}
      />

      <LoanForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLoan(null);
        }}
        loanToEdit={selectedLoan}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLoan(null);
        }}
        onConfirm={handleDelete}
        loanId={selectedLoan?.id}
      />

      <TransactionForm
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedLoan(null);
        }}
        initialValues={{
          loanId: selectedLoan?.id,
          accountId: selectedLoan?.accountId,
          type: 'LOAN_PAYMENT'
        }}
      />
    </>
  );
};

export default LoanTable;