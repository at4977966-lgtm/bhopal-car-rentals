"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import CarCard, { Car, RentalType } from "@/components/CarCard";
import { Phone, Navigation, ShieldCheck, Star, Search, User, Car as CarIcon, MapPin, CheckCircle2 } from "lucide-react";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';

const FALLBACK_CARS: Car[] = [
  {
    id: '1',
    name: 'BMW 5 Series',
    image: 'https://res.cloudinary.com/dxft2zv3l/image/upload/v1/bhopalcars/bmw5.jpg',
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 5,
    selfDrivePrice: 4500,
    withDriverPrice: 5200,
    availableSelfDrive: true,
    availableDriver: true,
  },
  {
    id: '2',
    name: 'Toyota Innova',
    image: 'https://res.cloudinary.com/dxft2zv3l/image/upload/v1/bhopalcars/innova.jpg',
    transmission: 'Manual',
    fuel: 'Diesel',
    seats: 7,
    selfDrivePrice: 3000,
    withDriverPrice: 3500,
    availableSelfDrive: true,
    availableDriver: true,
  },
];

export default function Home() {
  const WHATSAPP_NUMBER = "919876543210";
  
  // State for dynamic database cars
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [rentalType, setRentalType] = useState<RentalType>("self");
  const [search, setSearch] = useState("");
  const [transmission, setTransmission] = useState<"All" | Car["transmission"]>("All");
  const [fuel, setFuel] = useState<"All" | Car["fuel"]>("All");
  const [seats, setSeats] = useState<"Any" | 2 | 4 | 5 | 7 | 8>("Any");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [form, setForm] = useState({
    from: "",
    to: "",
    name: "",
    phone: "",
  });

  // Fetch cars from your MongoDB API route on mount
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFleet() {
      try {
        const res = await fetch('/api/cars');
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          const message = (data && (data.error || data.message)) || 'Invalid fleet payload';
          throw new Error(message);
        }

        setCars(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load fleet:", err);
        setCars(FALLBACK_CARS);
        setError(err?.message || 'Could not load fleet. Using fallback vehicles.');
      } finally {
        setLoading(false);
      }
    }
    fetchFleet();
  }, []);

  // useMemo now uses the dynamic 'cars' state instead of static 'CARS'
  const filtered = useMemo(() => {
    if (!Array.isArray(cars)) return [];
    return cars.filter((c) => {
      if (onlyAvailable) {
        if (rentalType === "self" && !c.availableSelfDrive) return false;
        if (rentalType === "driver" && !c.availableDriver) return false;
      }
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (transmission !== "All" && c.transmission !== transmission)
        return false;
      if (fuel !== "All" && c.fuel !== fuel) return false;
      if (seats !== "Any" && c.seats !== seats) return false;
      return true;
    });
  }, [cars, search, transmission, fuel, seats, onlyAvailable, rentalType]);

  const today = new Date().toISOString().split("T")[0];

  function openWhatsApp(car: Car) {
    const typeLabel = rentalType === "self" ? "Self-Drive" : "With Driver";
    const dateRange =
      form.from && form.to ? ` from ${form.from} to ${form.to}` : "";
    const msg = `Hello BhopalRentals, I want to book ${car.name} (${typeLabel})${dateRange}. My name is ${form.name} and my phone is ${form.phone}.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  function onBook(car: Car) {
    setSelectedCar(car);
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCar) return;
    openWhatsApp(selectedCar);
    setModalOpen(false);
    setForm({ from: "", to: "", name: "", phone: "" });
  }

  // Loading state with Glassmorphism matching your theme
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin backdrop-blur-md"></div>
      </div>
    );
  }

  const showError = !!error;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white relative">
      {showError && (
        <div className="mx-auto mb-4 max-w-6xl rounded-xl border border-red-400/40 bg-red-500/15 p-4 text-red-100 text-sm">
          <strong>Notice:</strong> {error}. Showing available fallback fleet only.
        </div>
      )}
      {/* EVERYTHING BELOW IS YOUR ORIGINAL UNCHANGED UI/UX */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 ring-1 ring-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <CarIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">BhopalRentals</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <a className="text-white/80 hover:text-white transition-colors" href="#cars">Fleet</a>
            <a className="text-white/80 hover:text-white transition-colors" href="#process">How it Works</a>
            <a className="text-white/80 hover:text-white transition-colors" href="#trust">Reviews</a>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => window.open(`tel:+91${WHATSAPP_NUMBER}`, '_self')} className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/20 transition-all shadow-lg backdrop-blur-md">
              <Phone className="h-4 w-4" /> Call Now
            </button>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]">
                  Sign In
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton appearance={{ elements: { avatarBox: "h-9 w-9 ring-2 ring-white/20" } }} />
            </Show>
          </div>
        </div>
      </motion.header>

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-slate-950/60 z-10" />
            <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-60">
              <source src="https://cdn.pixabay.com/video/2020/05/24/40141-424888806_large.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="relative z-20 w-full max-w-5xl px-4 py-20 flex flex-col items-center text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight">
              Drive Your Ambition. <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Premium Car Rentals in Bhopal.</span>
            </motion.h1>
            <div className="mt-16 w-full max-w-4xl rounded-3xl border border-white/20 bg-white/10 p-4 md:p-6 shadow-2xl backdrop-blur-xl">
               <div className="flex flex-col gap-6">
                 <div className="flex justify-center">
                   <div className="relative inline-flex rounded-2xl bg-slate-900/50 p-1.5 ring-1 ring-white/10 backdrop-blur-md">
                     <button onClick={() => setRentalType("self")} className={`relative z-10 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-colors ${rentalType === "self" ? "text-white" : "text-white/60"}`}>
                       <CarIcon className="h-4 w-4" /> Self-Drive
                     </button>
                     <button onClick={() => setRentalType("driver")} className={`relative z-10 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-colors ${rentalType === "driver" ? "text-white" : "text-white/60"}`}>
                       <User className="h-4 w-4" /> With Driver
                     </button>
                     <motion.div layout className="absolute inset-y-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-blue-600" style={{ left: rentalType === "self" ? 6 : "calc(50% + 6px)" }} />
                   </div>
                 </div>
                 <div className="flex flex-wrap items-center justify-center gap-3">
                   <div className="relative flex-1 min-w-[200px]">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                     <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cars..." className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-3 pl-10 pr-4 text-sm" />
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Fleet Section */}
        <section id="cars" className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
             <h2 className="text-3xl font-bold tracking-tight">The Luxury Fleet</h2>
             <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
               <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="accent-blue-500" />
               Show only available
             </label>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} rentalType={rentalType} onBook={onBook} />
            ))}
          </motion.div>
        </section>
      </main>

      {/* WhatsApp Float & Modal remain exactly the same as in your original file... */}
      <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')} className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-3 rounded-full bg-emerald-500/90 backdrop-blur-md px-5 py-4 text-sm font-bold shadow-lg">
        <span className="hidden md:inline">WhatsApp Us</span>
      </button>

      {/* AnimatePresence for Modal */}
      <AnimatePresence>
        {modalOpen && selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">Book {selectedCar.name}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="date"
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                  min={today}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none"
                  placeholder="From Date"
                  required
                />
                <input
                  type="date"
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  min={form.from || today}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none"
                  placeholder="To Date"
                  required
                />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none"
                  placeholder="Your Name"
                  required
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none"
                  placeholder="Phone Number"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 bg-gray-600 rounded-xl font-medium hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-emerald-600 rounded-xl font-medium hover:bg-emerald-700"
                  >
                    Book via WhatsApp
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-white/10 bg-slate-950/60 backdrop-blur">
         <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-white/70">
           © {new Date().getFullYear()} BhopalRentals. All rights reserved.
         </div>
      </footer>
    </div>
  );
}