import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User2 } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const UserSearch = ({ users, onSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filteredUsers = query === ''
    ? []
    : users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        (user.phone && user.phone.includes(query))
      ).slice(0, 8); // Limit to 8 results for better performance

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < filteredUsers.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredUsers[selectedIndex]) {
          handleSelect(filteredUsers[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (user) => {
    onSelect(user);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(0);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-custom-bg-tertiary text-custom-text-primary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-brand-primary"
          placeholder="Search members by name, email, or phone..."
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-custom-text-secondary" />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-2.5 text-custom-text-secondary hover:text-custom-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && filteredUsers.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-2 bg-custom-bg-primary rounded-lg shadow-lg max-h-80 overflow-auto border border-custom-bg-tertiary"
        >
          {filteredUsers.map((user, index) => (
            <li
              key={user.id}
              className={`flex items-center gap-4 px-4 py-2 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-custom-interactive-focus'
                  : 'hover:bg-custom-interactive-hover'
              }`}
              onClick={() => handleSelect(user)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="h-8 w-8 rounded-full bg-custom-brand-primary flex items-center justify-center text-sm font-medium text-custom-interactive-active-text">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  'text-custom-text-primary'
                }`}>
                  {user.name}
                </p>
                <p className={`text-xs truncate ${
                  'text-custom-text-secondary'
                }`}>
                  {user.email}
                </p>
              </div>
              <StatusBadge status={user.status} />
            </li>
          ))}
        </ul>
      )}

      {isOpen && query && filteredUsers.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-custom-bg-primary rounded-lg shadow-lg p-4 text-center border border-custom-bg-tertiary">
          <User2 className="h-6 w-6 mx-auto mb-2 text-custom-text-secondary" />
          <p className="text-custom-text-secondary">No members found</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;