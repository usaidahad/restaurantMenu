'use strict';


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
        listItem.textContent = `${item.name} x${count} - $${(item.price * count).toFixed(2)}`;
        orderList.appendChild(listItem);
    }
    totalPriceDisplay.textContent = `Total: $${totalPrice.toFixed(2)}`;
}