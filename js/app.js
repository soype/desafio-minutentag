import products from "../products.js";
import stockPrice from "../stock-price.js";

////////////////////////////////////////////////////////
// Mini router for the product single view
////////////////////////////////////////////////////////
// Prevent default and change url while keeping history
const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  event.stopPropagation();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const createRoutes = () => {
  let routes = {
    404: "pages/404.html",
    "/": "index.html",
    "index.html": "index.html",
  };

  for (let i = 0; i < products.length; i++) {
    // Format brand name to avoid spaces
    let brand = products[i].brand.replace(/\s/g, "");
    routes[`/${products[i].id}-${brand}`] = `pages/product-detail.html`;
  }
  return routes;
};

const routes = createRoutes();

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("app").innerHTML = html;
  if (route == "/") {
    listProducts(products);
  }
  if (route != routes[404]) {
    let id = extractId(path);
    renderSingle(id);
  }
};

window.onpopstate = handleLocation;
window.route = route;
if (window.location.pathname !== "/") {
  handleLocation();
}

// Helper functions to provide dynamic content
const extractId = (path) => {
  const start = path.indexOf("/") + 1;
  const end = path.indexOf("-");
  if (start >= 0 && end >= 0) {
    return path.substring(start, end);
  } else {
    return null;
  }
};

const expandText = () => {
  let p = document.querySelector(".desc-info");
  if (p.classList.contains("expanded")) {
    p.classList = "desc-info";
  } else {
    p.classList.add("expanded");
  }
};

//////////////////////////////////////////////////
// Renders a single item in the single item page
//////////////////////////////////////////////////
const renderSingle = (id) => {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      const stockData = stockPrice[products[i].skus[0].code];
      const container = document.getElementById("container");

      // Add image
      const img = document.createElement("img");
      img.classList = "item-img";
      img.src = products[i].image;
      document.getElementById("main-image").appendChild(img);

      // Add description
      // Header with title and price
      const contHeader = document.createElement("div");
      contHeader.classList = "container-header";
      const title = document.createElement("h1");
      title.textContent = products[i].brand;
      const price = document.createElement("div");
      // Set initial price
      price.textContent = `$ ${(stockPrice[products[i].skus[0].code].price / 100).toFixed(2)}`;

      // Bring the elements together
      price.classList = "detail-price";
      contHeader.appendChild(title);
      contHeader.appendChild(price);

      // Origin and stock
      const subData = document.createElement("div");
      subData.classList = "sub-data";
      subData.textContent = `Origin: ${products[i].origin} | Stock: ${stockData.stock}`;

      //Description
      const desc = document.createElement("div");
      desc.classList = "description";
      const descTitle = document.createElement("h3");
      descTitle.textContent = "Description";
      const info = document.createElement("p");
      info.classList = "desc-info";
      info.textContent = products[i].information;
      const readMore = document.createElement("p");
      readMore.classList = "read-more";
      readMore.textContent = "Read more";
      // Bring the elements together
      desc.appendChild(descTitle);
      desc.appendChild(info);
      desc.appendChild(readMore);

      // Size
      const sizeContainer = document.createElement("div");
      sizeContainer.classList = "size-container";
      const sizeTitle = document.createElement("h3");
      sizeTitle.textContent = "Size";
      const sizeOptions = document.createElement("div");
      sizeOptions.classList = "size-options";
      // Iterate the different sizes for each product
      for (let x = 0; x < products[i].skus.length; x++) {
        const option = document.createElement("div");
        option.classList = "option";
        option.id = products[i].skus[x].code;
        if (x === 0) {
          option.classList.add("option-selected");
        }
        option.textContent = products[i].skus[x].name;
        sizeOptions.appendChild(option);
      }

      // Bring the items together
      sizeContainer.appendChild(sizeTitle);
      sizeContainer.appendChild(sizeOptions);

      // Cart container
      const cartContainer = document.createElement("div");
      cartContainer.classList = "cart-container";
      const cartButton = document.createElement("div");
      cartButton.classList = "deatil-cart-button";
      cartButton.textContent = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="6" r="4.25" stroke="#FF9F24" stroke-width="1.5"/><path d="M4.30623 9.59689C4.50953 7.97049 5.89208 6.75 7.53113 6.75H16.4689C18.1079 6.75 19.4905 7.97049 19.6938 9.59689L20.6938 17.5969C20.9362 19.5367 19.4237 21.25 17.4689 21.25H6.53113C4.57626 21.25 3.06375 19.5367 3.30623 17.5969L4.30623 9.59689Z" fill="white" stroke="#FF9F24" stroke-width="1.5"/><circle cx="9.75" cy="10.75" r="0.75" fill="#FF9F24"/><circle cx="13.75" cy="10.75" r="0.75" fill="#FF9F24"/></svg>`;
      const addToCart = document.createElement("button");
      addToCart.classList = "detail-add-button";
      addToCart.textContent = "Add to cart";
      // Bring the items together
      cartContainer.appendChild(cartButton);
      cartContainer.appendChild(addToCart);

      // Add elements to container
      container.appendChild(contHeader);
      container.appendChild(subData);
      container.appendChild(desc);
      container.appendChild(sizeContainer);
      container.appendChild(addToCart);

      /// Logic for selecting size option
      let detailOptions = document.querySelectorAll(".option");

      // Add an event listener to each

      detailOptions.forEach((button) => {
        button.addEventListener("click", () => {
          // Remove background color from all
          detailOptions.forEach((btn) => {
            btn.classList = "option";
          });

          // Set background color for the clicked button
          button.classList.add("option-selected");
          // Set price according to the selected variety
          for (let x = 0; x < products[i].skus.length; x++) {
            let selection = document.querySelectorAll(".option-selected")[0];
            if (selection.id == products[i].skus[x].code) {
              price.textContent = `$ ${(
                stockPrice[products[i].skus[x].code].price / 100
              ).toFixed(2)}`;
            }
          }
        });
      });
    }
  }
};

////////////////////////////////////////////////////////
// Button animations
////////////////////////////////////////////////////////

const categoryButtons = document.querySelectorAll(".category-button");

// Add an event listener to each
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove background color from all
    categoryButtons.forEach((btn) => {
      btn.classList = "category-button";
    });

    // Set background color for the clicked button
    button.classList.add("category-button-selected");
  });
});

const options = document.querySelectorAll(".option");
// Add event listener if they exist:
if (options) {
  options.forEach((option) => {
    option.addEventListener("click", () => {
      //Remove background color from all
      options.forEach((option) => {
        option.classList = "option";
      });

      option.classList.add("option-selected");
    });
  });
}

////////////////////////////////////////////////////////
// List prouducts in index.html
////////////////////////////////////////////////////////

const listProducts = (products) => {
  const container = document.getElementById("products");
  for (let i = 0; i < products.length; i++) {
    // Format brand name to avoid spaces
    let brand = products[i].brand.replace(/\s/g, "");

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
    const span1 = document.createElement("span");
    const span2 = document.createElement("span");
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
    itemPrice.textContent = "$ " + price;

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
if (window.location.pathname == "/") {
  listProducts(products);
}
