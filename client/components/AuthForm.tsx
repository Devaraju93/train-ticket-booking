'use client'
import React, { useState } from "react";
import api from "../utils/api";
import { useRouter } from "next/navigation";
import { setToken } from "../utils/auth";

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = type === "signup" ? "/auth/signup" : "/auth/login";
      const response = await api.post(endpoint, formData);

      if (type === "login") {
        setToken(response.data.token);
        router.push("/");
      } else {
        alert("Registration successful. Please log in.");
        router.push("/auth/login");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {type === "signup" ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit}>
        {type === "signup" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {type === "signup" ? "Register" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
