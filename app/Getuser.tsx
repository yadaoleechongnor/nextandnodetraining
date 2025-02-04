"use client";
import { MdOutlineDeleteOutline } from "react-icons/md";


import React, { useEffect, useState } from 'react';

// Define the type for the user data you expect from the API
interface UserData {
  _id: string; // Add this if your API returns an `_id` field
  name: string;
  email: string;
  password: string;
  age: number;
}

export default function Getuser() {
  const [userData, setUserData] = useState<UserData[] | null>(null); // Change to an array of UserData
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://nodebackend-magg.onrender.com/api/users/getusers/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const result: UserData[] = await response.json(); // Expect an array of users
        setUserData(result);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`https://nodebackend-magg.onrender.com/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      // Remove the deleted user from the state
      setUserData((prevUserData) => prevUserData?.filter(user => user._id !== userId) || null);
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className='flex justify-center h-[20%] overflow-hidden items-center mt-4  bg-gray-100 '>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500 ">Error: {error.message}</p>
      ) : userData && userData.length > 0 ? (
        <div className="space-y-4 flex gap-4 py-4 w-[100%] overflow-auto scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200">
          {userData.map((user) => (
            <div key={user._id} className='p-6 bg-white shadow-md rounded-lg'>
<MdOutlineDeleteOutline className="flex " />
              <h2 className='text-2xl font-bold'>{user.name}</h2>
              <p className='text-gray-600'>Email: {user.email}</p>
              <p className='text-gray-600'>Password: {user.password}</p>
              <p className='text-gray-600'>Age: {user.age}</p>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className='mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
}