import multer from "multer";
import fs from "fs";
import path from "path";

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = (baseFolder: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const recordId = req.params.id;
      if (!recordId) return cb(new Error("Missing record ID"), "");

      const uploadPath = path.join("uploads", baseFolder, recordId);
      ensureDir(uploadPath);

      cb(null, uploadPath);
    },
    filename: (_, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });

export const uploadPatientDocs = multer({ storage: storage("patients") });
export const uploadLabFiles = multer({ storage: storage("labs") });
export const uploadInsuranceFiles = multer({ storage: storage("insurance") });
export const uploadConsultationFiles = multer({ storage: storage("consultations") });
