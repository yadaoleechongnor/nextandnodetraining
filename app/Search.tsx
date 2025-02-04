"use client"

import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!searchQuery) {
      setError('Please enter a search query.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://nodebackend-magg.onrender.com/api/users/${encodeURIComponent(searchQuery)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result: User = await response.json();
      setSearchResult(result);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError((error as Error).message);
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for users..."
      />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>

      {error && <p className="text-red-500">Error: {error}</p>}

      {searchResult && (
        <div>
          <h2>Search Result:</h2>
          <pre>{JSON.stringify(searchResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Search;