"use server";

import { z } from "zod";
import api from "@/utils/api";

// Type for the state we send back to the front-end
export type SeatsState = {
    status: "Success" | "Error" | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
};

// Schema for validating the reservation input using Zod
const ReserveSeatsSchema = z.object({
    seatsRequested: z.number()
        .min(1, "Seats requested must be at least 1") // Min seats requested: 1
        .max(7, "You can only reserve up to 7 seats at a time.") // Max seats: 7
});

export async function ReserveSeats(prevState: SeatsState, formData: FormData): Promise<SeatsState> {
    try {
        // Parse and validate the input using Zod
        const parsedData = ReserveSeatsSchema.safeParse({
            seatsRequested: Number(formData.get("seatsRequested")) // Get the number of seats from the form data
        });

        // If input validation fails, return error state with validation messages
        if (!parsedData.success) {
            const state: SeatsState = {
                status: "Error",
                errors: parsedData.error.flatten().fieldErrors, // Flatten Zod error into field errors
                message: "Oops!! Something is wrong with your input field."
            };
            return state; // Return state to show the validation errors
        }

        // Send request to backend to reserve seats
        const response = await api.post("/seats/reserve", {
            seatsRequested: parsedData.data.seatsRequested // Pass the validated seats requested to the backend
        });

        // If seats are successfully reserved, return success state with message from backend
        if (response.status === 200) {
            const state: SeatsState = {
                status: "Success",
                message: response.data.message || "Seats reserved successfully!" // Success message from backend
            };
            return state;
        } else {
            // In case of error response from the backend, return error state with message
            const state: SeatsState = {
                status: "Error",
                message: response.data.error || "An error occurred while reserving seats."
            };
            return state;
        }

    } catch (err) {
        // Catch any unexpected errors and return error state
        console.error(err);
        const state: SeatsState = {
            status: "Error",
            message: "An unexpected error occurred."
        };
        return state; // Return error state
    }
}
