
var addDialog = document.getElementById('add-dialog');
document.querySelector('#show-add').onclick = function() {
    addDialog.showModal();
};
document.querySelector('#close-add').onclick = function() {
    addDialog.close();
};


let goods = [
    {name: "Aloe Vera", desc: "In Mini Dolorez Painter", img: "img/Aloe-Vera5_1.jpg", price: 28, num: 0, count: 3},
    {name: "Aloe Vera", desc: "In Mini Dolorez Painter", img: "img/Aloe-Vera5_3.jpg", price: 30, num: 1, count: 3},
    {name: "Aloe Vera", desc: "In Mini Dolorez Painter", img: "img/Aloe-Vera5_2.jpg", price: 2, num: 2, count: 3},
    {name: "Aloe Vera", desc: "In Mini Dolorez Painter", img: "img/Aloe-Vera5_1.jpg", price: 50, num: 3, count: 0}
];

let cartGoods = [];

let redC = "img/Aloe-Vera5_1.jpg", greenC = "img/Aloe-Vera5_2.jpg", grayC = "img/Aloe-Vera5_3.jpg";

let currentPage = 1, pageNumber = 0, goodsPerPage = 8, pageList = [];
let items = document.getElementById('items');
let cartCounter = 0;
let cartValue = document.querySelector('.cart-value');
cartValue.innerText = cartCounter;
let cartAddedGoods = [];

if(typeof localStorage.cart !== 'undefined') {
    cartCounter = JSON.parse(localStorage.cart).length;
    cartValue.innerText = cartCounter;
    cartAddedGoods = JSON.parse(localStorage.cart)
}

function goodsToLocal() {
    if(typeof localStorage.goodsLocal == 'undefined'){
        localStorage.goodsLocal = JSON.stringify(goods);
    } else {
        goods = JSON.parse(localStorage.goodsLocal);
    }
}

goodsToLocal();

function createGood(good) {
    return `<div class="item">
            <img src=${good.img} alt="">
            <div class="item__info">
                <div class="item_tittle">
                    <p>${good.name}</p>
                    <p>${good.desc}</p>
                </div>
                <p class="price">${good.price}$</p>
            </div>
            <div class="order">
                <div class="colors">
                    <div class="color" data-color="gray"></div>
                   <div class="color" data-color="red"></div>
                   <div class="color" data-color="green"></div>
                </div>
            <button id="addToCart${good.num}" class="buy">Купить</button>
            </div>
            <span class="stock">В наличии</span>
        </div> `
}





function buttonsPrint() {
    pageNumber = goods.length/8;
    let navWidth = pageNumber*40;
    let nav = document.querySelector('.navigation');
    nav.style.width = navWidth+"px";
    for (let i = 0; i < pageNumber; i++) {
        let button = document.createElement('button');
        button.id = "page"+(i+1);
        button.textContent = i+1;
        nav.appendChild(button);
    }
}


function goodsPrint() {
    items.innerHTML = "";
    if(pageList.length !== 0) {
        let cardTemplate = pageList.map(elem => createGood(elem));
        let html = cardTemplate.join(' ');
        items.innerHTML = html;
    } else {
        items.innerHTML = "Список товаров пуст";
    }
   for(let i = 0; i < pageList.length; i++) {
       if(pageList[i].count === 0) {
           let itemStock = document.querySelectorAll('.stock')[i];
           let item = document.querySelectorAll('.item')[i];
           item.querySelector('img').style.opacity = 0.3;
           itemStock.innerHTML = "Нет в наличии";
           itemStock.style.color = "red";
           let buttonStock = document.querySelectorAll('.buy')[i].style.display = "none";

       }
   }

    setColor();
    addToCart();
}

function loadList(value) {
    currentPage = value;
    let begin = (currentPage - 1)*8;
    let end = begin + 8;
    pageList = goods.slice(begin,end);
    goodsPrint();
}

loadList(currentPage);
buttonsPrint();


document.querySelector('.navigation').addEventListener('click', function (e) {
    if(e.target.id.startsWith('page')) {
        loadList(e.target.id.replace('page', ''));
        setColor();
        addToCart();
    }
});


