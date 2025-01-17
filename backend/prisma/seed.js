const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    for (let row = 1; row <= 12; row++) {
        const seatsInRow = row === 12 ? 3 : 7; // Last row (row 12) will have 3 seats, others will have 7 seats
        for (let seat = 1; seat <= seatsInRow; seat++) {
            await prisma.seat.create({
                data: {
                    rowNumber: row,
                    seatNumber: seat,
                },
            });
        }
    }
    console.log('Seats seeded successfully');
}

main()
    .then(() => prisma.$disconnect())
    .catch(err => {
        console.error(err);
        prisma.$disconnect();
    });
