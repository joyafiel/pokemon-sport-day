export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { items, realname, linename, nickname, phone } = req.body;
    console.log('items received:', JSON.stringify(items)); // 加這行
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyUFGGOifrFpWvluGnXped-TVaht7DIIl7SXCQduqZgcPuSBOqjEbn_dgU0G2TyeCU/exec';
    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order',
        realname, linename, nickname, phone,
        items: items.map(i => ({
          productName: i.productName,
          qty: i.qty,
          price: i.price
        }))
      })
    });
    return res.status(200).json({ success: true });
  } catch(e) {
    console.error('error:', e);
    return res.status(500).json({ success: false, message: '系統錯誤' });
  }
}