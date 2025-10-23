# Script para corrigir injeções de dependência nos componentes admin

$files = @(
    "src\app\components\admin\admins\aceitar-convite\aceitar-convite.component.ts",
    "src\app\components\admin\animais\form-animal\form-animal.component.ts",
    "src\app\components\admin\animais\lista-animais\lista-animais.component.ts",
    "src\app\components\admin\fotos\lista-fotos\lista-fotos.component.ts",
    "src\app\components\admin\fotos\upload-fotos\upload-fotos.component.ts",
    "src\app\components\admin\brindes\form-brinde\form-brinde.component.ts",
    "src\app\components\admin\brindes\lista-brindes\lista-brindes.component.ts",
    "src\app\components\admin\resgates\config-resgate\config-resgate.component.ts",
    "src\app\components\admin\resgates\lista-resgates\lista-resgates.component.ts",
    "src\app\components\admin\posts\editor-post\editor-post.component.ts",
    "src\app\components\admin\posts\lista-posts\lista-posts.component.ts",
    "src\app\components\admin\assinantes\detalhe-assinante\detalhe-assinante.component.ts",
    "src\app\components\admin\assinantes\estatisticas\estatisticas.component.ts",
    "src\app\components\admin\assinantes\lista-assinantes\lista-assinantes.component.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # Adicionar inject ao import de @angular/core
        $content = $content -replace "import \{ Component", "import { Component, inject"
        
        # Remover constructor e substituir por inject()
        # Padrão: constructor(private serviceVar: ServiceType) { }
        $content = $content -replace "constructor\(private (\w+): (\w+)\)\s*\{\s*\}", ""
        $content = $content -replace "constructor\(\s*private (\w+): (\w+),", "// Injeção via inject()`r`n    private `$1 = inject(`$2);"
        $content = $content -replace ",\s*private (\w+): (\w+)\s*\)", ""
        
        Set-Content $fullPath $content -NoNewline
        Write-Host "Corrigido: $file" -ForegroundColor Green
    } else {
        Write-Host "Não encontrado: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nConcluído! Verifique os arquivos modificados." -ForegroundColor Cyan
