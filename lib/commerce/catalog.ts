import { validEvidence } from './approval';

export type CatalogOffer = {
  id: string; name: string; description: string | null; image_url: string | null;
  price_cents: number | null; shipping_cents: number; stock_quantity: number | null;
  allowed_countries: string[]; compliance_status: string; manual_approved: boolean;
  is_published: boolean; reviewed_at: string | null; approval_reference: string | null;
  on_hold: boolean; legal_evidence: unknown;
};

export function catalogBlockReason(o: CatalogOffer, checkoutEnabled: boolean) {
  if (o.on_hold) return 'Der Verkauf dieses Produkts ist vorübergehend pausiert.';
  if (!o.manual_approved || !o.is_published || o.compliance_status !== 'approved' || !o.reviewed_at || !o.approval_reference)
    return 'Dieses Produkt ist noch nicht vom Betreiber für den Verkauf freigegeben.';
  if (!validEvidence(o.legal_evidence, o.allowed_countries))
    return 'Die Rechtsprüfung für dieses Produkt ist offen oder die Nachweise sind abgelaufen.';
  if (o.price_cents === null || !Number.isSafeInteger(o.price_cents) || o.price_cents <= 0)
    return 'Für dieses Produkt ist noch kein Preis freigegeben.';
  if (o.stock_quantity === null || !Number.isSafeInteger(o.stock_quantity) || o.stock_quantity < 1)
    return 'Dieses Produkt ist derzeit nicht bestellbar.';
  if (!checkoutEnabled) return 'Die Bestellfunktion ist derzeit noch nicht aktiviert.';
  return undefined;
}

