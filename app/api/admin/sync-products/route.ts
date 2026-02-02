import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products } = body;

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid request: products array is required' },
        { status: 400 }
      );
    }

    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const productData of products) {
      try {
        // Extract and transform product data
        const productInput = {
          productId: productData.productId,
          variantId: productData.variantId,
          name: productData.name,
          slug: productData.slug,
          handle: productData.handle || null,
          type: productData.type || null,
          description: productData.description || null,
          stone: productData.stone || null,
          altText: productData.alt_text || null,
          category: productData.category || null,
          price: parseFloat(productData.priceValue || productData.price?.replace(/[^0-9.]/g, '') || '0'),
          priceValue: parseFloat(productData.priceValue || productData.price?.replace(/[^0-9.]/g, '') || '0'),
          currency: productData.currency || 'EUR',
          stock: productData.stock || 0,
          images: productData.images || [],
          mainImage: productData.mainImage || null,
          specialImage: productData.special_image || null,
          specialImage2: productData.special_image_2 || null,
          hoverImage: productData.hover_image || null,
          hoverImageInstallation: productData.hover_image_installation || null,
          selectionSliderImage: productData.selection_slider_image || null,
          color: productData.color || null,
          buttonHeaderColor: productData.button_header_color || null,
          specialFieldSlogan: productData.special_field_slogan || null,
          specialFieldText: productData.special_field_text || null,
          specialFieldButton: productData.special_field_button || null,
        };

        // Upsert product (create or update)
        const product = await prisma.product.upsert({
          where: { productId: productInput.productId },
          update: productInput,
          create: productInput,
        });

        if (product) {
          // Check if this was an update or create by checking createdAt vs updatedAt
          const wasCreated = product.createdAt.getTime() === product.updatedAt.getTime();
          if (wasCreated) {
            results.created++;
          } else {
            results.updated++;
          }
        }
      } catch (error: any) {
        const errorMsg = `Error syncing product ${productData.name || productData.productId}: ${error.message}`;
        console.error(errorMsg, error);
        results.errors.push(errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${products.length} products`,
      results,
    });
  } catch (error: any) {
    console.error('Error in sync-products API:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