function setColor() {
    let colorsButtons = document.querySelectorAll('.colors');
    let items = document.getElementById('items');
    let imgList = items.querySelectorAll('img');
    for(let i = 0; i < pageList.length; i++) {
        colorsButtons[i].addEventListener('click', function (e) {
            if(e.target.dataset.color === 'gray') {
                let divs = e.currentTarget.getElementsByTagName('div');
                for(let i = 0; i < divs.length; i++) {
                    divs[i].classList.remove('active')
                }
                goods[i].img = grayC;
                imgList[i].src = grayC;
                e.target.classList.add('active');
            }
            if(e.target.dataset.color === 'red') {
                let divs = e.currentTarget.getElementsByTagName('div');
                for(let i = 0; i < divs.length; i++) {
                    divs[i].classList.remove('active')
                }
                goods[i].img = redC;
                imgList[i].src = redC;
                e.target.classList.add('active');
            }
            if(e.target.dataset.color === 'green') {
                let divs = e.currentTarget.getElementsByTagName('div');
                for(let i = 0; i < divs.length; i++) {
                    divs[i].classList.remove('active')
                }
                goods[i].img = greenC;
                imgList[i].src = greenC;
                e.target.classList.add('active');
            }
        });
    }
}

function addNewGood() {
    let newGood = {};
    newGood.name = document.getElementById('addName').value;
    newGood.desc = document.getElementById('addDesc').value;
    newGood.img = document.getElementById('addImage').value;
    newGood.price = document.getElementById('addPrice').value;
    goods.push(newGood);
    localStorage.goodsLocal = JSON.stringify(goods);

    loadList(currentPage);
}

let sortedLTH = false;

function sortByPriceLTH() {
    goods.sort(function (a,b) {
        return a.price - b.price;
    });
    sortedLTH = true;
}

function sortByPriceHTL() {
    goods.sort(function (a,b) {
        return b.price - a.price;
    });

    sortedLTH = false;

}

document.getElementById('sort').addEventListener('click', function () {
    if(!sortedLTH) {
        sortByPriceLTH();
        loadList(currentPage);
    }else {
        sortByPriceHTL();
        loadList(currentPage);
    }
});



function addToCart() {
    let buyButtons = document.querySelectorAll('.buy');
    for(let i = 0; i < pageList.length; i++) {
        buyButtons[i].addEventListener('click', function (e) {
            let goodId = e.target.id.replace('addToCart', '');
            if(goods[goodId].count) {
                cartAddedGoods[cartCounter] = Object.assign({},goods[goodId]);
                cartCounter++;

                localStorage.cart = JSON.stringify(cartAddedGoods);
                cartValue.innerText = cartCounter;
                goods[goodId].count--;
                localStorage.goodsLocal = JSON.stringify(goods);
                if(!goods[goodId].count) {
                    let itemStock = document.querySelectorAll('.stock')[i];
                    let item = document.querySelectorAll('.item')[i];
                    item.querySelector('img').style.opacity = 0.3;
                    itemStock.innerHTML = "Нет в наличии";
                    itemStock.style.color = "red";
                    let buttonStock = document.querySelectorAll('.buy')[i].style.display = "none";
                }
            }
        })
    }

}

function filterByPrice() {
    let filterMin = document.getElementById('filter-min').value;
    let filterMax = document.getElementById('filter-max').value;
    let filterStock = document.getElementById('filter-stock')
    if(filterMax && filterMin){
        pageList = [];
        for(let i = 0; i < goods.length; i++) {
            if(goods[i].price >= (+filterMin) && goods[i].price <= (+filterMax)) {
                pageList.push(goods[i]);
            }
        }
    } else if(filterMax) {
        pageList = [];
        for(let i = 0; i < goods.length; i++) {
            if(goods[i].price <= (+filterMax)) {
                pageList.push(goods[i]);
            }
        }
    } else if(filterMin) {
        pageList = [];
        for(let i = 0; i < goods.length; i++) {
            if(goods[i].price >= (+filterMin)) {
                pageList.push(goods[i]);
            }
        }
    }
    if(filterStock.checked) {
        for(let i = pageList.length-1; i >= 0 ; i--) {
            if(pageList[i].count === 0) {
                pageList.splice(i, 1);
            }
        }
    }

    goodsPrint();
}

document.getElementById('filter-btn').addEventListener('click', function () {
    filterByPrice();
});





document.querySelector('.display').addEventListener('click', function (e) {
    if(e.target.id === "list") {
        items.classList.add('display_list');
    }
    if(e.target.id === "grid") {
        items.classList.remove('display_list');

    }
    });

setColor();

