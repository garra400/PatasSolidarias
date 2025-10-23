import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar diretórios se não existirem
const uploadsDir = path.join(__dirname, '../uploads');
const animaisDir = path.join(uploadsDir, 'animais');
const fotosDir = path.join(uploadsDir, 'fotos');
const brindesDir = path.join(uploadsDir, 'brindes');

[uploadsDir, animaisDir, fotosDir, brindesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = uploadsDir;

        // Determinar pasta baseado no tipo
        if (req.baseUrl.includes('/animais')) {
            uploadPath = animaisDir;
        } else if (req.baseUrl.includes('/fotos')) {
            uploadPath = fotosDir;
        } else if (req.baseUrl.includes('/brindes')) {
            uploadPath = brindesDir;
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Gerar nome único: timestamp + nome original sanitizado
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
    }
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
    }
};

// Configuração do multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});

// Exports específicos
export const uploadSingle = upload.single('foto');
export const uploadMultiple = upload.array('fotos', 20); // Máximo 20 fotos por vez
export const uploadFields = upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'fotos', maxCount: 20 }
]);

export default upload;
