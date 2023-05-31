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
      404: {
        template: "pages/404.html",
        title: "Not found",
        description: "Not found",
      },
      "/": {
        template: "pages/index.html",
        title: "Minutentag",
        description: "Drinks straight to you!",
      },
    };
  
    for (let i = 0; i < products.length; i++) {
      // Format brand name to avoid spaces
      let brand = products[i].brand.replace(/\s/g, "");
      routes[`${products[i].id}-${brand}`] = {template: `pages/product-detail.html`, title: brand, description: ""};
    }
    return routes;
  };
  
  const routes = createRoutes();
  
  const handleLocation = async () => {
    const path = window.location.hash.replace("#", "");
    if(path.length == 0){
      path = "/";
    };
  
    const route = routes[path] || routes[404];
    const html = await fetch(route.template).then((data) => data.text());
    document.getElementById("app").innerHTML = html;
    document.title = route.title;
    document.querySelector("meta");
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
  