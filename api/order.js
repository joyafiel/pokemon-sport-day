export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { items, realname, linename, nickname, phone } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: '購物車是空的' });
    }

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyUFGGOifrFpWvluGnXped-TVaht7DIIl7SXCQduqZgcPuSBOqjEbn_dgU0G2TyeCU/exec';
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

    const payload = JSON.stringify({
      type: 'order',
      realname, linename, nickname, phone, total,
      items: items.map(i => ({
        productName: i.productName,
        qty: i.qty,
        price: i.price
      }))
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        signal: controller.signal
      });
      console.log('GAS success');
    } catch(fetchErr) {
      console.log('GAS timeout, retrying without signal...');
      // 第二次嘗試，不等回應
      fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      }).catch(() => {});
      // 等一秒讓請求送出
      await new Promise(r => setTimeout(r, 1000));
    } finally {
      clearTimeout(timeout);
    }

    return res.status(200).json({ success: true });

  } catch(e) {
    console.error('order error:', e);
    return res.status(500).json({ success: false, message: '系統錯誤' });
  }
}
