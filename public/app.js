// app.js — логика для вкладок, галереи, фильтрации, лайтбокса, комментариев, магазина и корзины

// --- Вкладки (табы) ---
const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
const tabContents = Array.from(document.querySelectorAll('.tab-content'));
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
function setTab(tab) {
  tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  tabContents.forEach(cont => cont.classList.toggle('active', cont.dataset.tab === tab));
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.tab === tab));
  // Drawer-корзина только для cart
  const drawer = document.getElementById('drawer');
  if(tab === 'cart') drawer.classList.add('open');
  else drawer.classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  // Сохраняем вкладку в hash для прямых переходов
  if(tab !== 'main') location.hash = tab;
  else location.hash = '';
}
tabBtns.forEach(btn => btn.onclick = () => setTab(btn.dataset.tab));
navLinks.forEach(link => link.onclick = () => setTab(link.dataset.tab));
document.getElementById('main-logo').onclick = () => setTab('main');
window.addEventListener('hashchange', () => {
  const tab = location.hash.replace('#','');
  if(tab && tabContents.some(c=>c.dataset.tab===tab)) setTab(tab);
  else setTab('main');
});

// Открытие по хэшу или главная по умолчанию
if(location.hash) {
  const tab = location.hash.replace('#','');
  if(tab && tabContents.some(c=>c.dataset.tab===tab)) setTab(tab);
  else setTab('main');
} else {
  setTab('main');
}

// --- Галерея ---
const galleryData = [
  {src:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', tag:'Абстракция', desc:'Глубокий сон разума'},
  {src:'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80', tag:'Портрет', desc:'Взгляд в будущее'},
  {src:'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80', tag:'Пейзаж', desc:'Город грёз'},
  {src:'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80', tag:'Город', desc:'Нейро-метрополис'},
  {src:'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80', tag:'Пейзаж', desc:'Сумерки разума'},
  {src:'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80', tag:'Портрет', desc:'AI-муза'},
  {src:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', tag:'Абстракция', desc:'Поток сознания'},
  {src:'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80', tag:'Город', desc:'Световой код'},
];
const galleryTags = [...new Set(galleryData.map(x=>x.tag))];
const galleryList = document.getElementById('gallery-list');
const galleryFilter = document.getElementById('gallery-filter');
let galleryFilterTag = 'Все';
function renderGallery() {
  galleryList.innerHTML = '';
  galleryData.filter(x=>galleryFilterTag==='Все'||x.tag===galleryFilterTag).forEach((img,i)=>{
    const card = document.createElement('div');
    card.className = 'art-card';
    card.style.animation = `fadeInUp .5s ${i*0.07}s both`;
    card.innerHTML = `<img src="${img.src}" alt="art"><div class='art-desc'>${img.desc}</div>`;
    card.onclick = ()=>openLightbox(img.src,img.desc);
    galleryList.appendChild(card);
  });
}
function renderGalleryFilter() {
  galleryFilter.innerHTML = '';
  ['Все',...galleryTags].forEach(tag=>{
    const btn = document.createElement('button');
    btn.textContent = tag;
    btn.className = galleryFilterTag===tag?'active':'';
    btn.onclick = ()=>{galleryFilterTag=tag;renderGalleryFilter();renderGallery();};
    galleryFilter.appendChild(btn);
  });
}
function openLightbox(src,desc) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('active');
  document.getElementById('lightbox-img').alt = desc||'';
}
document.getElementById('lightbox-close').onclick = ()=>{
  document.getElementById('lightbox').classList.remove('active');
};
renderGalleryFilter();
renderGallery();

// --- Комментарии (localStorage) ---
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');
function getComments() {
  return JSON.parse(localStorage.getItem('comments')||'[]');
}
function saveComments(arr) {
  localStorage.setItem('comments',JSON.stringify(arr));
}
function renderComments() {
  commentsList.innerHTML = '';
  getComments().forEach(c=>{
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `<span class='comment-nick'>${c.nick}</span><span class='comment-text'>${c.text}</span><span class='comment-time'>${c.time}</span>`;
    commentsList.appendChild(div);
  });
}
commentForm.onsubmit = e => {
  e.preventDefault();
  const nick = document.getElementById('comment-nick').value.trim()||'Гость';
  const text = document.getElementById('comment-text').value.trim();
  if(!text) return;
  const arr = getComments();
  arr.push({nick,text,time:new Date().toLocaleString()});
  saveComments(arr);
  renderComments();
  commentForm.reset();
};
renderComments();

// --- Магазин и корзина ---
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

// --- Корзина (Drawer/Cart tab) ---
const drawer = document.getElementById('drawer');
const drawerList = document.getElementById('drawer-list');
const drawerTotal = document.getElementById('drawer-total');
let cart = JSON.parse(localStorage.getItem('cart')||'[]');
function saveCart() { localStorage.setItem('cart',JSON.stringify(cart)); }
function addToCart(id) {
  const idx = cart.findIndex(x=>x.id===id);
  if(idx>-1) cart[idx].qty++;
  else cart.push({id,qty:1});
  saveCart();
  renderCart();
  setTab('cart');
}
function removeFromCart(id) {
  cart = cart.filter(x=>x.id!==id);
  saveCart();
  renderCart();
}
function renderCart() {
  drawerList.innerHTML = '';
  let total = 0;
  cart.forEach(item=>{
    const prod = shopData.find(x=>x.id===item.id);
    if(!prod) return;
    total += prod.price*item.qty;
    const div = document.createElement('div');
    div.className = 'drawer-item';
    div.innerHTML = `<span>${prod.title} ×${item.qty}</span><span>${prod.price*item.qty} ₽ <button onclick='removeFromCart(${item.id})' style='background:none;border:none;color:#00ffe7;font-size:1.2em;cursor:pointer;'>×</button></span>`;
    drawerList.appendChild(div);
  });
  drawerTotal.textContent = 'Итого: ' + total + ' ₽';
}
document.getElementById('drawer-close').onclick = ()=>setTab('main');
document.getElementById('drawer-order').onclick = ()=>{
  if(!cart.length) return alert('Корзина пуста!');
  alert('Спасибо за заказ!');
  cart = [];
  saveCart();
  renderCart();
  setTab('main');
};
renderCart();
window.removeFromCart = removeFromCart; // для onclick
