import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UsersTable from '../../components/tables/UsersTable'
import UserForm from '../../components/forms/UserForm'
import { fetchUsers } from '../../reducers/userReducer'
import { Users, UserCheck, UserPlus } from 'lucide-react'
import moment from 'moment'
import { toast } from 'sonner'
import { Dialog, DialogTrigger, DialogDescription, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { StatGrid } from '../../components/ui/StatCard'
import { PageShell, Panel } from '../../components/layout/PageShell'
import { TableEmpty } from '../../components/tables/TableShell'
import StatusBadge from '../../components/ui/StatusBadge'
import Button from '../../components/ui/Button'
const Team = () => {
  const dispatch = useDispatch()
  const { users, status, error } = useSelector(state => state.users)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // State for details modal
  const [selectedUser, setSelectedUser] = useState(null); // State to store user details

  useEffect(() => {
    dispatch(fetchUsers())
    // console.log('Users:', users)
  }, [dispatch])

  useEffect(() => {
    if (error) {
      console.log('Error in Team component:', error)
      // toast.error(error)
    }
  }, [error])

  const handleOpenPanel = (data) => {
    setUserToEdit(data) // set user data for editing
    setIsPanelOpen(true)

  }
  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setUserToEdit(null) // Clear user data after closing
  }
  // Function to open details modal
  const handleOpenDetailsModal = (user) => { 
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  // Function to close details modal
  const handleCloseDetailsModal = () => {  
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
  };

  // Transform members data to match UsersTable requirements
  const transformedMembers = React.useMemo(() => {
    // console.log('Raw users data:', users)
    if (!Array.isArray(users)) {
      console.log('Users is not an array:', users)
      return []
    }
    return users.map(member => {
      return {
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        other_name: member.other_name,
        contact: member.contact,
        gender: member.gender,
        dob: member.dob,
        email: member.email,
        role: member.role || 'Member',
        hasAccount: member.hasAccount,
        status: member.status || 'Active',
        lastLogin: member.last_login ? new Date(member.last_login).toLocaleString() : 'Never',
        joinDate: member.created_on ? new Date(member.created_on).toLocaleString() : new Date().toISOString()
      }
    })
  }, [users])

  // console.log('Transformed members:', transformedMembers)

  const newThisMonth = transformedMembers.filter(m => {
    const joinDate = new Date(m.joinDate)
    const now = new Date()
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
  }).length

  const stats = [
    { title: 'Total Members', value: transformedMembers.length, icon: Users, tone: 'blue' },
    { title: 'Active Members', value: transformedMembers.filter(m => m.status === 'ACTIVE').length, icon: UserCheck, tone: 'green' },
    { title: 'New This Month', value: newThisMonth, icon: UserPlus, tone: 'purple' },
  ]

  const details = selectedUser ? [
    ['First Name', selectedUser.first_name],
    ['Last Name', selectedUser.last_name],
    ['Email', selectedUser.email],
    ['Contact', selectedUser.contact],
    ['Gender', selectedUser.gender],
    ['Date of Birth', moment(selectedUser.dob).format('DD/MMM/YYYY')],
    ['Role', selectedUser.role],
    ['Status', <StatusBadge key="status" status={selectedUser.status} />],
    ['Last Login', selectedUser.lastLogin],
    ['Join Date', moment(selectedUser.joinDate).format('DD/MMM/YYYY')],
  ] : []

  return (
    <PageShell>
      <StatGrid stats={stats} className="lg:grid-cols-3" />

      <Panel>
        {transformedMembers.length > 0 ? (
          <UsersTable users={transformedMembers} onEdit={handleOpenPanel} onView={handleOpenDetailsModal}/>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <TableEmpty
              title="No Members Found"
              description="Start by adding your first team member"
              action={<Button onClick={() => handleOpenPanel()}><UserPlus className="h-4 w-4" />Add Member</Button>}
            />
          </div>
        )}
      </Panel>
      <Dialog open={isPanelOpen} onOpenChange={setIsPanelOpen} className=''>
        <UserForm isOpen={isPanelOpen} onClose={handleClosePanel} userToEdit={userToEdit}/>
      </Dialog>

      {/* User Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={handleCloseDetailsModal}>
        <DialogContent className="w-full max-w-md rounded-lg border border-custom-bg-tertiary bg-custom-bg-primary p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold leading-6 text-custom-text-primary">Member Details</DialogTitle>
            <DialogDescription className="text-sm text-custom-text-secondary">
              Details for {selectedUser?.first_name} {selectedUser?.last_name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <dl className="grid grid-cols-[128px_1fr] gap-x-4 gap-y-2 text-sm leading-6">
                {details.map(([label, value]) => (
                  <React.Fragment key={label}>
                    <dt className="text-custom-text-secondary">{label}</dt>
                    <dd className="font-medium text-custom-text-primary">{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
              <div className="flex justify-end">
                <Button variant="secondary" onClick={handleCloseDetailsModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}

export default Team
