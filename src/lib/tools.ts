/**
 * Hotel booking tools for the agent.
 * These are deterministic, in-memory functions with no external API calls.
 */

// Mock hotel database
interface Hotel {
  id: string;
  name: string;
  city: string;
  pricePerNight: number;
  availableDates: string[];
}

interface Booking {
  id: string;
  hotelId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed";
}

const mockHotels: Hotel[] = [
  {
    id: "hotel-1",
    name: "Downtown Palace",
    city: "Vancouver",
    pricePerNight: 120,
    availableDates: ["2026-02-01", "2026-02-02", "2026-02-03"],
  },
  {
    id: "hotel-2",
    name: "Budget Inn",
    city: "Vancouver",
    pricePerNight: 60,
    availableDates: ["2026-02-01", "2026-02-02"],
  },
  {
    id: "hotel-3",
    name: "Luxury Suites",
    city: "Vancouver",
    pricePerNight: 250,
    availableDates: ["2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04"],
  },
  {
    id: "hotel-4",
    name: "Toronto Gateway",
    city: "Toronto",
    pricePerNight: 100,
    availableDates: ["2026-02-01", "2026-02-02"],
  },
  {
    id: "hotel-5",
    name: "Montreal Elegance",
    city: "Montreal",
    pricePerNight: 95,
    availableDates: ["2026-02-05", "2026-02-06", "2026-02-07"],
  },
];

// In-memory bookings store
const bookings: Booking[] = [];
let bookingCounter = 0;

/**
 * Search for hotels by city and price constraint.
 * Optionally filters by date availability.
 *
 * @param city - City to search in
 * @param maxPrice - Maximum price per night
 * @param checkInDate - Optional check-in date (YYYY-MM-DD)
 * @returns Array of matching hotels with details
 */
export function searchHotels(
  city: string,
  maxPrice: number,
  checkInDate?: string
): {
  hotelId: string;
  name: string;
  pricePerNight: number;
  available: boolean;
}[] {
  const results = mockHotels
    .filter((hotel) => hotel.city.toLowerCase() === city.toLowerCase())
    .filter((hotel) => hotel.pricePerNight <= maxPrice)
    .filter((hotel) => {
      if (!checkInDate) return true;
      return hotel.availableDates.includes(checkInDate);
    })
    .map((hotel) => ({
      hotelId: hotel.id,
      name: hotel.name,
      pricePerNight: hotel.pricePerNight,
      available: true,
    }));

  return results;
}

/**
 * Book a hotel for a user.
 * Creates a booking record in memory.
 *
 * @param hotelId - ID of the hotel to book
 * @param userId - ID of the user making the booking
 * @param checkInDate - Check-in date (YYYY-MM-DD)
 * @param checkOutDate - Check-out date (YYYY-MM-DD)
 * @returns Booking confirmation with details
 */
export function bookHotel(
  hotelId: string,
  userId: string,
  checkInDate: string,
  checkOutDate: string
): {
  bookingId: string;
  hotelId: string;
  hotelName: string;
  userId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: "confirmed";
} {
  const hotel = mockHotels.find((h) => h.id === hotelId);

  if (!hotel) {
    throw new Error(`Hotel with ID ${hotelId} not found`);
  }

  // Validate dates are available
  if (!hotel.availableDates.includes(checkInDate)) {
    throw new Error(
      `Hotel ${hotel.name} is not available on ${checkInDate}`
    );
  }

  // Calculate nights (simple calculation, not production-ready)
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (nights <= 0) {
    throw new Error("Check-out date must be after check-in date");
  }

  const totalPrice = hotel.pricePerNight * nights;
  const bookingId = `booking-${++bookingCounter}`;

  // Store booking in memory
  const booking: Booking = {
    id: bookingId,
    hotelId,
    userId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    status: "confirmed",
  };
  bookings.push(booking);

  return {
    bookingId,
    hotelId,
    hotelName: hotel.name,
    userId,
    checkInDate,
    checkOutDate,
    totalPrice,
    status: "confirmed",
  };
}
