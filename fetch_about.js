import https from 'https';

https.get('https://sbti.dev/en/about', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Extract paragraphs and headings
    const matches = data.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>|<p[^>]*>(.*?)<\/p>/g);
    if (matches) {
      matches.forEach(m => console.log(m.replace(/<[^>]+>/g, '').trim()));
    }
  });
});
