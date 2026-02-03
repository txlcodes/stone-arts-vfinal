import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const possiblePaths = [
    join(process.cwd(), 'public/detail_product_template.html'),
    join(process.cwd(), '../stoneartscrm/detail_product.html'),
  ];

  const results: any[] = [];

  for (const htmlPath of possiblePaths) {
    const exists = existsSync(htmlPath);
    results.push({
      path: htmlPath,
      exists,
      ...(exists && {
        size: readFileSync(htmlPath, 'utf-8').length,
        hasBody: /<body>/i.test(readFileSync(htmlPath, 'utf-8')),
      }),
    });
  }

  return NextResponse.json({
    cwd: process.cwd(),
    paths: results,
    message: 'Check which template file is being used',
  });
}
