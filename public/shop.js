// shop.js — логика магазина
const shopData = [
  {id:1, title:'Постер "Кот-нейроарт"', price:990, img:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'},
  {id:2, title:'Футболка "AI Cat"', price:1490, img:'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'},
  {id:3, title:'Стикеры "Нейрокотики"', price:390, img:'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'},
  {id:4, title:'Худи "Future Cat"', price:2490, img:'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80'},
];
const shopList = document.getElementById('shop-list');
function renderShop() {
  shopList.innerHTML = '';
  shopData.forEach(item=>{
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `<img src="${item.img}" alt="${item.title}"><div class='shop-title2'>${item.title}</div><div class='shop-price'>${item.price} ₽</div><button class='shop-add'>В корзину</button>`;
    card.querySelector('.shop-add').onclick = ()=>addToCart(item.id);
    shopList.appendChild(card);
  });
}
renderShop();
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const idx = cart.findIndex(x=>x.id===id);
  if(idx>-1) cart[idx].qty++;
  else cart.push({id,qty:1});
  localStorage.setItem('cart',JSON.stringify(cart));
  alert('Товар добавлен в корзину!');
}
