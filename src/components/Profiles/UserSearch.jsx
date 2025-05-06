import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User2 } from 'lucide-react';

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
          className="w-full bg-dblack-500 text-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-dcyan-500"
          placeholder="Search members by name, email, or phone..."
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && filteredUsers.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-2 bg-dblack-800 rounded-lg shadow-lg max-h-80 overflow-auto border border-dblack-700"
        >
          {filteredUsers.map((user, index) => (
            <li
              key={user.id}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-dcyan-600 text-dblack-900'
                  : 'hover:bg-dblack-700'
              }`}
              onClick={() => handleSelect(user)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="h-8 w-8 rounded-full bg-dcyan-700 flex items-center justify-center text-sm font-medium text-dblack-900">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  index === selectedIndex ? 'text-dblack-900' : 'text-slate-200'
                }`}>
                  {user.name}
                </p>
                <p className={`text-xs truncate ${
                  index === selectedIndex ? 'text-dblack-800' : 'text-slate-400'
                }`}>
                  {user.email}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                user.status === 'Active'
                  ? index === selectedIndex
                    ? 'bg-green-200 text-green-900'
                    : 'bg-green-100 text-green-800'
                  : index === selectedIndex
                    ? 'bg-red-200 text-red-900'
                    : 'bg-red-100 text-red-800'
              }`}>
                {user.status}
              </span>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query && filteredUsers.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-dblack-800 rounded-lg shadow-lg p-4 text-center border border-dblack-700">
          <User2 className="h-6 w-6 mx-auto mb-2 text-slate-400" />
          <p className="text-slate-400">No members found</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;