/**
 * Script de Migração: Adicionar mesReferencia às fotos existentes
 * 
 * Este script adiciona o campo mesReferencia a todas as fotos que não o possuem.
 * O mesReferencia será calculado com base na data de criação da foto (criadaEm).
 */

import mongoose from 'mongoose';
import Foto from '../models/foto.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrarFotos() {
    try {
        console.log('🚀 Iniciando migração de fotos...');

        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/patas-solidarias');
        console.log('✅ Conectado ao MongoDB');

        // Buscar todas as fotos sem mesReferencia
        const fotosSemMes = await Foto.find({
            $or: [
                { mesReferencia: { $exists: false } },
                { mesReferencia: null },
                { mesReferencia: '' }
            ]
        });

        console.log(`📊 ${fotosSemMes.length} fotos precisam de migração`);

        if (fotosSemMes.length === 0) {
            console.log('✅ Todas as fotos já possuem mesReferencia!');
            process.exit(0);
        }

        let atualizadas = 0;
        let erros = 0;

        for (const foto of fotosSemMes) {
            try {
                // Calcular mesReferencia com base na data de criação
                const dataCriacao = foto.criadaEm || new Date();
                const ano = dataCriacao.getFullYear();
                const mes = String(dataCriacao.getMonth() + 1).padStart(2, '0');
                const mesReferencia = `${ano}-${mes}`;

                // Atualizar foto
                foto.mesReferencia = mesReferencia;
                await foto.save();

                atualizadas++;
                console.log(`✅ Foto ${foto._id} → mesReferencia: ${mesReferencia}`);
            } catch (error) {
                erros++;
                console.error(`❌ Erro ao migrar foto ${foto._id}:`, error.message);
            }
        }

        console.log('\n📊 Resumo da Migração:');
        console.log(`   ✅ Fotos atualizadas: ${atualizadas}`);
        console.log(`   ❌ Erros: ${erros}`);
        console.log(`   📈 Total processado: ${fotosSemMes.length}`);

        // Verificar resultado
        const fotosRestantes = await Foto.countDocuments({
            $or: [
                { mesReferencia: { $exists: false } },
                { mesReferencia: null },
                { mesReferencia: '' }
            ]
        });

        if (fotosRestantes === 0) {
            console.log('\n🎉 Migração concluída com sucesso!');
        } else {
            console.log(`\n⚠️ Ainda restam ${fotosRestantes} fotos sem mesReferencia`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro fatal na migração:', error);
        process.exit(1);
    }
}

// Executar migração
migrarFotos();
