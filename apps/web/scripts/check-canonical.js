import https from 'node:https';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

const run = async () => {
  const home = await get('https://soranauts.com/');
  const hasCanonical = /<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/soranauts\.com\/?[^"']*["']/i.test(home.body);
  console.log('Home canonical apex:', hasCanonical ? 'OK' : 'MISSING');

  const sitemap = await get('https://soranauts.com/sitemap-index.xml');
  const apexOnly = !/https:\/\/www\.soranauts\.com\//i.test(sitemap.body);
  console.log('Sitemap apex-only:', apexOnly ? 'OK' : 'FOUND WWW URLs');
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
