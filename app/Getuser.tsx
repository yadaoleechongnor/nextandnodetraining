"use client";
import { MdOutlineDeleteOutline } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// Define the type for the user data you expect from the API
interface UserData {
  _id: string; // MongoDB ID
  name: string;
  email: string;
  password: string;
  age: number;
}

export default function Getuser() {
  const [userData, setUserData] = useState<UserData[] | null>(null); // Array of users
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user data on component mount
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

  // Handle user deletion
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

  // Handle user update (PUT request)
  const handleUpdateUser = async (userId: string, updatedData: Partial<UserData>) => {
    try {
      const response = await fetch(`https://nodebackend-magg.onrender.com/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData), // Send updated data
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const updatedUser = await response.json();

      // Update the user in the state
      setUserData((prevUserData) =>
        prevUserData?.map((user) =>
          user._id === userId ? { ...user, ...updatedUser } : user
        ) || null
      );

      console.log('User updated successfully:', updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const confirmUpdate = (user: UserData) => {
    Swal.fire({
      title: 'Update User',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${user.name}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Email" value="${user.email}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Password" value="${user.password}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Age" value="${user.age}">`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          name: (document.getElementById('swal-input1') as HTMLInputElement).value,
          email: (document.getElementById('swal-input2') as HTMLInputElement).value,
          password: (document.getElementById('swal-input3') as HTMLInputElement).value,
          age: parseInt((document.getElementById('swal-input4') as HTMLInputElement).value),
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateUser(user._id, result.value);
        Swal.fire('Updated!', 'User has been updated.', 'success');
      }
    });
  };

  return (
    <div className='flex justify-center h-[20%] overflow-hidden items-center mt-4 bg-gray-100'>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : userData && userData.length > 0 ? (
        <div className="space-y-4 flex gap-4 py-4 w-[100%] overflow-auto scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200">
          {userData.map((user) => (
            <div key={user._id} className='p-6 bg-white shadow-md rounded-lg'>
              <MdOutlineDeleteOutline
                className="flex cursor-pointer"
                onClick={() => handleDeleteUser(user._id)}
              />
              <h2 className='text-2xl font-bold'>{user.name}</h2>
              <p className='text-gray-600'>Email: {user.email}</p>
              {/* <p className='text-gray-600'>Password: {user.password}</p> */}
              <p className='text-gray-600'>Age: {user.age}</p>
              <button
                onClick={() => confirmUpdate(user)}
                className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
              >
                Update
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