const categoryList = document.querySelector('.categories');
const productList = document.querySelector('.products');
const modal = document.querySelector('.modal-wrapper');
const openBtn = document.querySelector('#open-btn');
const closeBtn = document.querySelector('#close-btn');
const modalList = document.querySelector('.modal-list');
const modalInfo = document.querySelector('#modal-info');
const loadBtn = document.querySelector('.btn');
const productWrapperEl = document.querySelector('.product-wrapper');
const loginBtnEl=document.querySelector(".loginBtn");
const loginContainerEl=document.querySelector(".login");
const closeLoginBtnEl=document.querySelector(".close-login");
const mainEl=document.querySelector("main");


document.addEventListener('DOMContentLoaded', () => {
  fetchProduct(startIndex, productCount)
    .then((initialProducts) => {
      renderProducts(initialProducts);
      startIndex += productCount;
    });
  fetchCategories();
});

loadBtn.addEventListener('click', () => {
  fetchProduct(startIndex, productCount)
    .then((newProducts) => {
      renderProducts(newProducts);
      startIndex += productCount;
    });
});

function fetchCategories() {
  fetch('https://api.escuelajs.co/api/v1/categories')
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 4).forEach((category) => {
        const { image, name } = category;
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.innerHTML = `
          <img src="${image}" />
          <span>${name}</span>
        `;
        categoryList.appendChild(categoryDiv);
      })
    );
}

function fetchProduct(startIndex, count) {
  return fetch('https://api.escuelajs.co/api/v1/products')
    .then((res) => res.json())
    .then((data) => data.slice(startIndex, startIndex + count));
}

let startIndex = 0;
const productCount = 10;

function renderProducts(products) {
  products.forEach((item) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <img src="${item.images[0]}" />
      <p>${item.title}</p>
      <p>${item.category.name}</p>
      <div class="product-action">
        <p>${item.price} $</p>
        <button onclick="addToBasket({id:${item.id},title:'${item.title}',price:${item.price},img:'${item.images[0]}', amount:1})">Sepete Ekle</button>
      </div>
    `;
    productList.appendChild(productDiv);
  });
}

let basket = [];
let total = 0;

function addToBasket(product) {
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);

  if (foundItem) {
    foundItem.amount++;
  } else {
    basket.push(product);
  }
}

openBtn.addEventListener('click', () => {
  modal.classList.add('active');
  addList();
  modalInfo.innerText = total;
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  modalList.innerHTML = '';
  total = 0;
});

function addList() {
  basket.forEach((product) => {
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.innerHTML = `
      <img src="${product.img}" />
      <h2>${product.title}</h2>
      <h2 class="price">${product.price}  $</h2>
      <p>Miktar: ${product.amount}</p>
      <button id="del" onclick="deleteItem({id:${product.id},price:${product.price} ,amount: ${product.amount}})">Sil</button>
    `;
    modalList.appendChild(listItem);

    total += product.price * product.amount;
  });
}

function deleteItem(deletingItem) {
  basket = basket.filter((i) => i.id !== deletingItem.id);
  total -= deletingItem.price * deletingItem.amount;
  modalInfo.innerText = total;
}

modalList.addEventListener('click', (e) => {
  if (e.target.id === 'del') {
    e.target.parentElement.remove();
  }
});

modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-wrapper')) {
    modal.classList.remove('active');
    modalList.innerHTML = '';
  }
});

loadBtn.addEventListener('click', () => {
  fetchProduct(startIndex, productCount)
    .then((data) => {
      const newProducts = data.slice(10, 20);
      renderProducts(newProducts);
    });
});
loginBtnEl.addEventListener("click",()=>{
loginContainerEl.classList.add("activelogin");
mainEl.style.opacity=0.5;

});
closeLoginBtnEl.addEventListener("click",()=>{
    loginContainerEl.classList.remove("activelogin");
    mainEl.style.opacity=1;
});