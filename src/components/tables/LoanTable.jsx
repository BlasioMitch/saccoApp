import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { FaSort, FaSortUp, FaSortDown, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiPencil, HiTrash, HiPlus, HiEllipsisVertical, HiEye, HiCurrencyDollar } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLoan } from '../../reducers/loansReducer';
import { fetchAccounts } from '../../reducers/accountsReducer';
import { formatUGX } from '../../utils/currency';
import { toast } from 'sonner';
import moment from 'moment';
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

const ColumnVisibilityMenu = ({ columns, onToggleColumn }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-black-800/90 text-gray-100 rounded-md hover:bg-black-700 border border-black-700"
      >
        <FaEye className="w-4 h-4" />
        Columns
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black-800 border border-black-700 z-50">
          <div className="py-1" role="menu">
            {columns.map(column => (
              <button
                key={column.id}
                onClick={() => {
                  onToggleColumn(column.id);
                  setIsOpen(false);
                }}

                className="flex items-center border border-custom-bg-tertiary bg-custom-bg-secondary w-full px-4 py-2 text-sm text-gray-100 hover:bg-black-700"
                role="menuitem"
              >
                {column.getIsVisible() ? (
                  <FaEye className="mr-3 h-4 w-4" />
                ) : (
                  <FaEyeSlash className="mr-3 h-4 w-4" />
                )}
                {column.columnDef.header}
              </button>
            ))}
          </div>
        </div>
      )}
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
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteLoan(id));
      toast.success('Loan deleted successfully');
      setActiveMenu(null);
      setIsDeleteModalOpen(false);
      setSelectedLoan(null);
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
          return owner ? `${owner.first_name} ${owner.last_name} ${owner.other_name? owner.other_name: ''}` : '';
        },
        cell: ({ getValue }) => (
          <div className="text-sm text-gray-100">{getValue()}</div>
        ),
      },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = row.getValue('amount');
        return formatUGX(amount);
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
              status === 'PAID'
                ? 'bg-green-100 text-green-800'
                : status =='ACTIVE'
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
      accessorFn: (row) => row.summary?.monthlyPayment,
      cell: ({ getValue }) => {
        return formatUGX(getValue());
      },
    },
    {
      accessorKey: 'totalInterest',
      header: 'Total Interest',
      accessorFn: (row) => row.summary?.totalInterest,
      cell: ({ getValue }) => {
        return formatUGX(getValue());
      },
    },
    {
      accessorKey: 'remainingBalance',
      header: 'Remaining Balance',
      accessorFn: (row) => row.summary?.remainingBalance,
      cell: ({ getValue }) => {
        return formatUGX(getValue());
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => {
        const date = row.getValue('startDate');
        return moment(date).format('DD/MMM/YYYY');
      },
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => {
        const date = row.getValue('endDate');
        return moment(date).format('DD/MMM/YYYY');
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
              setIsFormModalOpen(true);
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
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnVisibilityChange: setColumnVisibility,

  });

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-2 border-b border-custom-bg-tertiary pb-4">
          <h1 className="text-2xl font-semibold text-custom-text-primary">Loan List</h1>
          <div className="flex items-center gap-4 py-2">
            <input
              type="text"
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              placeholder="Search loans..."
              className="px-4 py-2 bg-custom-bg-secondary text-custom-text-primary rounded-md border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
            />
            <ColumnVisibilityMenu
              columns={table.getAllLeafColumns()}
              onToggleColumn={(columnId) => {
                const column = table.getColumn(columnId);
                column.toggleVisibility();
              }}
            />

            <button
              onClick={() => {
                setSelectedLoan(null);
                setIsFormModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-custom-brand-primary text-custom-interactive-active-text rounded-md hover:bg-custom-brand-dark transition-colors"
              >
              <HiPlus className="h-5 w-5" />
              Add Loan
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-x-auto rounded-lg border border-custom-bg-tertiary">
            {loans && loans.length > 0 ? (
              <table className="min-w-full table-auto">
                <thead className="bg-custom-bg-secondary text-custom-text-secondary sticky top-0 z-10">
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
                <tbody className="bg-custom-bg-primary divide-y divide-custom-bg-tertiary">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-custom-bg-secondary transition-colors"
                      >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          <div className="text-custom-text-primary">
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
                <p className="text-custom-text-secondary mb-4">No loans found</p>
                <button
                  onClick={() => {
                    setSelectedLoan(null);
                    setIsFormModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-custom-accent text-white rounded-md hover:bg-custom-accent-hover transition-colors"
                >
                  <HiPlus className="h-5 w-5" />
                  Create New Loan
                </button>
              </div>
            )}
          </div>

          {loans && loans.length > 0 && (
            <div className="flex justify-between items-center p-4 border-t border-custom-bg-tertiary bg-custom-bg-primary">
              <div className="flex items-center gap-2">
                <span className="text-sm text-custom-text-secondary">
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="p-1 bg-custom-bg-secondary text-custom-text-primary rounded-md border border-custom-bg-tertiary"
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
                  className="px-3 py-1 bg-custom-bg-secondary text-custom-text-primary rounded-md disabled:opacity-50 border border-custom-bg-tertiary hover:bg-custom-bg-tertiary"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 bg-custom-bg-secondary text-custom-text-primary rounded-md disabled:opacity-50 border border-custom-bg-tertiary hover:bg-custom-bg-tertiary"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <LoanDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        loan={selectedLoan}
      />

      <LoanForm
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
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
          accountId: selectedLoan?.account?.id,
          amount: selectedLoan?.summary?.monthlyPayment,
          type: 'LOAN_PAYMENT'
        }}
      />
    </>
  );
};

export default LoanTable;