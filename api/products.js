import { get } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const blob = await get('products.json');
    const text = await fetch(blob.url).then(r => r.text());
    res.status(200).json(JSON.parse(text));
  } catch(e) {
    res.status(200).json([]);
  }
}