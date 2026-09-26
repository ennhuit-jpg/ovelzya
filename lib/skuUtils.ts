import { Product } from './types';

/**
 * Normalizes SKU string by trimming, removing extra hyphens and uppercasing.
 */
export function normalizeSku(sku: string): string {
  return (sku || '').trim().toUpperCase();
}

/**
 * Category prefix dictionary for fallback SKU formatting
 */
export function getCategoryPrefix(cat: string): string {
  const c = (cat || '').toLowerCase();
  if (c.includes('collier') || c.includes('necklace') || c.includes('قلاد')) return 'COL';
  if (c.includes('bracelet') || c.includes('سوار')) return 'BRA';
  if (c.includes('bague') || c.includes('ring') || c.includes('خاتم')) return 'BAG';
  if (c.includes('boucle') || c.includes('earring') || c.includes('أقراط')) return 'BOU';
  if (c.includes('sac') || c.includes('bag') || c.includes('حقيب')) return 'SAC';
  return 'BIJ';
}

/**
 * Returns canonical SKU for a product:
 * e.g., if product has an explicit sku (like 'MD-COL-001'), uses that.
 * Otherwise defaults to standard pattern: MD-COL-001 or MD-001-OR.
 */
export function getProductSku(product: Product): string {
  if (product.sku && product.sku.trim()) {
    return normalizeSku(product.sku);
  }
  const prefix = getCategoryPrefix(product.cat);
  const num = String(product.id).padStart(3, '0');
  return `MD-${prefix}-${num}`;
}

/**
 * Flexible search to locate a product by SKU:
 * Matches:
 * 1. Exact or normalized product.sku
 * 2. Generated standard SKU: MD-COL-001
 * 3. Short format: MD-001 or MD-001-OR or OV-001
 * 4. Just product ID: e.g. "1" or "001"
 */
export function findProductBySku(querySku: string, products: Product[]): Product | undefined {
  if (!querySku || !products || products.length === 0) return undefined;
  const q = normalizeSku(querySku);

  // Direct match on explicit sku
  const exact = products.find((p) => normalizeSku(p.sku || '') === q);
  if (exact) return exact;

  // Match on getProductSku(p)
  const canonical = products.find((p) => getProductSku(p) === q);
  if (canonical) return canonical;

  // Match variants like MD-001, MD-001-OR, OV-001, OV-001-OR
  const matchId = products.find((p) => {
    const padded = String(p.id).padStart(3, '0');
    const directId = String(p.id);
    return (
      q === `MD-${padded}-OR` ||
      q === `MD-${padded}` ||
      q === `OV-${padded}` ||
      q === `OV-${padded}-OR` ||
      q === `MD-${directId}` ||
      q === directId
    );
  });
  if (matchId) return matchId;

  // Partial match inside SKU if length >= 3
  if (q.length >= 3) {
    const partial = products.find((p) => {
      const s = getProductSku(p);
      return s.includes(q) || (p.sku && normalizeSku(p.sku).includes(q));
    });
    if (partial) return partial;
  }

  // Match by numeric product ID
  const cleanedDigits = q.replace(/[^0-9]/g, '');
  if (cleanedDigits.length > 0) {
    const numId = parseInt(cleanedDigits, 10);
    const byNum = products.find((p) => p.id === numId);
    if (byNum) return byNum;
  }

  // Match by product name if query has at least 3 characters
  const rawQuery = (querySku || '').trim().toLowerCase();
  if (rawQuery.length >= 3) {
    const byName = products.find((p) => {
      const nameFr = (p.name || '').toLowerCase();
      const nameAr = (p.name_ar || '').toLowerCase();
      return nameFr.includes(rawQuery) || nameAr.includes(rawQuery);
    });
    if (byName) return byName;
  }

  return undefined;
}

/**
 * Calculates discounted price rounded to nearest integer.
 */
export function calculateDiscountedPrice(originalPrice: number, discountPct: number): number {
  const pct = Math.max(0, Math.min(90, discountPct));
  return Math.max(1, Math.round(originalPrice * (1 - pct / 100)));
}
