const menuItems = [
    { name: "Burger", price: 9.99, imageLink: "https://via.placeholder.com/150?text=Burger" },
    { name: "Pizza", price: 12.50, imageLink: "https://via.placeholder.com/150?text=Pizza" },
    { name: "Salad", price: 8.75, imageLink: "https://via.placeholder.com/150?text=Salad" },
    { name: "Pasta", price: 11.25, imageLink: "https://via.placeholder.com/150?text=Pasta" },
    { name: "Fries", price: 5.00, imageLink: "https://via.placeholder.com/150?text=Fries" },
    { name: "Soda", price: 2.50, imageLink: "https://via.placeholder.com/150?text=Soda" }
];

const menuDiv = document.getElementById("menu");
const orderList = document.getElementById("order-list");
const totalPriceDisplay = document.getElementById("total-price");
const cameraView = document.getElementById('cameraView');
const checkoutButton = document.getElementById('checkout-button');
const menuPage = document.getElementById('menu-page');
const checkoutPage = document.getElementById('checkout-page');
const checkoutOrderList = document.getElementById('checkout-order-list');
const checkoutTotalPrice = document.getElementById('checkout-total-price');
const backButton = document.getElementById('back-button');
const confirmationPage = document.getElementById('confirmation-page');

let order = [];
let totalPrice = 0;

menuItems.forEach(item => {
    const menuItemDiv = document.createElement("div");
    menuItemDiv.classList.add("menu-item");

    const itemNameButton = document.createElement("button");
    itemNameButton.classList.add("item-name-button");
    itemNameButton.textContent = `${item.name} ($${item.price.toFixed(2)})`;

    itemNameButton.addEventListener("click", async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraView.srcObject = stream;
            cameraView.style.display = 'block';
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Could not access camera: please enable camera settings');
        }
    });

    const quantityControls = document.createElement("div");
    quantityControls.classList.add("quantity-controls");

    const minusButton = document.createElement("button");
    minusButton.textContent = "-";
    minusButton.classList.add("quantity-button");

    const plusButton = document.createElement("button");
    plusButton.textContent = "+";
    plusButton.classList.add("quantity-button");

    plusButton.addEventListener("click", () => {
        order.push(item);
        totalPrice += item.price;
        updateOrderDisplay();
    });

    minusButton.addEventListener("click", () => {
        const index = order.lastIndexOf(item);
        if (index > -1) {
            order.splice(index, 1);
            totalPrice -= item.price;
            updateOrderDisplay();
        }
    });

    quantityControls.appendChild(minusButton);
    quantityControls.appendChild(plusButton);

    menuItemDiv.appendChild(itemNameButton);
    menuItemDiv.appendChild(quantityControls);
    menuDiv.appendChild(menuItemDiv);
});

function updateOrderDisplay() {
    orderList.innerHTML = "";
    const itemCounts = {};

    order.forEach(item => {
        if (itemCounts[item.name]) {
            itemCounts[item.name]++;
        } else {
            itemCounts[item.name] = 1;
        }
    });

    for (const itemName in itemCounts) {
        const item = menuItems.find(menuItem => menuItem.name === itemName);
        const count = itemCounts[itemName];

        const listItem = document.createElement("li");
        const itemText = document.createElement("span");
        itemText.textContent = `${item.name} x${count} - $${(item.price * count).toFixed(2)}`;
        listItem.appendChild(itemText);

        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => {
            for(let i = 0; i < count; i++){
                const index = order.findIndex(orderItem => orderItem.name === item.name);
                if (index !== -1) {
                    order.splice(index, 1);
                    totalPrice -= item.price;
                }
            }
            updateOrderDisplay();
        });

        listItem.appendChild(removeButton);
        orderList.appendChild(listItem);
    }
    totalPriceDisplay.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

checkoutButton.addEventListener('click', () => {
    menuPage.style.display = 'none';
    checkoutPage.style.display = 'block';
    updateCheckoutDisplay();
});

function updateCheckoutDisplay() {
    checkoutOrderList.innerHTML = "";
    const itemCounts = {};

    order.forEach(item => {
        if (itemCounts[item.name]) {
            itemCounts[item.name]++;
        } else {
            itemCounts[item.name] = 1;
        }
    });

    let checkoutTotal = 0;

    for (const itemName in itemCounts) {
        const item = menuItems.find(menuItem => menuItem.name === itemName);
        const count = itemCounts[itemName];

        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} x${count} - $${(item.price * count).toFixed(2)}`;

        const buttonsDiv = document.createElement("div");

        const minusButton = document.createElement("button");
        minusButton.textContent = "-";
        minusButton.classList.add("quantity-button");
        minusButton.addEventListener("click", () => {
          const index = order.lastIndexOf(item);
          if (index > -1) {
            order.splice(index, 1);
            updateCheckoutDisplay();
          }
        });
        buttonsDiv.appendChild(minusButton);

        const plusButton = document.createElement("button");
        plusButton.textContent = "+";
        plusButton.classList.add("quantity-button");
        plusButton.addEventListener("click", () => {
            order.push(item);
            updateCheckoutDisplay();
        });
        buttonsDiv.appendChild(plusButton);

        listItem.appendChild(buttonsDiv);
        checkoutOrderList.appendChild(listItem);
        checkoutTotal += item.price * count;
    }
    checkoutTotalPrice.textContent = `Total: $${checkoutTotal.toFixed(2)}`;
}

document.getElementById('checkout-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const table = document.getElementById('table').value;

    document.getElementById('confirmation-name').textContent = `Dear ${name},`;

    const confirmationOrderList = document.getElementById('confirmation-order-list');
    confirmationOrderList.innerHTML = '';

    let confirmationTotal = 0;
    const itemCounts = {};

    order.forEach(item => {
        if (itemCounts[item.name]) {
            itemCounts[item.name]++;
        } else {
            itemCounts[item.name] = 1;
        }
    });

    for (const itemName in itemCounts) {
        const item = menuItems.find(menuItem => menuItem.name === itemName);
        const count = itemCounts[itemName];
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>${item.name} x${count}</span><span>$${(item.price * count).toFixed(2)}</span>`;
        confirmationOrderList.appendChild(listItem);
        confirmationTotal += item.price * count;
    }

    document.getElementById('confirmation-total-price').textContent = `Total: $${confirmationTotal.toFixed(2)}`;

    checkoutPage.style.display = 'none';
    confirmationPage.style.display = 'flex';
});

const backToMenuButton = document.getElementById('back-to-menu-button');

backToMenuButton.addEventListener('click', () => {
    confirmationPage.style.display = 'none';
    menuPage.style.display = 'block';
    // Reset the order if you want to clear the cart on returning
    order = [];
    totalPrice = 0;
    updateOrderDisplay(); // Update the order display to reflect the cleared cart
});
