'use client';
import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { createCar } from '../actions';
import { Camera, Car as CarIcon, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminCarsPage() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 mt-10">
      <Link href="/admin" className="text-white/50 hover:text-white mb-6 inline-block">← Dashboard</Link>
      <h1 className="text-3xl font-bold mb-8">Add New Fleet Vehicle</h1>

      <form action={createCar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="name" placeholder="Model (e.g. BMW M340i)" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none" required />
        <input name="brand" placeholder="Brand" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none" required />

        <select name="transmission" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none" required>
          <option value="">Select Transmission</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>

        <select name="fuel" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none" required>
          <option value="">Select Fuel</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="EV">EV</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <input name="seats" type="number" placeholder="Seats (e.g. 5)" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none" required />

        <input name="selfDrivePrice" type="number" placeholder="Self-Drive Price (₹/day)" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none" required />

        <input name="withDriverPrice" type="number" placeholder="With Driver Price (₹/day)" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none" required />

        <div className="flex items-center gap-2">
          <input name="availableSelfDrive" type="checkbox" defaultChecked className="accent-blue-500" />
          <label>Available for Self-Drive</label>
        </div>

        <div className="flex items-center gap-2">
          <input name="availableDriver" type="checkbox" defaultChecked className="accent-blue-500" />
          <label>Available with Driver</label>
        </div>

        {/* Cloudinary Widget */}
        <div className="md:col-span-2">
          <CldUploadWidget uploadPreset="bhopal_cars" onSuccess={(result: any) => setImageUrl(result.info.secure_url)}>
            {({ open }) => (
              <button type="button" onClick={() => open()} className="w-full py-10 border-2 border-dashed border-white/10 rounded-xl hover:bg-white/5 transition">
                {imageUrl ? "✅ Photo Uploaded!" : "📸 Upload Car Photo"}
              </button>
            )}
          </CldUploadWidget>
          <input type="hidden" name="image" value={imageUrl} />
        </div>

        <button type="submit" className="md:col-span-2 py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-700">
          Save to Bhopal Fleet 🚀
        </button>
      </form>
    </div>
  );
}