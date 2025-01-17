"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import SeatLayout from "@/components/SeatLayout";
import Link from "next/link";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isAuthenticated ? (
        <SeatLayout />
      ) : (
        <div className="text-center p-6 bg-white rounded shadow-md max-w-sm">
          <h1 className="text-2xl font-bold mb-4">Welcome to Train Booking</h1>
          <p className="mb-6">
            Please log in or sign up to book your train seats.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/login"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
