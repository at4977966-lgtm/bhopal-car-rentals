import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Car from '@/models/Car';

export async function GET() {
  try {
    await dbConnect();
    const cars = await Car.find({});
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);

    // Fallback to empty array if DB is not reachable to avoid client-side crash
    return NextResponse.json([], { status: 200 });
  }
}