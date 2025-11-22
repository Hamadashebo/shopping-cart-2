// عناصر السلة والمنتجات
let iqoncart = document.querySelector('.cart');
let carttap = document.querySelector('.carttab');
let closecarttap = document.querySelector('.close');
let mainContent = document.querySelector('.main-content');
let listproduct = document.querySelector('.productlist');
let cartlist = document.querySelector('.cartlist');

// مصفوفات البيانات
let listproductarr = [];

let currentUser = localStorage.getItem('currentUser');

// لو مفيش مستخدم مسجل، رجعه لصفحة login
if (!currentUser) {
  window.location.href = 'login.html';
}

// استخدم مفتاح خاص بالمستخدم
let cartKey = `cart_${currentUser}`;
let cartarr = JSON.parse(localStorage.getItem(cartKey)) || [];

// ✅ تنظيف السلة القديمة لو موجودة (اختياري)
localStorage.removeItem('product');

// فتح السلة
iqoncart.addEventListener('click', function () {
  carttap.classList.add('open');
  mainContent.style.flex = '0 0 calc(100% - 400px)';
});

closecarttap.addEventListener('click', function () {
  carttap.classList.remove('open');
  mainContent.style.flex = '1';
});


// ✅ 1. تحميل المنتجات من JSON
const getData = () => {
  fetch('https://fakestoreapi.com/products')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      listproductarr = data;
      addDataToList(data);
    })
    .catch(error => {
      console.error(error);
    });
};
getData();

// ✅ 2. عرض المنتجات في الصفحة
const addDataToList = (dataArray) => {
  listproduct.innerHTML = '';

  dataArray.forEach((product) => {
    let newProduct = document.createElement('div');
    newProduct.classList.add('items');
    newProduct.dataset.id = product.id;

    newProduct.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h2>${product.title}</h2>
      <div class="price">$${product.price}</div>
      <button class="add">Add to cart</button>
    `;

    listproduct.appendChild(newProduct);
  });
};

// ✅ 3. التعامل مع أزرار السلة
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('add')) {
    let productId = event.target.parentElement.dataset.id;
    add(productId);
  }

  if (event.target.classList.contains('plus')) {
    let index = Array.from(cartlist.children).indexOf(event.target.closest('.cartitems'));
    increaseQuantity(index);
  }

  if (event.target.classList.contains('minus')) {
    let index = Array.from(cartlist.children).indexOf(event.target.closest('.cartitems'));
    decreaseQuantity(index);
  }
});

function increaseQuantity(index) {
  if (cartarr[index]) {
    cartarr[index].quantity += 1;
    localStorage.setItem(cartKey, JSON.stringify(cartarr));
    updateitemCount();
    addtocarttap();
  }
}

function decreaseQuantity(index) {
  if (cartarr[index]) {
    if (cartarr[index].quantity > 1) {
      cartarr[index].quantity -= 1;
    } else {
      cartarr.splice(index, 1);
    }
    localStorage.setItem(cartKey, JSON.stringify(cartarr));
    updateitemCount();
    addtocarttap();
  }
}

// ✅ 4. إضافة منتج إلى السلة
function add(productId) {
  let existingItem = cartarr.find(item => item.productId == productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    let product = listproductarr.find(p => p.id == productId);
    if (product) {
      let cartsitem = {
        productId: product.id,
        name: product.title,
        price: product.price,
        img: product.image,
        quantity: 1
      };
      cartarr.push(cartsitem);
    }
  }

  localStorage.setItem(cartKey, JSON.stringify(cartarr));
  updateitemCount();
  addtocarttap();
}

// ✅ 5. عرض السلة
function addtocarttap() {
  cartlist.innerHTML = '';

  if (cartarr.length > 0) {
    cartarr.forEach(item => {
      let newitemincart = document.createElement('div');
      newitemincart.classList.add('cartitems');

      newitemincart.innerHTML = `
        <div class="img">
          <img src="${item.img}"  />
        </div>
        <div class="name">${item.name}</div>
        <div class="totalprice">$${item.price * item.quantity}</div>
        <div class="quntity">
          <span class="minus">-</span>
          <span>${item.quantity}</span>
          <span class="plus">+</span>
        </div>
      `;

      cartlist.appendChild(newitemincart);
    });
  } else {
    cartlist.innerHTML = '<h2 style="color: white; text-align:center;">Cart empty</h2>';
  }
}

// ✅ 6. عداد عدد المنتجات في السلة
function updateitemCount() {
  const countSpan = document.querySelector('.numsofcartitem');
  const total = cartarr.reduce((acc, item) => acc + item.quantity, 0);
  countSpan.textContent = total;
}

// ✅ زر تسجيل الخروج
let logout = document.querySelector('.logout');
logout.addEventListener('click', function () {
  localStorage.removeItem('currentUser');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1300);
});

// تحميل مبدئي
updateitemCount();
addtocarttap();
