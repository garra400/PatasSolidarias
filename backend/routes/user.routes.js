import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';
import { verifyToken } from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configurar diretório de uploads
const uploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const userId = req.user?._id ? req.user._id.toString() : 'unknown';
    cb(null, `avatar-${userId}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload de avatar (POST - compatibilidade)
router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const fotoPerfil = `/uploads/avatars/${req.file.filename}`;
    const userId = req.user._id; // req.user._id já é ObjectId
    const db = req.app.locals.db;

    // Deletar foto antiga se existir
    const userAtual = await db.collection('users').findOne({ _id: userId });
    if (userAtual?.fotoPerfil) {
      const fotoAntigaPath = path.join(__dirname, '..', userAtual.fotoPerfil);
      if (fs.existsSync(fotoAntigaPath)) {
        fs.unlinkSync(fotoAntigaPath);
      }
    }

    const result = await db.collection('users').findOneAndUpdate(
      { _id: userId },
      { $set: { fotoPerfil, fotoPerfilAtualizada: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      message: 'Avatar atualizado com sucesso',
      fotoPerfil
    });

  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
});

// Atualizar foto de perfil (PUT - novo endpoint)
router.put('/foto-perfil', verifyToken, upload.single('foto'), async (req, res) => {
  try {
    console.log('📸 Recebida requisição PUT /foto-perfil');
    console.log('👤 User completo:', req.user);
    console.log('🆔 User _id:', req.user?._id);
    console.log('📁 Arquivo recebido:', req.file ? 'SIM' : 'NÃO');

    if (!req.file) {
      console.log('❌ Nenhum arquivo no request');
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    if (!req.user || !req.user._id) {
      console.log('❌ Usuário não autenticado');
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const fotoPerfilUrl = `/uploads/avatars/${req.file.filename}`;

    // req.user._id já é um ObjectId do MongoDB
    const userId = req.user._id;
    console.log('✅ User ID:', userId);

    const db = req.app.locals.db;

    console.log('💾 Salvando foto:', fotoPerfilUrl);
    console.log('🔍 Buscando usuário com ID:', userId.toString());

    // Deletar foto antiga se existir
    const userAtual = await db.collection('users').findOne({ _id: userId });
    console.log('👤 Usuário encontrado (busca prévia):', userAtual ? 'SIM' : 'NÃO');

    if (userAtual?.fotoPerfil) {
      const fotoAntigaPath = path.join(__dirname, '..', userAtual.fotoPerfil);
      if (fs.existsSync(fotoAntigaPath)) {
        fs.unlinkSync(fotoAntigaPath);
        console.log('🗑️ Foto antiga removida');
      }
    }

    const result = await db.collection('users').findOneAndUpdate(
      { _id: userId },
      { $set: { fotoPerfil: fotoPerfilUrl, fotoPerfilAtualizada: new Date() } },
      { returnDocument: 'after' }
    );

    console.log('📊 Resultado do update:', result ? 'SUCESSO' : 'FALHOU');

    if (!result) {
      fs.unlinkSync(req.file.path);
      console.log('❌ Usuário não encontrado no update');
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    console.log('✅ Foto de perfil atualizada:', fotoPerfilUrl);
    res.json({
      message: 'Foto de perfil atualizada com sucesso',
      fotoPerfilUrl
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar foto de perfil:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Erro ao atualizar foto de perfil' });
  }
});

// Remover foto de perfil (DELETE)
router.delete('/foto-perfil', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id; // req.user._id já é ObjectId
    const db = req.app.locals.db;

    // Buscar usuário para pegar path da foto
    const user = await db.collection('users').findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Deletar arquivo físico se existir
    if (user.fotoPerfil) {
      const fotoPath = path.join(__dirname, '..', user.fotoPerfil);
      if (fs.existsSync(fotoPath)) {
        fs.unlinkSync(fotoPath);
        console.log('🗑️ Foto removida:', fotoPath);
      }
    }

    // Remover do banco
    await db.collection('users').updateOne(
      { _id: userId },
      { $unset: { fotoPerfil: '', fotoPerfilAtualizada: '' } }
    );

    console.log('✅ Foto de perfil removida do usuário:', userId);
    res.json({ message: 'Foto de perfil removida com sucesso' });

  } catch (error) {
    console.error('❌ Erro ao remover foto de perfil:', error);
    res.status(500).json({ error: 'Erro ao remover foto de perfil' });
  }
});

export default router;
