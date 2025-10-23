import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';

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
    cb(null, `avatar-${req.user.id}-${uniqueSuffix}${ext}`);
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

// Upload de avatar
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const fotoPerfil = `/uploads/avatars/${req.file.filename}`;
    const userId = new ObjectId(req.user.id);
    const db = req.app.locals.db;

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

export default router;
