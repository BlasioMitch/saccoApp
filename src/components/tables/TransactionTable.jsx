import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { MoreVertical, Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../reducers/transactionReducer';
import moment from 'moment';
import TransactionForm from '../forms/TransactionForm';
import { formatUGX } from '../../utils/currency';
import { TableToolbar, ColumnMenu, DataTable, TablePagination, SortableHeader } from './TableShell';
import DropdownMenu from '../ui/DropdownMenu';
import Button from '../ui/Button';

// Same hues as before, tuned to stay legible in both themes
const TYPE_STYLES = {
  SAVINGS_DEPOSIT: 'bg-green-500/10 text-green-700 dark:text-green-400',
  ACCOUNT_WITHDRAW: 'bg-red-500/10 text-red-700 dark:text-red-400',
  CLOSURE_WITHDRAW: 'bg-red-500/10 text-red-700 dark:text-red-400',
  LOAN_PAYMENT: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  MEMBERSHIP_FEE: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
};

const TypeBadge = ({ type }) => (
  <span className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-medium capitalize ${
    TYPE_STYLES[type] || 'bg-custom-bg-tertiary text-custom-text-secondary'
  }`}>
    {String(type || '').toLowerCase().replace(/_/g, ' ')}
  </span>
);

const TransactionTable = ({ onRowClick, onEdit, onDelete, onView }) => {
  const dispatch = useDispatch();
  const { transactions, status } = useSelector((state) => state.transactions);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTransactions());
    }
  }, [status, dispatch]);

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    onEdit(transaction);
  };

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    onDelete(transaction);
  };

  const handleViewClick = (transaction) => {
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
      meta: { label: 'Account Number', emphasis: 'primary' },
      header: ({ column }) => <SortableHeader column={column} label="Account Number" />,
      accessorFn: (row) => row.account?.accountNumber,
    },
    {
      id: 'ownerName',
      meta: { label: 'Owner Name', emphasis: 'primary' },
      header: ({ column }) => <SortableHeader column={column} label="Owner Name" />,
      accessorFn: (row) => row.account?.owner?.fullName,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <TypeBadge type={row.getValue('type')} />,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      meta: { emphasis: 'amount' },
      cell: ({ row }) => formatUGX(row.getValue('amount')),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => moment(row.original.createdAt).format('DD/MMM/YYYY'),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="block max-w-xs truncate" title={row.getValue('description') || ''}>
          {row.getValue('description')}
        </span>
      ),
    },
  ];

  const actionColumn = {
    id: 'actions',
    header: '',
    enableHiding: false,
    meta: { align: 'right' },
    cell: ({ row }) => (
      <DropdownMenu
        ariaLabel="Transaction actions"
        label={<MoreVertical className="h-4 w-4" />}
        items={[
          { label: 'View Details', icon: Eye, onClick: () => handleViewClick(row.original) },
          { label: 'Edit', icon: Pencil, onClick: () => handleEditClick(row.original) },
          { label: 'Delete', icon: Trash2, danger: true, onClick: () => handleDeleteClick(row.original) },
        ]}
      />
    ),
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
    <>
      <TableToolbar search={filtering} onSearch={setFiltering} placeholder="Search all columns...">
        <ColumnMenu table={table} />
        <Button onClick={handleAddTransaction}>
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </TableToolbar>

      <DataTable table={table} onRowClick={onRowClick} />

      <TablePagination table={table} />

      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        transactionToEdit={selectedTransaction}
      />
    </>
  );
};

export default TransactionTable;
