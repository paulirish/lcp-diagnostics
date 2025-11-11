import express from 'express';
import compression from 'compression';
import serverless from 'serverless-http';

const app = express();
app.use(compression());

// Turn off all caching for tests.
app.use((req, res, next) => {
  // // Cache static assets for 1 year.
  // if (req.path.match(/\.(css|woff2|avif|webp|jpg)$/)) {
  //   res.set('Cache-Control', 'max-age=31536000');
  // }
  // // Cache everything else for 5 minutes but force
  // else {
  //   res.set('Cache-Control', 'max-age=300');
  // }

  res.set('Cache-Control', 'no-store');

  next();
});

app.use((req, res, next) => {
  // Simulate 200-500ms API server processing latency.
  if (req.path.endsWith('.json')) {
    setTimeout(next, Math.random() * 100 + 100);
  } else {
    next();
  }
});

app.use(express.static('../../public/'));

export const handler = serverless(app);
