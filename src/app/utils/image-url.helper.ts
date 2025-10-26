import { environment } from '../../environments/environment';

/**
 * Helper para construir URLs completas de imagens
 */
export class ImageUrlHelper {
    /**
     * Converte URL relativa do backend em URL completa
     * @param url URL que pode ser relativa ou absoluta
     * @returns URL completa para usar em <img src="">
     */
    static getFullImageUrl(url: string | undefined | null): string {
        // Se não houver URL, retornar placeholder
        if (!url) {
            return '/images/animal-placeholder.svg';
        }

        // Se já for uma URL completa, retornar como está
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        // Se for URL de assets (imagens estáticas do projeto)
        if (url.startsWith('/assets') || url.startsWith('assets')) {
            return url;
        }

        // Extrair URL base do backend sem o sufixo /api
        const baseUrl = environment.apiUrl.replace('/api', '');

        // Se começar com /uploads, adicionar URL base do backend
        if (url.startsWith('/uploads')) {
            const fullUrl = `${baseUrl}${url}`;
            console.log('🖼️ ImageUrlHelper - Convertendo:', url, '→', fullUrl);
            return fullUrl;
        }

        // Se for caminho relativo (uploads/...), adicionar URL base com barra
        if (url.startsWith('uploads')) {
            const fullUrl = `${baseUrl}/${url}`;
            console.log('🖼️ ImageUrlHelper - Convertendo:', url, '→', fullUrl);
            return fullUrl;
        }

        // Qualquer outro caso, retornar como está
        console.log('⚠️ ImageUrlHelper - URL não reconhecida:', url);
        return url;
    }

    /**
     * Converte array de URLs
     */
    static getFullImageUrls(urls: string[]): string[] {
        return urls.map(url => this.getFullImageUrl(url));
    }
}
