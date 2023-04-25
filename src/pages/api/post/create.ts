import { ProtocolEnum, SpheronClient } from '@spheron/storage';
import { rejects } from 'assert';
import { verifyMessage } from 'ethers/lib/utils';
import formidable from 'formidable';
import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import client from '../../../../lib/sanityBackendClient';
const sphToken = process.env.NEXT_PUBLIC_SPHERON_TOKEN as string;
const sphClient = new SpheronClient({ token: sphToken });
let currentlyUploaded = 0;
interface NewPost {
  _type: 'posts';
  text: string;
  author: {
    _type: 'reference';
    _ref: string; // _id of the author document
  };
  likes: number;
  postImage?: string;
}

export const config = {
  api: {
    bodyParser: false,
  },
};
const readForm = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: any }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), '/public/images');
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + '_' + path.originalFilename;
    };
  }
  options.maxFileSize = 3000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function createPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //verify wallet signature here, only if signature is valid then the user can post

  try {
    await fs.readdir(path.join(process.cwd() + '/public', '/images'));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + '/public', '/images'));
  }
  let _files;
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }
    const { fields, files } = await readForm(req, true);
    _files = files;
    if (!fields.txt && !files.image) {
      if (req.method !== 'POST') {
        res.status(405).json({
          message: 'image or text is required',
        });
        return;
      }
    }
    let postImage = ''; // initialize postImage to empty string
    if (files.image) {
      // check if an image was uploaded
      const { uploadId, bucketId, protocolLink, dynamicLinks } =
        await sphClient.upload(`${files.image.filepath}`, {
          protocol: ProtocolEnum.IPFS,
          name: files.image.newFilename,
          onUploadInitiated: (uploadId) => {},
          onChunkUploaded: (uploadedSize, totalSize) => {
            currentlyUploaded += uploadedSize;
          },
        });
      await fs.unlink(files.image.filepath);
      postImage = `${protocolLink}/${files.image.newFilename}`; // set postImage to the uploaded image link
    }

    const postDoc: NewPost = {
      _type: 'posts',
      text: fields.text as string,
      postImage: postImage, // use the postImage variable in the postDoc
      likes: 0,
      author: {
        _type: 'reference',
        _ref: '0x1dd38Ed37ACEae4Db1a178C11c886Ed753Fd3b24',
      },
    };
    const result = await client.create<NewPost>(postDoc);
    res.json({ result });
  } catch (error) {
    if (_files && _files.image && _files.image.filepath) {
      await fs.unlink(_files.image.filepath);
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}
