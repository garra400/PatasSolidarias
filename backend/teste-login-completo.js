import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

async function testarLoginCompleto() {
  console.log('🧪 TESTE COMPLETO DE LOGIN');
  console.log('═'.repeat(80));
  
  const loginData = {
    email: 'joaovicgomes.10@gmail.com',
    senha: '123456'
  };

  console.log('\n📤 Fazendo login com:');
  console.log('   Email:', loginData.email);
  console.log('   Senha:', '******');
  console.log('\n⏳ Aguardando resposta...\n');

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    console.log('📊 STATUS HTTP:', response.status);
    console.log('═'.repeat(80));

    if (response.ok) {
      const data = await response.json();
      
      console.log('\n✅ LOGIN BEM-SUCEDIDO!\n');
      console.log('═'.repeat(80));
      console.log('📦 DADOS DO USUÁRIO RETORNADOS:');
      console.log('═'.repeat(80));
      
      const user = data.user;
      
      console.log('\n👤 INFORMAÇÕES BÁSICAS:');
      console.log('   _id:', user._id || '❌ FALTANDO');
      console.log('   nome:', user.nome || '❌ FALTANDO');
      console.log('   email:', user.email || '❌ FALTANDO');
      console.log('   role:', user.role || '❌ FALTANDO');
      
      console.log('\n💰 STATUS DE DOADOR:');
      console.log('   isDoador:', user.isDoador, typeof user.isDoador === 'boolean' ? '✅' : '❌ TIPO ERRADO');
      console.log('   totalMesesApoio:', user.totalMesesApoio, typeof user.totalMesesApoio === 'number' ? '✅' : '❌ FALTANDO');
      console.log('   brindesDisponiveis:', user.brindesDisponiveis, typeof user.brindesDisponiveis === 'number' ? '✅' : '❌ FALTANDO');
      
      console.log('\n📋 ASSINATURA:');
      if (user.assinaturaAtiva) {
        console.log('   ✅ assinaturaAtiva existe');
        console.log('   status:', user.assinaturaAtiva.status);
        console.log('   tipo:', user.assinaturaAtiva.tipo);
        console.log('   valorMensal: R$', user.assinaturaAtiva.valorMensal);
      } else {
        console.log('   ❌ assinaturaAtiva: null ou undefined');
      }
      
      console.log('\n💳 HISTÓRICO:');
      if (user.historicoPagamentos && Array.isArray(user.historicoPagamentos)) {
        console.log('   ✅ historicoPagamentos: array com', user.historicoPagamentos.length, 'items');
      } else {
        console.log('   ❌ historicoPagamentos: null, undefined ou não é array');
      }
      
      console.log('\n🔑 TOKEN:');
      console.log('   Token JWT:', data.token ? '✅ Gerado (' + data.token.substring(0, 20) + '...)' : '❌ FALTANDO');
      
      console.log('\n═'.repeat(80));
      console.log('🔍 VERIFICAÇÃO FINAL:');
      console.log('═'.repeat(80));
      
      const checks = {
        'isDoador === true': user.isDoador === true,
        'totalMesesApoio > 0': user.totalMesesApoio > 0,
        'assinaturaAtiva existe': !!user.assinaturaAtiva,
        'assinatura está ativa': user.assinaturaAtiva?.status === 'ativa',
        'role definido': !!user.role,
        'token gerado': !!data.token
      };
      
      for (const [check, passed] of Object.entries(checks)) {
        console.log(`   ${passed ? '✅' : '❌'} ${check}`);
      }
      
      console.log('\n═'.repeat(80));
      console.log('📄 JSON COMPLETO:');
      console.log('═'.repeat(80));
      console.log(JSON.stringify(user, null, 2));
      console.log('\n═'.repeat(80));
      
      if (user.isDoador === true && user.assinaturaAtiva?.status === 'ativa') {
        console.log('\n🎉 SUCESSO! O backend está retornando os dados corretamente!');
        console.log('📝 Se o frontend ainda não funciona:');
        console.log('   1. Abra o DevTools (F12)');
        console.log('   2. Vá em Application → Local Storage');
        console.log('   3. Delete tudo');
        console.log('   4. Faça login novamente');
        console.log('   5. Verifique o Console para ver os logs do Angular');
      } else {
        console.log('\n⚠️  PROBLEMA! Os dados não estão corretos');
        console.log('Execute: node update-user-doador.js');
      }
      
    } else {
      const error = await response.json();
      console.log('\n❌ ERRO NO LOGIN:');
      console.log('   Status:', response.status);
      console.log('   Mensagem:', error.message);
      
      if (response.status === 401) {
        console.log('\n💡 Dica: Senha incorreta ou usuário não existe');
      }
    }
    
  } catch (error) {
    console.log('\n❌ ERRO DE CONEXÃO:');
    console.log('   Erro:', error.message);
    console.log('\n💡 Dica: Verifique se o backend está rodando:');
    console.log('   cd backend && npm start');
  }
  
  console.log('\n═'.repeat(80));
}

testarLoginCompleto();
