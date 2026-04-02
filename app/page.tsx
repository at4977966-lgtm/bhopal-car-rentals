 "use client";
 
 import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import CarCard, { Car, RentalType } from "@/components/CarCard";
import { Phone, Navigation, ShieldCheck, Star, Search, User, Car as CarIcon, MapPin, CheckCircle2 } from "lucide-react";
import { SignInButton, Show, UserButton } from '@clerk/nextjs';
 
const CARS: Car[] = [
  {
    id: "m340i",
    name: "BMW M340i",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    selfDrivePrice: 9000,
    withDriverPrice: 11000,
    availableSelfDrive: true,
    availableDriver: true,
  },
  {
    id: "thar",
    name: "Mahindra Thar Roxx",
    image:
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 4,
    selfDrivePrice: 5000,
    withDriverPrice: 6500,
    availableSelfDrive: true,
    availableDriver: false,
  },
  {
    id: "innova",
    name: "Toyota Innova Crysta",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 7,
    selfDrivePrice: 4500,
    withDriverPrice: 6000,
    availableSelfDrive: true,
    availableDriver: true,
  },
  {
    id: "swift",
    name: "Maruti Swift",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
    transmission: "Manual",
    fuel: "Petrol",
    seats: 5,
    selfDrivePrice: 2000,
    withDriverPrice: 3000,
    availableSelfDrive: true,
    availableDriver: true,
  },
  {
    id: "creta",
    name: "Hyundai Creta",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 5,
    selfDrivePrice: 3500,
    withDriverPrice: 5000,
    availableSelfDrive: true,
    availableDriver: true,
  },
  {
    id: "cclass",
    name: "Mercedes C-Class",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    selfDrivePrice: 12000,
    withDriverPrice: 14000,
    availableSelfDrive: false,
    availableDriver: true,
  },
  {
    id: "nexon-ev",
    name: "Tata Nexon EV",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop",
    transmission: "Automatic",
    fuel: "EV",
    seats: 5,
    selfDrivePrice: 4000,
    withDriverPrice: 5500,
    availableSelfDrive: true,
    availableDriver: true,
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    image:
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=1200&auto=format&fit=crop",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 7,
    selfDrivePrice: 8000,
    withDriverPrice: 10000,
    availableSelfDrive: true,
    availableDriver: true,
  },
];

 export default function Home() {
   const WHATSAPP_NUMBER = "919876543210";
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
 
   const filtered = useMemo(() => {
    return CARS.filter((c) => {
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
  }, [search, transmission, fuel, seats, onlyAvailable, rentalType]);
 
   const today = new Date().toISOString().split("T")[0];
 
   function openWhatsApp(car: Car) {
     const typeLabel = rentalType === "self" ? "Self-Drive" : "With Driver";
     const dateRange =
       form.from && form.to ? ` from ${form.from} to ${form.to}` : "";
     const msg = `Hello BhopalRentals, I want to book ${car.name} (${typeLabel})${dateRange}. My name is ${form.name} and my phone is ${form.phone}.`;
     const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
       msg
     )}`;
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
 
   return (
     <div className="min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white relative">
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
             <a className="text-white/80 hover:text-white transition-colors" href="#cars">
               Fleet
             </a>
             <a className="text-white/80 hover:text-white transition-colors" href="#process">
               How it Works
             </a>
             <a className="text-white/80 hover:text-white transition-colors" href="#trust">
               Reviews
             </a>
           </nav>
           <div className="flex items-center gap-4">
             <button onClick={() => window.open(`tel:+91${WHATSAPP_NUMBER}`, '_self')} className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/20 transition-all shadow-lg backdrop-blur-md">
               <Phone className="h-4 w-4" />
               Call Now
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
         <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
           {/* Video Background */}
           <div className="absolute inset-0 -z-10">
             <div className="absolute inset-0 bg-slate-950/60 z-10" />
             <video
               autoPlay
               loop
               muted
               playsInline
               className="h-full w-full object-cover opacity-60"
             >
               <source src="https://cdn.pixabay.com/video/2020/05/24/40141-424888806_large.mp4" type="video/mp4" />
               {/* Fallback image if video fails to load or for mobile data savings */}
               <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop" alt="Video fallback" className="h-full w-full object-cover" />
             </video>
           </div>

           <div className="relative z-20 w-full max-w-5xl px-4 py-20 flex flex-col items-center text-center">
             <motion.h1
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl"
             >
               Drive Your Ambition.
               <br className="hidden sm:block" />
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                 Premium Car Rentals in Bhopal.
               </span>
             </motion.h1>
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
               className="mt-6 max-w-2xl text-lg md:text-xl text-white/90 drop-shadow-lg"
             >
               Experience luxury and comfort with our top-tier fleet. Choose self-drive for the thrill, or with driver for ultimate relaxation.
             </motion.p>
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
               className="mt-10"
             >
               <a href="#cars" className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1">
                 Explore the Fleet
                 <Navigation className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               </a>
             </motion.div>

             {/* Search / Filter Glass Bar */}
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
               className="mt-16 w-full max-w-4xl rounded-3xl border border-white/20 bg-white/10 p-4 md:p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
             >
               <div className="flex flex-col gap-6">
                 <div className="flex justify-center">
                   <div className="relative inline-flex rounded-2xl bg-slate-900/50 p-1.5 ring-1 ring-white/10 backdrop-blur-md">
                     <button
                       onClick={() => setRentalType("self")}
                       className={`relative z-10 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-colors focus:outline-none ${rentalType === "self" ? "text-white" : "text-white/60 hover:text-white"}`}
                     >
                       <CarIcon className="h-4 w-4" />
                       Self-Drive
                     </button>
                     <button
                       onClick={() => setRentalType("driver")}
                       className={`relative z-10 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-colors focus:outline-none ${rentalType === "driver" ? "text-white" : "text-white/60 hover:text-white"}`}
                     >
                       <User className="h-4 w-4" />
                       With Driver
                     </button>
                     <motion.div
                       layout
                       className="absolute inset-y-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-blue-600 shadow-lg"
                       style={{
                         left: rentalType === "self" ? 6 : "calc(50% + 6px)",
                       }}
                       transition={{ type: "spring", stiffness: 400, damping: 30 }}
                     />
                   </div>
                 </div>

                 <div className="flex flex-wrap items-center justify-center gap-3">
                   <div className="relative flex-1 min-w-[200px]">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                     <input
                       value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       placeholder="Search cars (e.g. Thar)"
                       className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-3 pl-10 pr-4 text-sm placeholder-white/50 outline-none ring-1 ring-transparent transition-all focus:border-blue-500 focus:bg-slate-900/80 focus:ring-blue-500/50"
                     />
                   </div>
                   <select
                     value={transmission}
                     onChange={(e) => setTransmission(e.target.value as "All" | "Automatic" | "Manual")}
                     className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-slate-900/80"
                   >
                     <option className="bg-slate-900" value="All">Transmission</option>
                     <option className="bg-slate-900" value="Automatic">Automatic</option>
                     <option className="bg-slate-900" value="Manual">Manual</option>
                   </select>
                   <select
                     value={fuel}
                     onChange={(e) => setFuel(e.target.value as "All" | "Petrol" | "Diesel" | "EV" | "Hybrid")}
                     className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-slate-900/80"
                   >
                     <option className="bg-slate-900" value="All">Fuel Type</option>
                     <option className="bg-slate-900" value="Petrol">Petrol</option>
                     <option className="bg-slate-900" value="Diesel">Diesel</option>
                     <option className="bg-slate-900" value="EV">EV</option>
                   </select>
                 </div>
               </div>
             </motion.div>
           </div>
         </section>

         <section id="process" className="mx-auto max-w-7xl px-4 py-20">
           <div className="text-center mb-12">
             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="text-3xl md:text-4xl font-bold tracking-tight"
             >
               How it Works
             </motion.h2>
             <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="mt-4 text-white/60"
             >
               Your journey starts in three simple steps
             </motion.p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: Search, title: "Choose", desc: "Select from our premium fleet of sedans, SUVs, and EVs." },
               { icon: CheckCircle2, title: "Book", desc: "Reserve your dates securely with our simple online process." },
               { icon: Navigation, title: "Drive", desc: "Pick up your car or have it delivered right to your doorstep." }
             ].map((step, i) => (
               <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-50px" }}
                   transition={{ duration: 0.6, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                   className="flex flex-col items-center text-center p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                 >
                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mb-6">
                   <step.icon className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                 <p className="text-sm text-white/60">{step.desc}</p>
               </motion.div>
             ))}
           </div>
         </section>

         <section id="cars" className="mx-auto max-w-7xl px-4 py-10">
           <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
             <div>
               <h2 className="text-3xl font-bold tracking-tight">The Luxury Fleet</h2>
               <p className="mt-2 text-white/70">
                 Showing {filtered.length} {rentalType === "self" ? "Self-Drive" : "Chauffeur-driven"} options
               </p>
             </div>
             <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition-colors hover:bg-white/10">
               <input
                 type="checkbox"
                 checked={onlyAvailable}
                 onChange={(e) => setOnlyAvailable(e.target.checked)}
                 className="rounded border-white/20 bg-transparent text-blue-500 focus:ring-blue-500/50"
               />
               Show only available
             </label>
           </div>
           <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             variants={{
               hidden: { opacity: 0 },
               visible: {
                 opacity: 1,
                 transition: { staggerChildren: 0.1 }
               }
             }}
             className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
           >
             {filtered.map((car) => (
               <motion.div
                 key={car.id}
                 variants={{
                   hidden: { opacity: 0, y: 30 },
                   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                 }}
               >
                 <CarCard car={car} rentalType={rentalType} onBook={onBook} />
               </motion.div>
             ))}
           </motion.div>
           {filtered.length === 0 && (
             <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-white/60">
               <Search className="mx-auto h-12 w-12 opacity-20 mb-4" />
               <p className="text-lg">No cars match your filters.</p>
               <button onClick={() => { setSearch(""); setTransmission("All"); setFuel("All"); setSeats("Any"); }} className="mt-4 text-blue-400 hover:text-blue-300">Clear all filters</button>
             </div>
           )}
         </section>

         <section id="trust" className="mx-auto max-w-7xl px-4 py-20 border-t border-white/10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
               <motion.h2 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6 }}
                 className="text-3xl md:text-4xl font-bold tracking-tight mb-6"
               >
                 Trusted in Bhopal
               </motion.h2>
               <motion.p 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: 0.1 }}
                 className="text-white/70 mb-8 leading-relaxed"
               >
                 We are a locally verified business providing top-notch car rental services across MP Nagar, Arera Colony, and beyond. Your safety and comfort are our top priorities.
               </motion.p>
               <div className="flex flex-col gap-4">
                 {[
                   { name: "Rahul S.", text: "Best rental experience in Bhopal. The M340i was pristine!" },
                   { name: "Priya M.", text: "Hired an Innova with driver for a family trip. Highly professional." }
                 ].map((review, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
                     className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
                   >
                     <div className="flex items-center gap-2 mb-3">
                       <div className="flex text-yellow-400">
                         {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                       </div>
                       <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                         <ShieldCheck className="h-3 w-3" /> Verified
                       </span>
                     </div>
                     <p className="text-sm text-white/80 italic">&quot;{review.text}&quot;</p>
                     <p className="mt-2 text-xs font-semibold">— {review.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-square md:aspect-video lg:aspect-square w-full overflow-hidden rounded-3xl border border-white/20 bg-slate-800 shadow-2xl"
              >
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none" />
               <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl">
                 <MapPin className="h-5 w-5 text-blue-400" />
                 <div>
                   <p className="text-sm font-bold">BhopalRentals Hub</p>
                   <p className="text-xs text-white/70">MP Nagar, Bhopal, MP</p>
                 </div>
               </div>
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117304.09355653696!2d77.34563814891107!3d23.25052955554162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c428f8fd68fbd%3A0x2155716d572d4f8!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                 className="absolute inset-0 h-full w-full opacity-60 mix-blend-luminosity grayscale"
                 style={{ border: 0 }}
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </div>
          </section>
       </main>

       {/* WhatsApp Float */}
       <button
         onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Neeraj, I need a car for tomorrow!`, '_blank')}
         className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-3 rounded-full bg-emerald-500/90 backdrop-blur-md px-5 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50 transition-transform hover:scale-105 hover:bg-emerald-500"
       >
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
         <span className="hidden md:inline">WhatsApp Us</span>
       </button>
 
       {/* Modal Animation Overlay */}
       <AnimatePresence>
         {modalOpen && selectedCar && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
               onClick={() => setModalOpen(false)}
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
               className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl ring-1 ring-white/10"
             >
             <div className="mb-4 flex items-center justify-between">
               <h3 className="text-lg font-semibold">
                 Book {selectedCar.name}
               </h3>
               <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                 {rentalType === "self" ? "Self-Drive" : "With Driver"}
               </span>
             </div>
             <form onSubmit={handleSubmit} className="space-y-3">
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                 <div>
                   <label className="mb-1 block text-xs text-white/70">From</label>
                   <input
                     type="date"
                     min={today}
                     value={form.from}
                     onChange={(e) => setForm({ ...form, from: e.target.value })}
                     required
                     className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2"
                   />
                 </div>
                 <div>
                   <label className="mb-1 block text-xs text-white/70">To</label>
                   <input
                     type="date"
                     min={form.from || today}
                     value={form.to}
                     onChange={(e) => setForm({ ...form, to: e.target.value })}
                     required
                     className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2"
                   />
                 </div>
               </div>
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                 <div>
                   <label className="mb-1 block text-xs text-white/70">Name</label>
                   <input
                     type="text"
                     value={form.name}
                     onChange={(e) => setForm({ ...form, name: e.target.value })}
                     placeholder="Your name"
                     required
                     className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2"
                   />
                 </div>
                 <div>
                   <label className="mb-1 block text-xs text-white/70">Phone</label>
                   <input
                     type="tel"
                     value={form.phone}
                     onChange={(e) => setForm({ ...form, phone: e.target.value })}
                     placeholder="10-digit mobile"
                     required
                     className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-2"
                   />
                 </div>
               </div>
               <div className="pt-2 flex items-center justify-end gap-3">
                 <button
                   type="button"
                   onClick={() => setModalOpen(false)}
                   className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/10 hover:bg-white/15"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 hover:bg-white/25"
                 >
                   Send on WhatsApp
                 </button>
               </div>
             </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer id="contact" className="border-t border-white/10 bg-slate-950/60 backdrop-blur">
         <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-white/70">
           © {new Date().getFullYear()} BhopalRentals. All rights reserved.
         </div>
       </footer>
     </div>
   );
 }
