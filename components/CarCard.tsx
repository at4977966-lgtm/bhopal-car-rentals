 "use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { Fuel, Users, Gauge } from "lucide-react";

 export type RentalType = "self" | "driver";

 export type Car = {
   id: string;
   name: string;
   image: string;
   transmission: "Automatic" | "Manual";
   fuel: "Petrol" | "Diesel" | "EV" | "Hybrid";
   seats: number;
   selfDrivePrice: number;
   withDriverPrice: number;
   availableSelfDrive: boolean;
   availableDriver: boolean;
 };

 type Props = {
   car: Car;
   rentalType: RentalType;
   onBook: (car: Car) => void;
 };

 function formatPrice(n: number) {
   return `₹${n.toLocaleString("en-IN")}/day`;
 }

 export default function CarCard({ car, rentalType, onBook }: Props) {
   const price =
     rentalType === "self" ? car.selfDrivePrice : car.withDriverPrice;
   const available =
     rentalType === "self" ? car.availableSelfDrive : car.availableDriver;
     
   const [imageLoaded, setImageLoaded] = useState(false);

   // 3D Tilt Effect
   const x = useMotionValue(0);
   const y = useMotionValue(0);

   const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
   const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

   const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
   const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
     const rect = e.currentTarget.getBoundingClientRect();
     const width = rect.width;
     const height = rect.height;
     const mouseX = e.clientX - rect.left;
     const mouseY = e.clientY - rect.top;
     const xPct = mouseX / width - 0.5;
     const yPct = mouseY / height - 0.5;
     x.set(xPct);
     y.set(yPct);
   };

   const handleMouseLeave = () => {
     x.set(0);
     y.set(0);
   };

   return (
     <motion.article
       onMouseMove={handleMouseMove}
       onMouseLeave={handleMouseLeave}
       style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
       initial={{ opacity: 0, y: 16 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true, amount: 0.2 }}
       transition={{ type: "spring", stiffness: 260, damping: 24 }}
       className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl ring-1 ring-white/10 text-white perspective-1000"
     >
       <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-400/10 via-transparent to-slate-900/20" />
       <div className="relative flex flex-col gap-4" style={{ transform: "translateZ(30px)" }}>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-white/5">
          {!imageLoaded && (
            <div className="absolute inset-0 z-10 animate-pulse bg-white/10" />
          )}
          <Image
            src={car.image}
            alt={car.name}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
            }`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
            priority={false}
          />
          {available && car.name === "BMW M340i" && (
             <div className="absolute top-2 right-2 rounded-full bg-rose-500/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white shadow-lg border border-rose-400/50">
               Only 1 left for this weekend!
             </div>
          )}
        </div>
         <div className="flex items-start justify-between gap-3">
           <div className="flex-1">
             <h3 className="text-lg font-semibold tracking-tight">{car.name}</h3>
             <div className="mt-2 flex items-center gap-3 text-xs text-white/70">
               <div className="flex items-center gap-1">
                 <Gauge className="h-3.5 w-3.5 text-white/50" />
                 <span>{car.transmission}</span>
               </div>
               <div className="flex items-center gap-1">
                 <Fuel className="h-3.5 w-3.5 text-white/50" />
                 <span>{car.fuel}</span>
               </div>
               <div className="flex items-center gap-1">
                 <Users className="h-3.5 w-3.5 text-white/50" />
                 <span>{car.seats}</span>
               </div>
             </div>
           </div>
           <div className="flex flex-col items-end">
             <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-wider font-medium">
               {rentalType === "self" ? "Self-Drive" : "With Driver"}
             </span>
           </div>
         </div>
         <div className="flex items-center justify-between">
           <div className="text-xl font-bold">{formatPrice(price)}</div>
           <div
             className={
               available
                 ? "inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300"
                 : "inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-500/15 px-3 py-1 text-xs font-medium text-rose-300"
             }
           >
             <span
               className={
                 available
                   ? "h-1.5 w-1.5 rounded-full bg-emerald-300"
                   : "h-1.5 w-1.5 rounded-full bg-rose-300"
               }
             />
             {available ? "Available" : "Unavailable"}
           </div>
         </div>
         <button
           aria-label="Book car"
           disabled={!available}
           onClick={() => onBook(car)}
           className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-white/25"
         >
           Book Now
         </button>
       </div>
     </motion.article>
   );
 }
