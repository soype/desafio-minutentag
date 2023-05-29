import products from "./products.js";
import stockPrice from "./stock-price.js";

console.log(products[0].skus[0].code);

const listProduct = (products) => {
  const container = document.getElementById("products");
  for (let i = 0; i < products.length; i++) {
    // Declare elements to be joined later and add attributes
    const div = document.createElement("div");
    div.classList = "item";
    const img = document.createElement("img");
    img.src = "." + products[i].image;
    const itemTitle = document.createElement("div");
    itemTitle.classList = "item-title";
    itemTitle.textContent = products[i];
    const imgContainer = document.createElement("div");
    imgContainer.classList = "img-container";
    const itemMenu = document.createElement("div");
    itemMenu.classList = "item-menu";
    const itemPrice = document.createElement("div");
    itemPrice.classList = "item-price";
    // Look up the price. We will only display the first option in the home page
    // We simulate the functionality of consuming an API here
    const getPrice = async (sku) => {
        try {
          const response = await fetch("http://127.0.0.1:3000/api/stockprice/" + sku);
          if (response.ok) {
            const data = await response.json();
            if (data.stock > 0) {
              return data.price;
            } else {
              return 'No stock'; // We don't show prices if there is no stock
            }
          } else {
            return 'Not found'; // Signals there is an error
          }
        } catch (error) {
          console.log(error);
          return 'No stock';
        }
      };
    // This function will work provided there is an API to consume.
    // We would use it like this:
    itemPrice.textContent = getPrice(products[i].skus[0].code);


    // itemPrice.textContent = products[i].skus.price

    // Item menu

    // Item image
    imgContainer.appendChild(img);

    // Bringing the item together
    div.appendChild(itemTitle);
    div.appendChild(imgContainer);

    for (let x = 0; x < products[i].skus.length; x++) {
      div.textContent = products[i].skus[x].name;
      container.appendChild(div);
      div.appendChild(img);
    }
  }
};

listProduct(products);
