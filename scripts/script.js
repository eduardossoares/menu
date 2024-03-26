const menu = document.querySelector('#menu')
const openCartButton = document.querySelector('#open-cart-btn')
const closeCartButton = document.querySelector('#close-modal-btn')
const modal = document.querySelector('#modal')
const cartTotal = document.querySelector('#cart-total')
const cartItems = document.querySelector('#cart-items')
const checkOut = document.querySelector('#checkout-btn')
const cartCounter = document.querySelector('#cart-count')
let adressInput = document.querySelector('#adress')
const adressWarning = document.querySelector('#adress-warning')

let cart = []
let total = 0

const workingModal = () => {
    openCartButton.addEventListener('click', () => {
        modal.classList.remove('hidden')
        modal.classList.add('flex')

        updateCartModal()
    })

    closeCartButton.addEventListener('click', () => {
        modal.classList.remove('flex')
        modal.classList.add('hidden')
    })

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('flex')
            modal.classList.add('hidden')
        }
    })
}
workingModal()

const addToCart = (name, price) => {

    const hasItem = cart.find(item => item.name === name)

    if (hasItem) {
        hasItem.quantity += 1
        return
    }

    cart.push({
        name,
        price,
        quantity: 1
    })

    updateCartModal()
}

menu.addEventListener('click', (event) => {
    let parentButton = event.target.closest('.add-to-cart-btn')
    if (parentButton) {
        let name = parentButton.getAttribute('data-name')
        let price = parseFloat(parentButton.getAttribute('data-price'))

        addToCart(name, price)

    }
})

const updateCartModal = () => {
    cartItems.innerHTML = ''
    total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add('flex', 'justify-betwwen', 'mb-4', 'flex-col', 'mt-4')

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p class="flex items-center">Quantidade: ${item.quantity} <button class="ml-6 text-xl rounded bg-green-300 text-white w-8">+</button><button class="
                text-xl rounded ml-2 bg-gray-400 text-white w-8">-</button></p>
                <p class="font-medium mt-2">R$${item.price.toFixed(2).replace('.', ',')}</p>
            </div>


            <button class="font-medium remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>

        </div>
        `

        total += item.price * item.quantity

        cartItems.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    cartCounter.innerText = cart.length
}

cartItems.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-from-cart-btn')) {
        const name = event.target.getAttribute('data-name')

        removeCartItem(name)
    }
})

const removeCartItem = (name) => {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity = 0
            updateCartModal()
            return
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}

adressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value

    if (inputValue !== '') {
        adressWarning.classList.add('hidden')
        adressWarning.classList.remove('flex')
        adressInput.classList.remove('border-red-500', 'rounded', 'p-1', 'px-2')
    }
})

checkOut.addEventListener('click', () => {

    const isOpen = checkRestaurantOpen()
    if (!isOpen) {
        Toastify({
            text: "Ops! Estamos Fechados no Momento...",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast()

        return
    }

    if (cart.length === 0) return

    if (adressInput.value === '') {
        adressWarning.classList.remove('hidden')
        adressWarning.classList.add('flex')
        adressInput.classList.add('border-red-500', 'rounded', 'p-1', 'px-2')
        return
    }

    const cartItemsCheck = cart.map((item) => {
        return (
            `(${item.quantity}) ${item.name}, Preço: R$${item.price.toFixed(2).replace('.', ',')} \n`
        )
    }).join('')

    const message = encodeURIComponent(cartItemsCheck)
    const phone = '5551985376531'

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, '_blank')

    cart = []
    adressInput.value = ''
    updateCartModal()

})

const checkRestaurantOpen = () => {
    const data = new Date()
    const hour = data.getHours()
    return hour >= 18 && hour < 23
}

const spanHour = document.querySelector('#hour')
const isOpen = checkRestaurantOpen()

if (isOpen) {
    spanHour.classList.remove('bg-red-500')
    spanHour.classList.add('bg-green-500')
} else {
    spanHour.classList.remove('bg-green-500')
    spanHour.classList.add('bg-red-500')
}
