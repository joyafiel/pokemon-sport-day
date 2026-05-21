import { put, get } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { productId, productName, price, qty, name, contact, note } = req.body;

    // 讀取目前商品資料
    const blob = await get('products.json');
    const text = await fetch(blob.url).then(r => r.text());
    let products = JSON.parse(text);

    // 找商品並扣庫存
    const idx = products.findIndex(p => p.id === productId);
    if (idx === -1) return res.status(404).json({ success: false, message: '商品不存在' });
    if (products[idx].stock < qty) return res.status(400).json({ success: false, message: '庫存不足' });
    products[idx].stock -= qty;

    // 存回 Blob
    await put('products.json', JSON.stringify(products), { access: 'public', allowOverwrite: true });

    // 記錄訂單到 orders.json
    let orders = [];
    try {
      const ob = await get('orders.json');
      const ot = await fetch(ob.url).then(r => r.text());
      orders = JSON.parse(ot);
    } catch(e) { orders = []; }

    orders.push({
      id: Date.now(),
      productId, productName, price, qty, name, contact, note,
      time: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    });
    await put('orders.json', JSON.stringify(orders), { access: 'public', allowOverwrite: true });

    return res.status(200).json({ success: true });
  }
  res.status(405).json({ message: 'Method not allowed' });
}