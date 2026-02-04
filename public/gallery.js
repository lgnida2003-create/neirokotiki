// gallery.js — логика галереи
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
