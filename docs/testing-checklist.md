# AttireHub Manual Test Checklist

Tested on: ____ (date)   Browser: Chrome   Screen sizes: 360, 768, 1024, 1440

## Authentication
- [ ] Register with valid details logs me in
- [ ] Register with existing email shows an error
- [ ] Register with short or mismatched password shows an error
- [ ] Login with correct details works
- [ ] Login with wrong password shows "Invalid email or password"
- [ ] Logout clears the session; refresh keeps me logged out
- [ ] Refresh while logged in keeps me logged in
- [ ] /profile, /orders, /checkout redirect to /login when logged out, then return after login
- [ ] Forgot password: link printed in server terminal, reset works once, reused link rejected

## Products
- [ ] Shop lists products with pagination
- [ ] Search "hoodie", "black shirt", "jeans" return sensible results
- [ ] Category, price, size, color, rating filters work, alone and combined
- [ ] All 5 sort options reorder correctly
- [ ] Clear filters resets; Back button and refresh keep filters
- [ ] Product page: gallery, size/color required, quantity limits, stock text
- [ ] Unknown product id shows "Product not found"
- [ ] Review: logged-in user can post once; logged-out sees login link

## Cart and wishlist
- [ ] Add to cart opens drawer; badge updates
- [ ] Same product+size+color increases quantity; other size is a new line
- [ ] Quantity +/- and Remove work; totals correct (one $44.99 item = $57.83)
- [ ] Free shipping appears at $75+
- [ ] Cart survives refresh (guest) and follows me after login (merge)
- [ ] Heart toggles and persists; wishlist page matches

## Checkout and orders
- [ ] Checkout is prefilled from the saved address
- [ ] Missing required field shows an error
- [ ] Placing an order shows confirmation; cart is empty afterwards
- [ ] Order appears in My Orders and Order Details with the correct totals
- [ ] Quantity above stock is rejected with a clear message
- [ ] Another user cannot open my order URL

## Admin
- [ ] Normal user cannot open /admin
- [ ] Dashboard numbers match the database
- [ ] Create product; duplicate SKU rejected; invalid sale price rejected
- [ ] Edit product keeps rating and reviews
- [ ] Delete product asks for confirmation; old orders still display
- [ ] Inventory edit updates the status pill
- [ ] Order status change is visible to the customer
- [ ] Cancelling an order restores stock and locks the order
- [ ] Cannot change my own role

## Errors and resilience
- [ ] Server stopped: shop, product and admin show an error with "Try again"
- [ ] Expired or invalid token sends me to /login
- [ ] Unknown page shows the 404 page
- [ ] Console has no red errors on each main page

## Responsive and accessibility (quick)
- [ ] No horizontal scrolling at 360px
- [ ] Every control reachable with Tab, with a visible outline
- [ ] Forms have labels; images have alt text