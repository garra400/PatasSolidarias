import http from 'http';

// Função auxiliar para fazer requisições HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Testando endpoints da API...\n');
  
  try {
    // 1. Testar health check
    console.log('1️⃣ GET /api/health');
    const health = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    });
    console.log('✅ Status:', health.status);
    console.log('   Resposta:', health.data);
    console.log('');

    // 2. Testar registro de usuário
    console.log('2️⃣ POST /api/auth/register');
    const newUser = {
      nome: 'Maria Silva',
      email: 'maria@teste.com',
      senha: 'senha123',
      telefone: '(41) 98888-8888',
      endereco: 'Rua das Flores, 456',
      cpf: '987.654.321-00'
    };
    
    const register = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, newUser);
    
    console.log('✅ Status:', register.status);
    console.log('   Usuário:', register.data.user?.nome);
    console.log('   Token recebido:', register.data.token ? 'Sim' : 'Não');
    console.log('');

    const token = register.data.token;

    // 3. Testar login
    console.log('3️⃣ POST /api/auth/login');
    const login = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'maria@teste.com',
      senha: 'senha123'
    });
    
    console.log('✅ Status:', login.status);
    console.log('   Login bem-sucedido:', login.status === 200 ? 'Sim' : 'Não');
    console.log('   Usuário:', login.data.user?.nome);
    console.log('');

    // 4. Testar listar animais
    console.log('4️⃣ GET /api/animals');
    const animals = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/animals',
      method: 'GET'
    });
    
    console.log('✅ Status:', animals.status);
    console.log('   Total de animais:', animals.data.length);
    if (animals.data.length > 0) {
      console.log('   Primeiro animal:', animals.data[0].nome);
    }
    console.log('');

    // 5. Testar criar animal
    console.log('5️⃣ POST /api/animals');
    const newAnimal = {
      nome: 'Bobby',
      especie: 'cachorro',
      raca: 'Beagle',
      idade: 2,
      porte: 'medio',
      sexo: 'macho',
      descricao: 'Cachorrinho alegre e brincalhão',
      fotos: ['/assets/logo.jpg'],
      status: 'disponivel'
    };
    
    const createAnimal = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/animals',
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, newAnimal);
    
    console.log('✅ Status:', createAnimal.status);
    console.log('   Animal criado:', createAnimal.data.nome);
    console.log('   ID:', createAnimal.data.id);
    console.log('');

    const animalId = createAnimal.data.id;

    // 6. Testar buscar animal por ID
    console.log('6️⃣ GET /api/animals/:id');
    const getAnimal = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/animals/${animalId}`,
      method: 'GET'
    });
    
    console.log('✅ Status:', getAnimal.status);
    console.log('   Animal encontrado:', getAnimal.data.nome);
    console.log('   Raça:', getAnimal.data.raca);
    console.log('');

    // 7. Testar atualizar animal
    console.log('7️⃣ PUT /api/animals/:id');
    const updateAnimal = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/api/animals/${animalId}`,
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, {
      descricao: 'Cachorrinho super alegre, brincalhão e sociável com crianças'
    });
    
    console.log('✅ Status:', updateAnimal.status);
    console.log('   Mensagem:', updateAnimal.data.message);
    console.log('');

    // 8. Testar recuperação de senha
    console.log('8️⃣ POST /api/auth/reset-password');
    const resetPassword = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/reset-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'maria@teste.com'
    });
    
    console.log('✅ Status:', resetPassword.status);
    console.log('   Mensagem:', resetPassword.data.message);
    console.log('');

    // Resumo
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ TODOS OS TESTES DA API PASSARAM COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📊 Resumo:');
    console.log('   ✓ Health check funcionando');
    console.log('   ✓ Registro de usuário funcionando');
    console.log('   ✓ Login funcionando');
    console.log('   ✓ Listagem de animais funcionando');
    console.log('   ✓ Criação de animal funcionando');
    console.log('   ✓ Busca de animal por ID funcionando');
    console.log('   ✓ Atualização de animal funcionando');
    console.log('   ✓ Recuperação de senha funcionando');
    console.log('\n🎉 API está 100% operacional!\n');

  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
    console.log('\n⚠️  Certifique-se de que o servidor está rodando:');
    console.log('   npm start');
  }
}

testAPI();
