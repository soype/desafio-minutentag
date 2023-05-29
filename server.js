const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

const copyStockData = () => {
  try {
    const stockDataText = fs.readFileSync("./stock-price.js", "utf-8");
    const replacedText = stockDataText.replace(
      "export default",
      ""
    );
    //   eval(replacedText); // Execute the replaced text as JavaScript code
    return replacedText;
  } catch (error) {
    console.error("Error copying stock data:", error);
    return null;
  }
};

let stockData = copyStockData();

const getItemBySKU = (sku) => {
  for (let i=0; i < stockData.length; i++) {
    if (stockData[i].sku === sku) {
      return i;
    }
  }
  return false;
};

app.get("/api/stockprice/:code", (req, res) => {
  const code = req.params.code;
  console.log(stockData[0]);
  console.log(stockData);

  const index = getItemBySKU[code];
  console.log(index);
  console.log(stockData[index]);
  item = stockData[index];  
  if (item) {
    let stock = item.stock;
    let price = item.price;
    console.log(stock, price);
    res.json({ stock, price });
  } else {
    res.status(404).json({ error: "SKU not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
