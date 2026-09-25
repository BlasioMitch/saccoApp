import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { MoreVertical, Eye, Pencil, Trash2, Plus, Banknote } from 'lucide-react';
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
import { TableToolbar, ColumnMenu, DataTable, TableEmpty, TablePagination, SortableHeader } from './TableShell';
import DropdownMenu from '../ui/DropdownMenu';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';

const LoanTable = () => {
  const dispatch = useDispatch();
  const loans = useSelector((state) => state.loans.loans);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');

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
      setIsDeleteModalOpen(false);
      setSelectedLoan(null);
    } catch (error) {
      toast.error('Error deleting loan');
    }
  };

  const openCreateForm = () => {
    setSelectedLoan(null);
    setIsFormModalOpen(true);
  };

  const columns = [
    {
      id: 'accountNumber',
      meta: { label: 'Account Number', emphasis: 'primary' },
      header: ({ column }) => <SortableHeader column={column} label="Account Number" />,
      accessorFn: (row) => row.account?.accountNumber, // This directly pulls account.accountNumber
    },
    {
      id: 'ownerName',
      meta: { label: 'Owner Name', emphasis: 'primary' },
      header: ({ column }) => <SortableHeader column={column} label="Owner Name" />,
      accessorFn: (row) => {
        const owner = row.account?.owner;
        return owner ? `${owner.first_name} ${owner.last_name} ${owner.other_name? owner.other_name: ''}` : '';
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      meta: { emphasis: 'amount' },
      cell: ({ row }) => formatUGX(row.getValue('amount')),
    },
    {
      accessorKey: 'interestRate',
      header: 'Interest Rate',
      meta: { align: 'right' },
      cell: ({ row }) => `${row.getValue('interestRate')}%`,
    },
    {
      accessorKey: 'term',
      header: 'Term (Months)',
      meta: { align: 'right' },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      accessorKey: 'monthlyPayment',
      header: 'Monthly Payment',
      meta: { emphasis: 'amount' },
      accessorFn: (row) => row.summary?.monthlyPayment,
      cell: ({ getValue }) => formatUGX(getValue()),
    },
    {
      accessorKey: 'totalInterest',
      header: 'Total Interest',
      meta: { align: 'right' },
      accessorFn: (row) => row.summary?.totalInterest,
      cell: ({ getValue }) => formatUGX(getValue()),
    },
    {
      accessorKey: 'remainingBalance',
      header: 'Remaining Balance',
      meta: { emphasis: 'amount' },
      accessorFn: (row) => row.summary?.remainingBalance,
      cell: ({ getValue }) => formatUGX(getValue()),
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => moment(row.getValue('startDate')).format('DD/MMM/YYYY'),
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => moment(row.getValue('endDate')).format('DD/MMM/YYYY'),
    },
  ];

  const actionColumn = {
    id: 'actions',
    header: '',
    enableHiding: false,
    meta: { align: 'right' },
    cell: ({ row }) => {
      const openWith = (setOpen) => () => {
        setSelectedLoan(row.original);
        setOpen(true);
      };
      return (
        <DropdownMenu
          ariaLabel="Loan actions"
          label={<MoreVertical className="h-4 w-4" />}
          items={[
            { label: 'View Details', icon: Eye, onClick: openWith(setIsDetailsModalOpen) },
            { label: 'Edit', icon: Pencil, onClick: openWith(setIsFormModalOpen) },
            { label: 'Make Payment', icon: Banknote, hidden: row.original.status === 'PAID', onClick: openWith(setIsPaymentModalOpen) },
            { label: 'Delete', icon: Trash2, danger: true, onClick: openWith(setIsDeleteModalOpen) },
          ]}
        />
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
      <TableToolbar search={filtering} onSearch={setFiltering} placeholder="Search loans...">
        <ColumnMenu table={table} />
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4" />
          Add Loan
        </Button>
      </TableToolbar>

      <DataTable
        table={table}
        empty={
          <TableEmpty
            title="No loans found"
            action={<Button onClick={openCreateForm}><Plus className="h-4 w-4" />Create New Loan</Button>}
          />
        }
      />

      <TablePagination table={table} />

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
