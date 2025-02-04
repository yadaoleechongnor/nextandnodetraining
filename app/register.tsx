'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  password: string;
  age: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    age: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(formData);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch("https://nodebackend-magg.onrender.com/api/users/create/", requestOptions);
      const result = await response.json();
      if (response.ok) {
        setMessage("User registered successfully!");
        window.location.reload(); // Refresh the page after successful registration
      } else {
        setMessage(result.message || "An error occurred during registration.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during registration.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ margin: "5px", padding: "8px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ margin: "5px", padding: "8px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ margin: "5px", padding: "8px" }}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          style={{ margin: "5px", padding: "8px" }}
        />
        <button type="submit" style={{ background: "green", color: "white", padding: "10px" }}>
          Submit
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;