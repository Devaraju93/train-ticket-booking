"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Corrected import
import api from "../utils/api";
import { ReserveSeats, type SeatsState } from "@/app/action";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

interface Seat {
  id: number;
  rowNumber: number;
  seatNumber: number;
  isReserved: boolean;
}

const SeatLayout: React.FC = () => {
  const initialState: SeatsState = { message: "", status: undefined };
  const [state, formAction] = useActionState(ReserveSeats, initialState);

  const [seats, setSeats] = useState<Seat[]>([]);
  const [totalSeats, setTotalSeats] = useState<number>(0);
  const [bookedSeats, setBookedSeats] = useState<number>(0);
  const [availableSeats, setAvailableSeats] = useState<number>(0);

  const router = useRouter(); // Corrected hook usage from next/navigation

  // Fetch seats layout, total seats, booked, and available seats
  const fetchSeats = async () => {
    try {
      const response = await api.get("/seats/layout");
      setSeats(response.data);
      const total = response.data.length;
      const booked = response.data.filter(
        (seat: Seat) => seat.isReserved
      ).length;
      const available = total - booked;
      setTotalSeats(total);
      setBookedSeats(booked);
      setAvailableSeats(available);
    } catch (error) {
      toast.error("Failed to fetch seats data.");
    }
  };

  useEffect(() => {
    fetchSeats(); // Call on mount to fetch the initial seat data
  }, []);

  // Show toast on success or error
  useEffect(() => {
    if (state.status === "Success") {
      toast.success(state.message);
      fetchSeats(); // Fetch seats again to update after booking
    } else if (state.status === "Error") {
      toast.error(state.message);
    }
  }, [state]);

  // Handle booking
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const seatsRequested = (e.target as HTMLFormElement).seatsRequested.value;

    // Call the backend API to reserve the seats
    try {
      await api.post("/seats/reserve", { seatsRequested });
      toast.success("Seats reserved successfully!");
      fetchSeats(); // Update the seat layout and available count
    } catch (error) {
      toast.error("Failed to reserve seats.");
    }
  };

  // Handle reset
  const handleReset = async () => {
    try {
      await api.post("/seats/reset");
      toast.success("All seats have been reset.");
      fetchSeats(); // Update the seat layout and available count after reset
    } catch (error) {
      toast.error("Failed to reset seats.");
    }
  };

  // Handle logout
  // const handleLogout = () => {
  //   // Here you can clear user session data, if any, and redirect to the home page
  //   // For example, clearing local storage or removing a token
  //   localStorage.removeItem("user"); // Assuming you are storing user info in localStorage
  //   router.push("/"); // Redirect to the home page
  // };

  // Render individual seat
  const renderSeat = (seat: Seat) => (
    <button
      key={seat.id}
      className={`w-full h-8 ${
        seat.isReserved
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
      } text-white text-xs font-semibold rounded transition duration-300 ease-in-out`}
    >
      {seat.id}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 w-full">
    <ToastContainer /> {/* Toastify Container */}
    <div className="mx-auto  rounded-lg  overflow-hidden p-4">
      {/* Parent Container */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Seat Grid */}
        <div className="flex-1 shadow-md">
          <div className="p-4 h-fit">
            <div className="grid grid-rows-12 gap-2">
              {Array.from({ length: 12 }, (_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-7 gap-2">
                  {seats
                    .filter((seat) => seat.rowNumber === rowIndex + 1)
                    .map(renderSeat)}
                </div>
              ))}
            </div>
            {/* Buttons for Booked Seats and Available Seats */}
            <div className="mt-7 flex space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                Booked Seats: {bookedSeats}
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                Available Seats: {availableSeats}
              </button>
            </div>
          </div>
        </div>
  
        {/* Right Side - Booking Form */}
        <div className="flex-1 flex items-center justify-center">
          <form
            onSubmit={handleBooking}
            className="space-y-4 w-full max-w-md"
          >
            {/* Input and Book Seats button in one row */}
            <div className="space-y-2">
              <label
                htmlFor="seats"
                className="block text-sm font-medium text-gray-700"
              >
                Book seats
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="seats"
                  type="number"
                  name="seatsRequested"
                  placeholder="Number of seats"
                  required
                  min={1}
                  max={7}
                  className="w-80 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                >
                  Book Seats
                </button>
              </div>
              {state?.errors?.["seatsRequested"]?.[0] && (
                <p className="text-red-500 text-xs">
                  {state.errors["seatsRequested"][0]}
                </p>
              )}
            </div>
  
            {/* Reset button */}
            <button
              onClick={handleReset}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Reset All Seats
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default SeatLayout;
