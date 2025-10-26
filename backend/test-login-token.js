import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    console.log('🧪 Testando Login e Payload do Token...\n');

    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'joaovicgomes.10@gmail.com',
        senha: 'admin123'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('❌ Erro no login:', data.message);
      return;
    }

    console.log('✅ Login bem-sucedido!\n');

    // Decodificar o token JWT
    const token = data.token;
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    console.log('📦 PAYLOAD DO TOKEN JWT:');
    console.log(JSON.stringify(payload, null, 2));

    console.log('\n🔍 VERIFICAÇÃO:');
    console.log('   isAdmin:', payload.isAdmin);
    console.log('   Tem permissões?', payload.permissoes ? 'SIM ✅' : 'NÃO ❌');

    if (payload.permissoes) {
      console.log('\n🔐 PERMISSÕES NO TOKEN:');
      console.log(JSON.stringify(payload.permissoes, null, 2));
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

testLogin();
