import products from "../products.js";
import stockPrice from "../stock-price.js";


////////////////////////////////////////////////////////
// Mini router for the product single view
////////////////////////////////////////////////////////
// Prevent default and change url while keeping history
const route = event => {
  event = event || window.event;
  event.preventDefault();
  event.stopPropagation();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
}


const createRoutes = () => {
  let routes = { 404: 'pages/404.html', "/": "index.html"};
  
  for (let i = 0; i < products.length; i++) {
    // Format brand name to avoid spaces
    let brand = products[i].brand.replace(/\s/g, '');
    routes[`/${products[i].id}-${brand}`] = `pages/${products[i].id}-${brand}.html`;
  }
  return routes;
}

const routes = createRoutes();



// Helper function to provide dynamic content
const extractId = (path) => {
  const start = path.indexOf("/") + 1;
  const end = path.indexOf("-");
  if (start >= 0 && end >= 0) {
    return path.substring(start, end);
  } else {
    return null;
  }
};

// Renders a single item in the single item page
const renderSingle = id => {
  console.log(id)
  for(let i = 0; i < products.length; i++){
    if(products[i].id == id){

      // Add image
      const img = document.createElement("img");
      img.src = products[i].image;
      document.getElementById('main-image').appendChild(img);
      
      // Add description

    }
  }
}

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("app").innerHTML = html;
  if (route == "/"){
    listProducts(products);
  }
  if (route != routes[404]) {
    let id = extractId(path); 
    renderSingle(id);
  }
};


window.onpopstate = handleLocation;
window.route = route;





////////////////////////////////////////////////////////
// Category button animation
////////////////////////////////////////////////////////

const categoryButtons = document.querySelectorAll('.category-button');

// Add an event listener to each
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove background color from all
    categoryButtons.forEach(btn => {
      btn.classList = "category-button"
    });

    // Set background color for the clicked button
    button.classList.add("category-button-selected"); 
  });
});


////////////////////////////////////////////////////////
// List prouducts in index.html
////////////////////////////////////////////////////////

const listProducts = (products) => {
  const container = document.getElementById("products");
  for (let i = 0; i < products.length; i++) {

    // Format brand name to avoid spaces
    let brand = products[i].brand.replace(/\s/g, '');


    // Declare elements to be joined later and add attributes
    // Item container
    const div = document.createElement("div");
    div.classList = "item";

    // Image with hiperlink to the specific product
    const imgContainer = document.createElement("div");
    imgContainer.classList = "img-container";
    const img = document.createElement("img");
    img.src = "." + products[i].image;
    img.href = `/${products[i].id}-${brand}`;
    img.onclick = route;
    imgContainer.onclick = route;
    const itemTitle = document.createElement("a");
    itemTitle.classList = "item-title";
    itemTitle.href = `/${products[i].id}-${brand}`;
    itemTitle.textContent = products[i].brand;
    itemTitle.onclick = route;
    
    const itemMenu = document.createElement("div");
    itemMenu.classList = "item-menu";
    const itemPrice = document.createElement("div");
    itemPrice.classList = "item-price";
    const addButton = document.createElement("div");
    addButton.classList = "add-button";
    const span1  = document.createElement("span");
    const span2  = document.createElement("span");
    addButton.appendChild(span1);
    addButton.appendChild(span2);


    // Changing data

    // Look up the price. We will only display the first option in the home page
    // We simulate the functionality of consuming an API here
    const getPrice = async (sku) => {
      try {
        const response = await fetch(
          "http://127.0.0.1:3000/api/stockprice/" + sku
        );
        if (response.ok) {
          const data = await response.json();
          if (data.stock > 0) {
            return data.price;
          } else {
            return "No stock"; // We don't show prices if there is no stock
          }
        } else {
          return "Not found"; // Signals there is an error
        }
      } catch (error) {
        console.log(error);
        return "No stock";
      }
    };
    // This function will work provided there is an API to consume.
    // We would use it like this:
    // itemPrice.textContent = getPrice(products[i].skus[0].code);
    // Format the price
    let price = (stockPrice[products[i].skus[0].code].price / 100).toFixed(2);
    itemPrice.textContent = '$ ' + price;
    

    // Item menu
    itemMenu.appendChild(itemPrice);
    itemMenu.appendChild(addButton);

    // Item image
    imgContainer.appendChild(img);

    // Bringing the item together
    div.appendChild(itemTitle);
    div.appendChild(imgContainer);
    div.appendChild(itemMenu);


    // Insert the item in the list
    container.appendChild(div);
  }
};

// Call the function to render the products
if (window.location.pathname == "/"){
  listProducts(products);
}




