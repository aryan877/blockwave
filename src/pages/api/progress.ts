import { NextApiRequest, NextApiResponse } from 'next';

const long = async (req: NextApiRequest, res: NextApiResponse) => {
  // set headers to enable server-sent events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let i = 0;
  const interval = setInterval(() => {
    // send message every second
    const message = `data: ${JSON.stringify({ message: `Message ${i}` })}\n\n`;
    res.write(message);
    i++;

    if (i >= 10) {
      // stop sending messages after 10 iterations
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  // cleanup interval on client disconnect
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
};

export default long;
