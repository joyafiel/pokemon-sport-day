export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const sheetId = '13tBzKAwJQYwUlVdzYU4KlnxPLm8Cbt4dSA9Vk5tLEyA';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    const response = await fetch(url);
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;
    const products = rows.map((row, i) => ({
      id: row.c[0]?.v?.toString() || String(i + 1),
      name: row.c[1]?.v || '',
      price: Number(row.c[2]?.v) || 0,
      cost: Number(row.c[3]?.v) || 0,
      stock: Number(row.c[4]?.v) || 0,
      note: row.c[5]?.v || '',
      image: row.c[6]?.v || ''
    })).filter(p => p.name);
    res.status(200).json(products);
  } catch(e) {
    console.error(e);
    res.status(200).json([]);
  }
}
