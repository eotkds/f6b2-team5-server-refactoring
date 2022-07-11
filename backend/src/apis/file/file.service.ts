import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

interface IUpload {
  file: FileUpload;
}

@Injectable()
export class FileService {
  async userImage({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);

    //return String
    const result = await new Promise((resolve, reject) => {
      const fname = `userImage/${uuidv4()}`;
      const EncodeProjectFile = encodeURIComponent(file.filename);
      file
        .createReadStream()
        .pipe(storage.file(`${fname}/${file.filename}`).createWriteStream())
        .on('finish', () =>
          resolve(
            `https://storage.cloud.google.com/${bucket}/${fname}/${EncodeProjectFile}`,
          ),
        )
        .on('error', (error) => reject(error));
    });
    return result;
  }

  async projectImage({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);

    //return String
    const result = await new Promise((resolve, reject) => {
      const fname = `projectImage/${uuidv4()}`;
      const EncodeProjectFile = encodeURIComponent(file.filename);
      file
        .createReadStream()
        .pipe(storage.file(`${fname}/${file.filename}`).createWriteStream())
        .on('finish', () =>
          resolve(
            `https://storage.cloud.google.com/${bucket}/${fname}/${EncodeProjectFile}`,
          ),
        )
        .on('error', (error) => reject(error));
    });

    return result;
  }

  async projectFile({ file }: IUpload) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);

    // return string
    const result = await new Promise((resolve, reject) => {
      const fname = `projectFile/${uuidv4()}`;
      const EncodeProjectFile = encodeURIComponent(file.filename);
      file
        .createReadStream()
        .pipe(storage.file(`${fname}/${file.filename}`).createWriteStream())
        .on('finish', () =>
          resolve(
            `https://storage.cloud.google.com/${bucket}/${fname}/${EncodeProjectFile}`,
          ),
        )
        .on('error', (error) => reject(error));
    });

    return result;
  }

  // 구글 스토리에서 deleteFile 사용 안하고 있음!
  async deleteFileWithGoogle({ URL }) {
    const bucket = process.env.STORAGE_BUCKET;
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(bucket);

    const dir = URL.replace(`https://storage.cloud.google.com/${bucket}/`, '');
    const fname = dir.split('/');
    const decodeFileName = decodeURIComponent(fname[fname.length - 1]);
    fname.pop();
    fname.push(decodeFileName);
    const decodedfname = fname.join('/');

    const result = await storage
      .file(decodedfname)
      .delete()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
    return result;
  }
}
