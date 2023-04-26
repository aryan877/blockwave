import { ProtocolEnum, SpheronClient } from '@spheron/storage';
// import { rejects } from 'assert';
// import { verifyMessage } from 'ethers/lib/utils';
import formidable from 'formidable';
import fs from 'fs/promises';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import client from '../../../../lib/sanityBackendClient';
import { ironOptions } from '../../../../utils';
const sphToken = process.env.SPHERON_TOKEN as string;
const sphClient = new SpheronClient({ token: sphToken });
let currentlyUploaded = 0;
interface NewPost {
  _type: 'posts';
  text: string;
  author: {
    _type: 'reference';
    _ref: string; // _id of the author document
  };
  likes: [] | null;
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

const createPost = async (req: NextApiRequest, res: NextApiResponse) => {
  //verify wallet signature here, only if signature is valid then the user can post

  if (!req.session.siwe?.address) {
    return res.status(422).json({ message: 'Invalid token' });
  }
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
      likes: [],
      author: {
        _type: 'reference',
        _ref: req.session.siwe?.address as string,
      },
    };
    const result = await client.create<NewPost>(postDoc);
    // Fetch the author document
    const authorDoc = await client.fetch(
      `*[_id == "${result.author._ref}"][0]`
    );

    // Update the author reference in the post document
    const postWithAuthor = {
      ...result,
      author: authorDoc,
    };

    // Update the post document with the populated author reference
    res.json({ postWithAuthor });
  } catch (error) {
    if (_files && _files.image && _files.image.filepath) {
      await fs.unlink(_files.image.filepath);
    }
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default withIronSessionApiRoute(createPost, ironOptions);
