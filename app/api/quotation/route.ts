import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      address,
      city,
      postalCode,
      country,
      message,
      cartItems,
      total
    } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !city || !postalCode || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save quotation to database (you can create a Quotation model in Prisma)
    // For now, we'll save it as a JSON in a text field or create a simple storage
    
    // Option 1: Save to a Quotations table (requires Prisma schema update)
    // const quotation = await prisma.quotation.create({
    //   data: {
    //     firstName,
    //     lastName,
    //     email,
    //     phone,
    //     company,
    //     address,
    //     city,
    //     postalCode,
    //     country,
    //     message,
    //     cartItems: cartItems as any,
    //     total,
    //     status: 'PENDING'
    //   }
    // });

    // Option 2: For now, just return success (data is saved in localStorage on client)
    // You can add email notification here or save to database later
    
    // TODO: Send email notification
    // await sendQuotationEmail({ ...data });

    return NextResponse.json({
      success: true,
      message: 'Quotation request submitted successfully'
    });

  } catch (error) {
    console.error('Error processing quotation:', error);
    return NextResponse.json(
      { error: 'Failed to process quotation request' },
      { status: 500 }
    );
  }
}
