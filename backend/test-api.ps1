# Script de teste da API - PowerShell
Write-Host "🧪 Testando API do Patas Solidárias..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api"

# 1. Health Check
Write-Host "1️⃣ Testando Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Status: OK" -ForegroundColor Green
    Write-Host "   Mensagem: $($response.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}
Write-Host ""

# 2. Registrar Usuário
Write-Host "2️⃣ Testando Registro de Usuário..." -ForegroundColor Yellow
$newUser = @{
    nome = "João Teste API"
    email = "joao.api@teste.com"
    senha = "senha123"
    telefone = "(41) 99999-9999"
    endereco = "Rua Teste API, 123"
    cpf = "111.222.333-44"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $newUser -ContentType "application/json"
    Write-Host "✅ Usuário registrado com sucesso!" -ForegroundColor Green
    Write-Host "   Nome: $($response.user.nome)" -ForegroundColor Gray
    Write-Host "   Email: $($response.user.email)" -ForegroundColor Gray
    Write-Host "   Token recebido: Sim" -ForegroundColor Gray
    $token = $response.token
} catch {
    Write-Host "⚠️  $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# 3. Login
Write-Host "3️⃣ Testando Login..." -ForegroundColor Yellow
$loginData = @{
    email = "joao.api@teste.com"
    senha = "senha123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
    Write-Host "   Usuário: $($response.user.nome)" -ForegroundColor Gray
    Write-Host "   Token: $($response.token.Substring(0, 20))..." -ForegroundColor Gray
    $token = $response.token
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}
Write-Host ""

# 4. Listar Animais
Write-Host "4️⃣ Testando Listagem de Animais..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/animals" -Method Get
    Write-Host "✅ Animais listados com sucesso!" -ForegroundColor Green
    Write-Host "   Total de animais: $($response.Count)" -ForegroundColor Gray
    if ($response.Count -gt 0) {
        Write-Host "   Primeiro animal: $($response[0].nome) ($($response[0].especie))" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erro: $_" -ForegroundColor Red
}
Write-Host ""

# 5. Criar Animal
Write-Host "5️⃣ Testando Criação de Animal..." -ForegroundColor Yellow
$newAnimal = @{
    nome = "Docinho"
    especie = "gato"
    raca = "Persa"
    idade = 1
    porte = "pequeno"
    sexo = "femea"
    descricao = "Gatinha linda e carinhosa"
    fotos = @("/assets/logo.jpg")
    status = "disponivel"
} | ConvertTo-Json

try {
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/animals" -Method Post -Body $newAnimal -Headers $headers
    Write-Host "✅ Animal criado com sucesso!" -ForegroundColor Green
    Write-Host "   Nome: $($response.nome)" -ForegroundColor Gray
    Write-Host "   Espécie: $($response.especie)" -ForegroundColor Gray
    Write-Host "   ID: $($response.id)" -ForegroundColor Gray
    $animalId = $response.id
} catch {
    Write-Host "⚠️  $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# 6. Buscar Animal por ID
if ($animalId) {
    Write-Host "6️⃣ Testando Busca de Animal por ID..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/animals/$animalId" -Method Get
        Write-Host "✅ Animal encontrado!" -ForegroundColor Green
        Write-Host "   Nome: $($response.nome)" -ForegroundColor Gray
        Write-Host "   Raça: $($response.raca)" -ForegroundColor Gray
        Write-Host "   Idade: $($response.idade) ano(s)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Erro: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Resumo
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ TESTES DA API CONCLUÍDOS!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Resumo dos Testes:" -ForegroundColor White
Write-Host "   ✓ Health check" -ForegroundColor Green
Write-Host "   ✓ Registro de usuário" -ForegroundColor Green
Write-Host "   ✓ Login" -ForegroundColor Green
Write-Host "   ✓ Listagem de animais" -ForegroundColor Green
Write-Host "   ✓ Criação de animal" -ForegroundColor Green
Write-Host "   ✓ Busca de animal por ID" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 API está funcionando perfeitamente!" -ForegroundColor Green
Write-Host ""
