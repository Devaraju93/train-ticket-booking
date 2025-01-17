
# Train Seat Booking System

The **Train Seat Booking System** is a full-stack web application that allows users to reserve train seats efficiently. The system handles user authentication (login and signup), displays available seats, and allows users to book them interactively.

## Features

- **User Authentication**:
  - Signup: Create an account with a name, email, and password.
  - Login: Access the application with your credentials.

- **Seat Layout**:
  - View all available and reserved seats in a visually interactive grid.
  - Seats are color-coded:
    - Green: Available seats
    - Red: Reserved seats

- **Seat Booking**:
  - Reserve up to 7 seats in a single transaction.
  - Real-time feedback on seat booking status.

- **Validation**:
  - Form validations to ensure proper input for seat bookings and user authentication.

---

## Tech Stack

### Frontend:
- **Next.js** (React Framework)
- **TypeScript**: For static type checking
- **Tailwind CSS**: For responsive and modern UI design

### Backend:
- **Node.js**: Backend runtime
- **Prisma ORM**: For database interactions
- **Zod**: Schema validation
- **REST API**: For client-server communication

### Database:
- **PostgreSQL**: A relational database for seat and user data management

---

## Installation

### Prerequisites
- **Node.js** (v16+)
- **npm** or **yarn**
- **PostgreSQL** database

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Devaraju93/Train-Seat-Booking.git
   cd Train-Seat-Booking
   ```

2. **Install Dependencies**:
   ```bash
   # Install server dependencies
   cd backend
   npm install

   # Install client dependencies
   cd client
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create `.env` files in the `server` and `client` directories.
   -    - Example for **server** `.env`:
     ```env
     DATABASE_URL="postgresql://neondb_owner:QK3JgupZxj9G@ep-odd-hall-a5wmxy1k.us-east-2.aws.neon.tech/neondb?sslmode=require"
    JWT_SECRET="aj3kJ23j23jdsf@#Qasj213ASDka!#j123lMZfsLx2"
    PORT=8000
     ```
   - Example for **client** `.env`:
     ```env
     NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
     ```

4. **Run the Database Migrations**:
   ```bash
   cd server
   npx prisma migrate dev
   ```

5. **Start the Application**:
   - **Backend**:
     ```bash
     cd server
     npm start
     ```
   - **Frontend**:
     ```bash
     cd client
     npm run dev
     ```

6. **Access the Application**:
   - Visit: `http://localhost:3000`

---

## API Endpoints

### **Authentication**
- `POST /auth/signup`: Register a new user
- `POST /auth/login`: Log in an existing user

### **Seats**
- `GET /seats/layout`: Retrieve seat layout with availability
- `POST /seats/reserve`: Reserve seats
  - **Body**:
    ```json
    {
      "seatsRequested": 3
    }
    ```

