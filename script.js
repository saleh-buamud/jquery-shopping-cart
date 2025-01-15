$(document).ready(function () {
    let cart = {}; // Initialize an empty cart

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            return JSON.parse(savedCart);
        }
        return {};
    }

    // Update the shopping cart display
    function updateCart() {
        const $cart = $("#cart");
        const $total = $("#total");
        const $itemCount = $("#item-count");
        const $discountMessage = $("#discount-message");
        $cart.empty(); // Clear the current cart display

        let total = 0;
        let itemCount = 0;

        if (Object.keys(cart).length === 0) {
            $cart.append('<p class="cart-empty text-center">Your cart is empty.</p>');
            $total.text(0);
            $itemCount.text(0);
            return;
        }

        for (const id in cart) {
            const item = cart[id];
            total += item.price * item.quantity;
            itemCount += item.quantity;

            $cart.append(`
                <div class="list-group-item d-flex justify-content-between align-items-center" data-id="${id}">
                    <span>${item.name} (${item.quantity})</span>
                    <div>
                        <button class="btn btn-sm btn-success increase-qty" data-id="${id}">+</button>
                        <button class="btn btn-sm btn-warning decrease-qty" data-id="${id}">-</button>
                        <button class="btn btn-sm btn-danger remove-item" data-id="${id}">Remove</button>
                    </div>
                    <span>$${item.price * item.quantity}</span>
                </div>
            `);
        }

        if (total > 50) {
            const discount = total * 0.1; // 10% discount
            $discountMessage.text(`You get a 10% discount! Discount: $${discount}`);
            total -= discount;
        } else {
            $discountMessage.text('');
        }

        $total.text(total);
        $itemCount.text(itemCount);
    }

    $(".add-to-cart").click(function () {
        const id = $(this).data("id");
        const name = $(this).data("name");
        const price = $(this).data("price");
        const quantity = parseInt($(`#quantity-${id}`).val(), 10);

        if (cart[id]) {
            cart[id].quantity += quantity;
        } else {
            cart[id] = { name, price, quantity };
        }

        saveCart();
        updateCart();

        Swal.fire({
            title: 'Added to Cart',
            text: `${name} (Quantity: ${quantity}) has been added to your cart.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    });

    $("#cart").on("click", ".increase-qty", function () {
        const id = $(this).data("id");
        cart[id].quantity += 1;
        saveCart();
        updateCart();
    });

    $("#cart").on("click", ".decrease-qty", function () {
        const id = $(this).data("id");
        if (cart[id].quantity > 1) {
            cart[id].quantity -= 1;
        } else {
            delete cart[id];
        }
        saveCart();
        updateCart();
    });

    $("#cart").on("click", ".remove-item", function () {
        const id = $(this).data("id");
        delete cart[id];
        saveCart();
        updateCart();
    });

    $("#search-bar").on("input", function () {
        const searchQuery = $(this).val().toLowerCase();
        $(".product-card").each(function () {
            const productName = $(this).data("name").toLowerCase();
            if (productName.includes(searchQuery)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    $("#checkout-btn").click(function () {
        if (Object.keys(cart).length > 0) {
            window.location.href = '/checkout';
        } else {
            Swal.fire({
                title: 'Cart Empty',
                text: 'Your cart is empty! Add some items before checking out.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    });

    cart = loadCart();
    updateCart();
});
