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
import { HiPlus, HiEllipsisVertical, HiEye, HiPencil, HiTrash } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../reducers/transactionReducer';
import { toast } from 'sonner';
import moment from 'moment';
import TransactionForm from '../forms/TransactionForm';
import { formatUGX } from '../../utils/currency';

const ActionMenu = ({ isOpen, onClose, onEdit, onDelete, onView }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black-900/90 border border-black-700 z-50">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={onView}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-100 hover:bg-black-800"
          role="menuitem"
        >
          <HiEye className="mr-3 h-5 w-5" />
          View Details
        </button>
        <button
          onClick={onEdit}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-100 hover:bg-black-800"
          role="menuitem"
        >
          <HiPencil className="mr-3 h-5 w-5" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center w-full px-4 py-2 text-sm text-red-300 hover:bg-black-800"
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

const TransactionTable = ({ onRowClick, onEdit, onDelete, onView }) => {
  const dispatch = useDispatch();
  const { transactions, status } = useSelector((state) => state.transactions);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTransactions());
    }
  }, [status, dispatch]);
console.log(transactions)
  const handleEditClick = (transaction) => {
    setActiveMenu(null);
    setSelectedTransaction(transaction);
    onEdit(transaction);
  };

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    onDelete(transaction);
    setActiveMenu(null);
  };

  const handleViewClick = (transaction) => {
    setActiveMenu(null);
    onView(transaction);
  };

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };

  const columns = [
    {
      id: 'accountNumber',
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 text-gray-200"
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
      accessorFn: (row) => row.account?.accountNumber,
      cell: ({ getValue }) => <div className="text-gray-100">{getValue()}</div>,
    },
    {
      id: 'ownerName',
      header: ({ column }) => {
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 text-gray-200"
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
      cell: ({ getValue }) => <div className="text-gray-100">{getValue()}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type');
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${
            type === 'SAVINGS_DEPOSIT'
            ? 'bg-green-900/50 text-green-300'
            : type === 'ACCOUNT_WITHDRAW' || type === 'CLOSURE_WITHDRAW'
            ? 'bg-red-900/50 text-red-300'
            : type === 'LOAN_PAYMENT'
            ? 'bg-blue-900/50 text-blue-300'
            : type === 'MEMBERSHIP_FEE'
            ? 'bg-yellow-900/50 text-yellow-300'
            : 'bg-gray-800/50 text-gray-300'
          }`}>
            {type}
          </span>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = row.getValue('amount');
        return (
          <div className="text-gray-100">
            {formatUGX(amount)}
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return <div className="text-gray-100">{moment(date).format('DD/MMM/YYYY')}</div>;
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div className="text-gray-100">{row.getValue('description')}</div>,
    },
  ];

  const actionColumn = {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const isOpen = activeMenu === row.original.id;
      
      return (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(isOpen ? null : row.original.id);
            }}
            className="p-1 text-gray-400 hover:text-gray-300"
          >
            <HiEllipsisVertical className="h-5 w-5" />
          </button>
          <ActionMenu
            isOpen={isOpen}
            onClose={() => setActiveMenu(null)}
            onEdit={() => handleEditClick(row.original)}
            onDelete={() => handleDeleteClick(row.original)}
            onView={() => handleViewClick(row.original)}
          />
        </div>
      );
    },
  };

  const table = useReactTable({
    data: transactions || [],
    columns: [...columns, actionColumn],
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
    <div className="space-y-4 min-w-[1200px]">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-custom-text-primary">Transaction List</h2>
        <div className="flex items-center gap-4 py-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              placeholder="Search all columns..."
              className="px-4 py-2 bg-custom-bg-secondary text-custom-text-primary rounded-md border border-custom-bg-tertiary focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
            />
            <ColumnVisibilityMenu
              columns={table.getAllLeafColumns()}
              onToggleColumn={(columnId) => {
                const column = table.getColumn(columnId);
                column.toggleVisibility();
              }}
            />
          </div>
          <button
            onClick={handleAddTransaction}
            className="flex items-center gap-2 px-4 py-2 bg-custom-brand-primary text-custom-interactive-active-text rounded-md hover:bg-custom-brand-dark transition-colors"
          >
            <HiPlus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
      </div>
      
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-x-auto rounded-lg border border-custom-bg-tertiary">
          <table className="w-full">
            <thead className="bg-custom-bg-secondary">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-custom-text-secondary uppercase tracking-wider">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-custom-bg-primary divide-y divide-custom-bg-tertiary">
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick(row.original)}
                  className="hover:bg-custom-bg-secondary transition-colors"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-custom-text-primary">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-custom-bg-secondary border-t border-custom-bg-tertiary mt-4 rounded-lg sticky bottom-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-custom-text-secondary">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
              className="px-2 py-1 bg-custom-bg-primary text-custom-text-primary rounded-md border border-custom-bg-tertiary"
            >
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-custom-bg-primary text-custom-text-primary rounded-md border border-custom-bg-tertiary disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 bg-custom-bg-primary text-custom-text-primary rounded-md border border-custom-bg-tertiary disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        transactionToEdit={selectedTransaction}
      />
    </div>
  );
};

export default TransactionTable; 