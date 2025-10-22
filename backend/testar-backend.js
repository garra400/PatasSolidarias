import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

async function testarBackend() {
  console.log('🧪 TESTE DO BACKEND');
  console.log('═'.repeat(80));
  console.log('🌐 URL:', BACKEND_URL);
  console.log('\n');

  // Teste 1: Health check
  console.log('1️⃣ Testando Health Check...');
  try {
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('   ✅ Backend está ONLINE');
      console.log('   📊 Resposta:', data);
    } else {
      console.log('   ❌ Backend retornou erro:', healthResponse.status);
    }
  } catch (error) {
    console.log('   ❌ Backend está OFFLINE ou inacessível');
    console.log('   ⚠️  Erro:', error.message);
    console.log('\n🔧 SOLUÇÃO: Execute "npm start" na pasta backend');
    return;
  }

  console.log('\n2️⃣ Testando Login...');
  const loginData = {
    email: 'joaovicgomes.10@gmail.com',
    senha: 'sua_senha_aqui' // Substitua pela senha real para testar
  };

  try {
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    console.log('   📊 Status:', loginResponse.status);

    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('   ✅ Login funcionando!');
      console.log('\n   📤 Dados retornados:');
      console.log('   ═'.repeat(40));
      console.log('   isDoador:', data.user.isDoador);
      console.log('   role:', data.user.role);
      console.log('   totalMesesApoio:', data.user.totalMesesApoio);
      console.log('   brindesDisponiveis:', data.user.brindesDisponiveis);
      
      if (data.user.assinaturaAtiva) {
        console.log('   assinaturaAtiva.status:', data.user.assinaturaAtiva.status);
        console.log('   assinaturaAtiva.valorMensal:', data.user.assinaturaAtiva.valorMensal);
      } else {
        console.log('   assinaturaAtiva: null');
      }
      
      console.log('\n   🔑 Token:', data.token ? '✅ Gerado' : '❌ Não gerado');
    } else {
      const error = await loginResponse.json();
      console.log('   ❌ Erro no login:', error.message);
      console.log('   ⚠️  Se for erro de senha, troque "sua_senha_aqui" pela senha real');
    }
  } catch (error) {
    console.log('   ❌ Erro ao testar login:', error.message);
  }

  console.log('\n═'.repeat(80));
}

testarBackend();
