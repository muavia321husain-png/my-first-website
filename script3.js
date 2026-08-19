const products = [

    {
        id: 1,
        name: "Vintage Utility Jacket",
        category: "jackets",
        categoryLabel: "Jackets",
        price: 48,
        condition: "Excellent",
        image: "C:/Users/admin/Downloads/jac1.jpg",
        tag: "New Drop",
        soldOut: false
    },

    {
        id: 2,
        name: "Oversized Denim Jacket",
        category: "denim",
        categoryLabel: "Denim",
        price: 42,
        condition: "Very Good",
        image:  "C:/Users/admin/Downloads/jac2.jpg",
        tag: "One of One",
        soldOut: false
    },

    {
        id: 3,
        name: "Retro Corduroy Shirt",
        category: "shirts",
        categoryLabel: "Shirts",
        price: 32,
        condition: "Excellent",
        image:  "C:/Users/admin/Downloads/s2.jpg",
        tag: "Trending",
        soldOut: false
    },

    {
        id: 4,
        name: "Classic Knit Sweater",
        category: "knitwear",
        categoryLabel: "Knitwear",
        price: 36,
        condition: "Good",
        image:  "C:/Users/admin/Downloads/jac3.jpg",
        tag: "Vintage",
        soldOut: false
    },

    {
        id: 5,
        name: "90s Cargo Trousers",
        category: "bottoms",
        categoryLabel: "Bottoms",
        price: 38,
        condition: "Excellent",
        image:  "C:/Users/admin/Downloads/p2.jpg",
        tag: "",
        soldOut: false
    },

    {
        id: 6,
        name: "Vintage Graphic shirt&tie",
        category: "shirts",
        categoryLabel: "Tees",
        price: 26,
        condition: "Very Good",
        image:  "C:/Users/admin/Downloads/s4.jpg",
        tag: "",
        soldOut: false
    },

    {
        id: 7,
        name: "CASUAL Jacket",
        category: "jackets",
        categoryLabel: "Jackets",
        price: 55,
        condition: "Excellent",
        image:  "C:/Users/admin/Downloads/jac4.jpg",
        tag: "Rare Find",
        soldOut: false
    },

    {
        id: 8,
        name: "Classic Oxford Shirt",
        category: "shirts",
        categoryLabel: "Shirts",
        price: 29,
        condition: "Very Good",
        image:  "C:/Users/admin/Downloads/s1.jpg",
        tag: "",
        soldOut: false
    },

    {
        id: 9,
        name: "Vintage Straight Jeans",
        category: "denim",
        categoryLabel: "Denim",
        price: 44,
        condition: "Excellent",
        image:  "C:/Users/admin/Downloads/p1.jpg",
        tag: "90s Fit",
        soldOut: true
    }

];


const productGrid = document.getElementById("productGrid");

const filterButtons = document.querySelectorAll(".filter-btn");


/*CREATE PRODUCT CARD */

function createProductCard(product) {

    const card = document.createElement("article");

    card.className = `product-card ${product.soldOut ? "sold-out" : ""}`;


    /*
        Only show the tag if the product
        actually has one.
    */

    const productTag = product.tag
        ? `<span class="product-tag">${product.tag}</span>`
        : "";


    /*
        Only show SOLD OUT when necessary.
    */

    const soldLabel = product.soldOut
        ? `<span class="sold-label">SOLD OUT</span>`
        : "";


    card.innerHTML = `

        <a href="product.html?id=${product.id}"
           class="product-image">

            ${productTag}

            ${soldLabel}

            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            ${
                !product.soldOut
                    ? `<span class="quick-view">
                        QUICK VIEW →
                       </span>`
                    : ""
            }

        </a>


        <div class="product-info">

            <div class="product-meta">

                <span class="category">
                    ${product.categoryLabel}
                </span>

                <span class="condition">
                    ${product.condition}
                </span>

            </div>


            <div class="product-bottom">

                <h2 class="product-name">
                    ${product.name}
                </h2>

                <span class="product-price">
                    $${product.price}
                </span>

            </div>

        </div>

    `;


    return card;
}


/* RENDER PRODUCTS */

function renderProducts(category = "all") {

    productGrid.innerHTML = "";


    const filteredProducts =
        category === "all"
            ? products
            : products.filter(
                product => product.category === category
            );


    filteredProducts.forEach((product, index) => {

        const card = createProductCard(product);

        /*
            Small staggered animation
            when filtering.
        */

        card.style.animationDelay = `${index * 40}ms`;

        productGrid.appendChild(card);

    });

}


/*  CATEGORY FILTER*/

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category = button.dataset.category;


        /* Remove active state */

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        /* Add active state */

        button.classList.add("active");


        /* Render selected category */

        renderProducts(category);

    });

});


/*  INITIAL RENDER */

renderProducts();