///////////////VARIABLES GLOBALES/////////////////////////////

//Añadir todos los elementos con la clase addToCart (boton añadir al carrito)
const addToShoppingCartButtons = document.querySelectorAll('.addToCart');
// console.log(addToShoppingCartButtons = document.querySelectorAll('.addToCart');
// );

//por cada addToCartButton, añado un evento click de  addEventListener
addToShoppingCartButtons.forEach((addToCartButton) => {
  addToCartButton.addEventListener('click', addToCartClicked);
});
// guardamos en variable y guardamos el callback 
const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', comprarButtonClicked);

//variable global para introducir los items al carrito
const shoppingCartItemsContainer = document.querySelector(
  '.shoppingCartItemsContainer'
);

///////////////////////////////////FUNCIONES/////////////////////////////////////

// funcion para añadir al hacer click en Añadir al carrito
function addToCartClicked(event) {
  //capturo el target del event en una variable
  const button = event.target;
  const item = button.closest('.item');
//capturo el resto de elementos
  const itemTitle = item.querySelector('.item-title').textContent;
  const itemPrice = item.querySelector('.item-price').textContent;
// const itemImage = item.querySelector('.item-image').src;
// recojo los items anteriores y los introduzco como parametros
  addItemToShoppingCart(itemTitle, itemPrice); //falta itemImage por el tamaño
}

///////////////////////////////////////////////////////////////
//funcion para añadir el item de manera unica (sin repetir los iguales) y sus caracteristicas al carrito
function addItemToShoppingCart(itemTitle, itemPrice, itemImage) {
  const elementsTitle = shoppingCartItemsContainer.getElementsByClassName(
    'shoppingCartItemTitle'
  );
// comprobamos si el elemento es igual a la iteracion
  for (let i = 0; i < elementsTitle.length; i++) {
    if (elementsTitle[i].innerText === itemTitle) {
      //guardamos el valor del elemento
      let elementQuantity = elementsTitle[i].parentElement.parentElement.parentElement.querySelector(
        '.shoppingCartItemQuantity'
      );
      //sumamos el valor del elemento cuando son iguales
      elementQuantity.value++;
      //actualizamos el carrito
      updateShoppingCartTotal();
      //cuando terminamos, retornamos, para que se sume la cantidad del elemento 
      // con el mismo titulo
      return;
    }
  }

// Cada vez que añadimos un elemento unico (no repetido), creamos un div con sus datos
  const shoppingCartRow = document.createElement('div');
  //metemos con template  literal ` todo el item
  const shoppingCartContent = `
  <div class="row shoppingCartItem">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
               
            <img src=${itemImage} class="shopping-cart-image">
                <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
            </div>
        </div>
        <div class="col-4">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                    value="1">
                <button class="btn btn-danger buttonDelete" type="button">X</button>
            </div>
        </div>
    </div>`;

// metemos el elemento con inner e igualamos a la variable del contenido del carrito
// lo introducimos con append
  shoppingCartRow.innerHTML = shoppingCartContent;
  shoppingCartItemsContainer.append(shoppingCartRow);

/// eliminamos el item al utilizar el boton X
  shoppingCartRow
    .querySelector('.buttonDelete')
    .addEventListener('click', removeShoppingCartItem);

// añadimos o restamos elementos del mismo item
  shoppingCartRow
    .querySelector('.shoppingCartItemQuantity')
    .addEventListener('change', quantityChanged);
//actualizamos el carrito
  updateShoppingCartTotal();
}

/////////////////////////////////////////////////////////////////////////////////
//funcion para actualizar el carrito 

function updateShoppingCartTotal() {
  let total = 0;
  //seleccionamos el total completo
  const shoppingCartTotal = document.querySelector('.shoppingCartTotal');
 // seleccionamos los elementos
  const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');
 // con for each, por cada item obtenemos su precio y lo guardamos.
  shoppingCartItems.forEach((shoppingCartItem) => {
    const shoppingCartItemPriceElement = shoppingCartItem.querySelector(
      '.shoppingCartItemPrice'
    );
    //para conseguir unicamente el precio y poder operar retiramos €
    // con replace y convertimos a string vacio. lo hacemos number
    const shoppingCartItemPrice = Number(
      shoppingCartItemPriceElement.textContent.replace('€', '')
    );
    //repetimos el proceso para obtener el valor  
    const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(
      '.shoppingCartItemQuantity'
    );
    // volvermos a parsear a number
    const shoppingCartItemQuantity = Number(
      shoppingCartItemQuantityElement.value
    );
    //operamos con el total y sera igual al total + la suma del item por la cantidad de unidades.
    total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
  });
    // pintamos el total, indicamos que queremos máximo 2 decimales + el € que habiamos borrado
  shoppingCartTotal.innerHTML = `${total.toFixed(2)}€`;
}
///////////////////////////////////////////////////////////////////////////////////////////////

//funcion para retirar productos
//obtenemos el target del boton X 
function removeShoppingCartItem(event) {
  const buttonClicked = event.target;
  //captura el elemento mas cercano y lo elimina
  buttonClicked.closest('.shoppingCartItem').remove();
  //actualiza el carrito
  updateShoppingCartTotal();
}
///////////////////////////////////////////////////////////////////////////////////////////////

// funcion para las cantidades de articulos
//recogemos un evento en el parametro
function quantityChanged(event) {
  //lo introducimos en una variable
  const input = event.target;
  //ternario para que la cantidad no pueda bajar de 0
  input.value <= 0 ? (input.value = 1) : null;
  //actualiza el precio
  updateShoppingCartTotal();
}
/////////////////////////////////////////////////////////////////////////////////////////////////

//funcion del boton comprar
// implementamos la funcion y hacemos que el interior del container se vacie al comprar
function comprarButtonClicked() {
  shoppingCartItemsContainer.innerHTML = '';
  //actualizamos el carrito 
  updateShoppingCartTotal();
}