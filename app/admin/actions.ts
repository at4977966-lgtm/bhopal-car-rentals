'use server'
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCar(formData: FormData) {
  try {
    await dbConnect();

    const carData = {
      name: formData.get('name'),
      brand: formData.get('brand'),
      transmission: formData.get('transmission'),
      fuel: formData.get('fuel'),
      seats: Number(formData.get('seats')),
      selfDrivePrice: Number(formData.get('selfDrivePrice')),
      withDriverPrice: Number(formData.get('withDriverPrice')),
      image: formData.get('image'),
      availableSelfDrive: formData.get('availableSelfDrive') === 'on',
      availableDriver: formData.get('availableDriver') === 'on',
    };

    await Car.create(carData);
    revalidatePath('/'); // Updates your home page fleet instantly
    revalidatePath('/admin');
  } catch (error) {
    console.error('Database Error:', error);
    // keep UI transition but optionally set flash state (for future improvement)
  }

  redirect('/admin');
}