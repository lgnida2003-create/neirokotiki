// armansofas.js — раздел "Диваны от Армана"
const sofaList = document.getElementById('sofa-list');
const sofas = [
  {id:1, title:'Диван "Арман Люкс"', price:39900, img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80', desc:'Современный стиль, максимальный комфорт.'},
  {id:2, title:'Диван "Арман Мини"', price:25900, img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80', desc:'Компактный и уютный для любого интерьера.'},
  {id:3, title:'Диван "Арман Классик"', price:32900, img:'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80', desc:'Классика в современном исполнении.'}
];
function renderSofas() {
  sofaList.innerHTML = '';
  sofas.forEach(sofa=>{
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `<img src="${sofa.img}" alt="${sofa.title}"><div class='shop-title2'>${sofa.title}</div><div class='shop-price'>${sofa.price} ₽</div><div style='color:#00ffe7;padding:0 12px 10px 12px;'>${sofa.desc}</div><div style='padding:12px;display:flex;justify-content:flex-end;'><button class='shop-add sofa-buy' data-id='${sofa.id}'>Купить</button></div>`;
    sofaList.appendChild(card);
  });
}
renderSofas();

// Добавление диванов в корзину — сохраняем полную информацию в localStorage
function addSofaToCart(id) {
  const sofa = sofas.find(s=>s.id===id);
  if(!sofa) return alert('Товар не найден');
  let cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const idx = cart.findIndex(x=>x.id===id && x.title);
  if(idx > -1) {
    cart[idx].qty++;
  } else {
    cart.push({id: sofa.id, title: sofa.title, price: sofa.price, img: sofa.img, qty:1});
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  // Небольшое уведомление и переход в корзину
  alert('Диван добавлен в корзину');
  window.location.href = '/cart.html';
}

document.addEventListener('click', (e)=>{
  const btn = e.target.closest && e.target.closest('.sofa-buy');
  if(btn) addSofaToCart(Number(btn.dataset.id));
});
