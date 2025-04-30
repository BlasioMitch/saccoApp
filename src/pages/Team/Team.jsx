import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UsersTable from '../../components/tables/UsersTable'
import UserForm from '../../components/forms/UserForm'
import { fetchUsers } from '../../reducers/userReducer'
import { FiUserPlus } from 'react-icons/fi'
import { toast } from 'sonner'
import { Dialog, DialogTrigger, DialogDescription, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
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
      toast.error(error)
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
        status: member.status || 'Active',
        lastLogin: member.last_login ? new Date(member.last_login).toLocaleString() : 'Never',
        joinDate: member.created_on ? new Date(member.created_on).toLocaleString() : new Date().toISOString()
      }
    })
  }, [users])

  // console.log('Transformed members:', transformedMembers)

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Members</h1>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dblack-900 p-4 rounded">
          <h2 className="text-lg text-dcyan-300">Total Members</h2>
          <p className="text-2xl font-bold">{transformedMembers.length}</p>
        </div>
        <div className="bg-dblack-900 p-4 rounded">
          <h2 className="text-lg text-dcyan-300">Active Members</h2>
          <p className="text-2xl font-bold">{transformedMembers.filter(m => m.status === 'Active').length}</p>
        </div>
        <div className="bg-dblack-900 p-4 rounded">
          <h2 className="text-lg text-dcyan-300">New This Month</h2>
          <p className="text-2xl font-bold">
            {transformedMembers.filter(m => {
              const joinDate = new Date(m.joinDate)
              const now = new Date()
              return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </div>
      </div>

      <div className="flex-1 bg-dblack-900 rounded-lg overflow-hidden">
        {transformedMembers.length > 0 ? (
          <UsersTable users={transformedMembers} onEdit={handleOpenPanel} onView={handleOpenDetailsModal}/>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-dcyan-300 text-xl font-semibold mb-2">No Members Found</div>
            <p className="text-gray-400">Start by adding your first team member</p>
            <button 
              onClick={handleOpenPanel}
              className="mt-4 flex items-center gap-2 bg-dcyan-700 text-white px-4 py-2 rounded hover:bg-dcyan-800 transition-colors"
            >
              <FiUserPlus /> Add Member
            </button>
          </div>
        )}
      </div>
      <Dialog open={isPanelOpen} onOpenChange={setIsPanelOpen} className=''>
        <UserForm isOpen={isPanelOpen} onClose={handleClosePanel} userToEdit={userToEdit}/>
      </Dialog>

      {/* User Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={handleCloseDetailsModal}>
        <DialogContent className="bg-dblack-700 p-6 rounded-lg w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-dcyan-300">Member Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Details for {selectedUser?.first_name} {selectedUser?.last_name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && ( // Only render if selectedUser is not null
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-300">First Name:</span>
                <span className="text-white ml-2">{selectedUser.first_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-300">Last Name:</span>
                <span className="text-white ml-2">{selectedUser.last_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-300">Email:</span>
                <span className="text-white ml-2">{selectedUser.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-300">Contact:</span>
                <span className="text-white ml-2">{selectedUser.contact}</span>
              </div>
               <div>
                <span className="font-medium text-gray-300">Gender:</span>
                <span className="text-white ml-2">{selectedUser.gender}</span>
              </div>
              <div>
                <span className="font-medium text-gray-300">Date of Birth:</span>
                <span className="text-white ml-2">{selectedUser.dob}</span>
              </div>
              <div>
                <span className="font-medium text-gray-300">Role:</span>
                <span className="text-white ml-2">{selectedUser.role}</span>
              </div>
              <div>
                <span className="font-medium text-gray-300">Status:</span>
                <span className="text-white ml-2">{selectedUser.status}</span>
              </div>
               <div>
                <span className="font-medium text-gray-300">Last Login:</span>
                <span className="text-white ml-2">{selectedUser.lastLogin}</span>
              </div>
              <div>
                <span className="font-medium text-gray-300">Join Date:</span>
                <span className="text-white ml-2">{selectedUser.joinDate}</span>
              </div>
              {/* Add more details as needed */}
              <div className="flex justify-end">
                <button
                  onClick={handleCloseDetailsModal}
                  className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Team
