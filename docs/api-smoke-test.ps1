# AttireHub API smoke test. Run with the server running:
#   powershell -ExecutionPolicy Bypass -File docs\api-smoke-test.ps1
$base = "http://localhost:5000/api"
$pass = 0; $fail = 0

function Check($name, $ok) {
  if ($ok) { Write-Host "PASS  $name" -ForegroundColor Green; $script:pass++ }
  else { Write-Host "FAIL  $name" -ForegroundColor Red; $script:fail++ }
}
function StatusOf($block) {
  try { & $block | Out-Null; return 200 } catch { return [int]$_.Exception.Response.StatusCode }
}

$health = Invoke-RestMethod "$base/health"
Check "health" ($health.status -eq "ok")

$list = Invoke-RestMethod "$base/products"
Check "products list" ($list.total -gt 0)
# Pick a product that is actually in stock
$prod = $list.products | Where-Object { $_.stock -gt 0 } | Select-Object -First 1
if (-not $prod) { Write-Host "No in-stock product on page 1. Restock one in Admin > Inventory." -ForegroundColor Red; exit 1 }

Check "unknown product id gives 404" ((StatusOf { Invoke-RestMethod "$base/products/abc" }) -eq 404)

# Test user (change if you reset it)
$userBody = '{"email":"test@example.com","password":"password123"}'
$u = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType "application/json" -Body $userBody
$uh = @{ Authorization = "Bearer $($u.token)" }
Check "user login" ($u.role -eq "USER")
Check "user blocked from admin stats" ((StatusOf { Invoke-RestMethod "$base/admin/stats" -Headers $uh }) -eq 403)

# Cart then order, then cancel as admin
$cart = @{ items = @(@{ productId = $prod._id; size = $prod.sizes[0]; color = $prod.colors[0]; quantity = 1 }) } | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Put -Uri "$base/cart" -Headers $uh -ContentType "application/json" -Body $cart | Out-Null
$stockBefore = (Invoke-RestMethod "$base/products/$($prod._id)").stock

$orderBody = @{ paymentMethod = "COD"; shippingAddress = @{ fullName = "Smoke Test"; street = "1 Main St"; city = "Brampton"; state = "ON"; postalCode = "L6Y 1A1"; country = "Canada" } } | ConvertTo-Json -Depth 5
$order = Invoke-RestMethod -Method Post -Uri "$base/orders" -Headers $uh -ContentType "application/json" -Body $orderBody
Check "order created as Pending" ($order.status -eq "Pending")
$stockAfter = (Invoke-RestMethod "$base/products/$($prod._id)").stock
Check "stock reduced by 1" ($stockAfter -eq $stockBefore - 1)
Check "empty cart cannot be ordered" ((StatusOf { Invoke-RestMethod -Method Post -Uri "$base/orders" -Headers $uh -ContentType "application/json" -Body $orderBody }) -eq 400)

# Admin
$pw = Read-Host "Admin password (not saved)"
$adminBody = @{ email = "admin@attirehub.com"; password = $pw } | ConvertTo-Json
$a = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType "application/json" -Body $adminBody
$ah = @{ Authorization = "Bearer $($a.token)" }
Check "admin login" ($a.role -eq "ADMIN")
$stats = Invoke-RestMethod "$base/admin/stats" -Headers $ah
Check "admin stats" ($stats.totalProducts -gt 0)

$cancelled = Invoke-RestMethod -Method Put -Uri "$base/admin/orders/$($order._id)" -Headers $ah -ContentType "application/json" -Body '{"status":"Cancelled"}'
Check "admin cancels order" ($cancelled.status -eq "Cancelled")
$stockRestored = (Invoke-RestMethod "$base/products/$($prod._id)").stock
Check "stock restored after cancel" ($stockRestored -eq $stockBefore)

Write-Host "`n$pass passed, $fail failed"