import { put, get } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { product, action } = req.body;
  let products = [];
  try {
    const blob = await get('products.json');
    const text = await fetch(blob.url).then(r => r.text());
    products = JSON.parse(text);
  } catch(e) { products = []; }

  if (action === 'add') {
    product.id = String(Date.now());
    products.push(product);
  } else if (action === 'edit') {
    const idx = products.findIndex(p => p.id === product.id);
    if (idx !== -1) products[idx] = product;
  } else if (action === 'delete') {
    products = products.filter(p => p.id !== product.id);
  }

  await put('products.json', JSON.stringify(products), { access: 'public', allowOverwrite: true });
  res.status(200).json({ success: true });
}