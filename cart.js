let cartItems = document.getElementById('cart-items');
let cartGoods = [];
let cartTotalValue = document.querySelector('.cart-total');


cartPrint();

function cartPrint() {

    if(typeof localStorage.cart !== 'undefined'){
        let cartIn = JSON.parse(localStorage.cart);
        for(let i = 0; i < cartIn.length; i++) {
            cartGoods.push(cartIn[i]);
        }
        let cartTotal = 0;
        for(let i = 0; i < cartIn.length; i++) {
            cartTotal += cartGoods[i].price;
        }
        if(cartIn.length !== 0) {
            let cardTemplate = cartGoods.map(elem => createCartGood(elem));
            let html = cardTemplate.join(' ');
            cartItems.innerHTML = html;
            cartTotalValue.innerHTML = "Total: " + cartTotal + "$";

        } else {
            cartItems.innerHTML = "Ваша корзина пуста";
        }
    } else {
        cartItems.innerHTML = "Ваша корзина пуста";

    }

}

function createCartGood(good) {
    return `<div class="cart-item">
            <img src=${good.img} alt="">
            <div class="cart-item__info">
                <div class="cart-item__tittle">
                    <p>${good.name}</p>
                    <p>${good.desc}</p>
                </div>
                <p class="cart-item__price">${good.price}$</p>
            </div>
        </div> `
}

document.getElementById('clear-cart').addEventListener('click', function () {
    localStorage.clear();
    cartPrint();
    cartCounter = 0;
    cartTotalValue.innerHTML = "";
});