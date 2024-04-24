const fetchData = async () => {
  try {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448"
    );

    const data = await response.json();
    const productData = data.product;
    console.log(productData);
    const price = parseFloat(
      productData.price.replace("$", "").replace(",", "")
    );

    const compareAtPrice = parseFloat(
      productData.compare_at_price.replace("$", "").replace(",", "")
    );
    const percentageOff = ((compareAtPrice - price) / compareAtPrice) * 100;

    document.querySelector(".product_vendor").textContent = productData.vendor;
    document.querySelector(".product_title").textContent = productData.title;
    document.querySelector(".price").textContent = `${productData.price}.00`;
    document.querySelector(
      ".compare_at_price"
    ).textContent = `${productData.compare_at_price}.00`;
    document.querySelector(".product_description").innerHTML =
      productData.description;

    document.querySelector("#product_image").src = productData.images[2].src;

    const percentageOffElement = document.querySelector(".percentage_off");
    if (!isNaN(percentageOff) && percentageOff > 0) {
      percentageOffElement.textContent = `${percentageOff.toFixed(0)}% Off`;
    } else {
      percentageOffElement.textContent = "No discount";
    }
    // Populate thumbnails
    const thumbnailsContainer = document.querySelector(".thumbnails");
    thumbnailsContainer.innerHTML = "";
    productData.images.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = "Thumbnail";
      img.classList.add("thumbnail");
      img.addEventListener("click", () => {
        document.getElementById("product_image").src = image.src;//provided link on apis image is not working
      });
      thumbnailsContainer.appendChild(img);
    });

    // Populate color options
    const colorContainer = document.querySelector(".all_colors");
    colorContainer.innerHTML = "";
    productData.options[0].values.forEach((color, index) => {
      const colorDiv = document.createElement("div");
      const colorName = Object.keys(color)[0];
      colorDiv.style.backgroundColor = color[colorName];
      colorDiv.classList.add("color");
      colorDiv.dataset.color = colorName;

      colorDiv.addEventListener("click", () => {
        handleColorSelection(colorDiv, index);
      });

      colorContainer.appendChild(colorDiv);

      if (index === 0) {
        colorDiv.classList.add("selected");
        colorDiv.style.border = "2px solid black";
      }
    });

    // Populate size options
    const sizeContainer = document.querySelector(".all_size_selector");
    sizeContainer.innerHTML = "";
    productData.options[1].values.forEach((size, index) => {
      const sizeDiv = document.createElement("div");
      sizeDiv.classList.add("size_type_container");

      const input = document.createElement("input");
      const label = document.createElement("label");
      input.type = "radio";
      input.id = size.toLowerCase();
      input.name = "size";
      input.value = size;
      label.htmlFor = size.toLowerCase();
      label.textContent = size;

      sizeDiv.appendChild(input);
      sizeDiv.appendChild(label);

      sizeContainer.appendChild(sizeDiv);

      if (index === 0) {
        input.checked = true;
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Function to handle color selection
const handleColorSelection = (selectedColorDiv, index) => {
  const allColors = document.querySelectorAll(".color");
  allColors.forEach((color) => {
    color.classList.remove("selected");
    color.style.border = "none";
  });
  selectedColorDiv.classList.add("selected");
  const selectedColor = selectedColorDiv.dataset.color;
  selectedColorDiv.style.border = `3px solid ${selectedColor}`;
};

// Function to update add to cart message
const updateAddToCartMessage = () => {
  const selectedColor = document.querySelector(".color.selected");
  const selectedSize = document.querySelector('input[name="size"]:checked');
  const addToCartMessage = document.querySelector(".cart_message");

  if (selectedColor && selectedSize) {
    const color = selectedColor.dataset.color;
    const size = selectedSize.value;
    const addedProductDetails = document.getElementById(
      "added_product_details"
    );

    addedProductDetails.textContent = `Embrace Sideboard with Color ${color}, Size ${size} added to cart`;
    addToCartMessage.style.display = "block";
    addedProductDetails.style.backgroundColor = color;
    addedProductDetails.style.borderRadius = "7px";
  } else {
    addToCartMessage.style.display = "none";
  }
};

// Event listener for the "Add to Cart" button
const addToCartButton = document.querySelector(".add_to_cart_btn");
addToCartButton.addEventListener("click", updateAddToCartMessage);

fetchData();
const decrementValue = () => {
  let quantityElement = document.getElementById("quantity_value");
  let currentValue = parseInt(quantityElement.textContent);
  if (currentValue > 1) {
    quantityElement.textContent = currentValue - 1;
  }
};

const incrementValue = () => {
  let quantityElement = document.getElementById("quantity_value");
  let currentValue = parseInt(quantityElement.textContent);

  quantityElement.textContent = currentValue + 1;
};
