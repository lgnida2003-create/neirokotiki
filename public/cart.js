// cart.js — логика корзины
const drawerList = document.getElementById('drawer-list');
const drawerTotal = document.getElementById('drawer-total');
let cart = JSON.parse(localStorage.getItem('cart')||'[]');
const shopData = [
  {id:1, title:'Постер "Кот-нейроарт"', price:990, img:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'},
  {id:2, title:'Футболка "AI Cat"', price:1490, img:'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'},
  {id:3, title:'Стикеры "Нейрокотики"', price:390, img:'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'},
  {id:4, title:'Худи "Future Cat"', price:2490, img:'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80'},
];
function renderCart() {
  drawerList.innerHTML = '';
  let total = 0;
  cart.forEach(item=>{
    // Поддержка двух формата записей в cart:
    // 1) {id, qty} — товар найден в shopData
    // 2) {id, title, price, img, qty} — полная информация (например, диваны)
    let title, price;
    if(item.title) {
      title = item.title;
      price = item.price;
    } else {
      const prod = shopData.find(x=>x.id===item.id);
      if(!prod) return;
      title = prod.title;
      price = prod.price;
    }
    total += price * item.qty;
    const div = document.createElement('div');
    div.className = 'drawer-item';
    div.innerHTML = `<span>${title} ×${item.qty}</span><span>${price*item.qty} ₽ <button onclick='removeFromCart(${item.id})' style='background:none;border:none;color:#00ffe7;font-size:1.2em;cursor:pointer;'>×</button></span>`;
    drawerList.appendChild(div);
  });
  drawerTotal.textContent = 'Итого: ' + total + ' ₽';
}
function removeFromCart(id) {
  cart = cart.filter(x=>x.id!==id);
  localStorage.setItem('cart',JSON.stringify(cart));
  renderCart();
}
window.removeFromCart = removeFromCart;
document.getElementById('drawer-order').onclick = ()=>{
  if(!cart.length) return alert('Корзина пуста!');
  alert('Спасибо за заказ!');
  cart = [];
  localStorage.setItem('cart',JSON.stringify(cart));
  renderCart();
};
renderCart();
