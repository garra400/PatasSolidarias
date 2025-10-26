/**
 * ⚠️ SCRIPT DE EMERGÊNCIA - FORÇA LOGOUT E LIMPA TOKEN DESATUALIZADO ⚠️
 * 
 * COMO USAR:
 * 1. Abra o DevTools (F12)
 * 2. Vá para a aba "Console"
 * 3. Cole TODO este código e pressione ENTER
 * 4. A página será recarregada automaticamente
 * 5. Faça login novamente com: joaovicgomes.10@gmail.com
 * 
 * PROBLEMA:
 * Seu token JWT foi gerado ANTES de você receber permissões de admin.
 * O token contém: isAdmin: false
 * O banco contém: isAdmin: true
 * 
 * SOLUÇÃO:
 * Logout completo + novo login = novo token com isAdmin: true
 */

(function forceLogoutAndClearToken() {
    console.log('🧹 Iniciando limpeza completa...');

    // 1. Remover token e usuário do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');

    // 2. Remover qualquer outro dado relacionado
    Object.keys(localStorage).forEach(key => {
        if (key.includes('token') || key.includes('user') || key.includes('auth')) {
            localStorage.removeItem(key);
            console.log(`🗑️ Removido: ${key}`);
        }
    });

    // 3. Limpar sessionStorage também
    sessionStorage.clear();

    // 4. Limpar cookies (se houver)
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log('✅ Limpeza completa realizada!');
    console.log('🔄 Recarregando página em 2 segundos...');
    console.log('');
    console.log('📝 PRÓXIMOS PASSOS:');
    console.log('1. ✅ Página será recarregada automaticamente');
    console.log('2. 🔑 Faça login com: joaovicgomes.10@gmail.com');
    console.log('3. 🎉 Novo token será gerado com isAdmin: true');
    console.log('4. ✨ Todos os erros 401 serão resolvidos!');

    // 5. Recarregar página após 2 segundos
    setTimeout(() => {
        window.location.href = '/login';
    }, 2000);
})();
