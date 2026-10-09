import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Upload } from 'lucide-react'
import Button from '../ui/Button'
import ImportDialog from './ImportDialog'

// "Import CSV" toolbar action for staff (ADMIN / MANAGER); members never see it
const ImportButton = ({ config, onImported }) => {
  const [isOpen, setIsOpen] = useState(false)
  const role = useSelector(state => state.auth.user?.role)?.toUpperCase()
  if (role !== 'ADMIN' && role !== 'MANAGER') return null

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        <Upload className="h-4 w-4" />
        Import CSV
      </Button>
      <ImportDialog isOpen={isOpen} onClose={() => setIsOpen(false)} config={config} onImported={onImported} />
    </>
  )
}

export default ImportButton
