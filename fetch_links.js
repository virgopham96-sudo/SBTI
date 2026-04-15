import https from 'https';
https.get('https://sbti.dev/en/types', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/href="([^"]+)"/g);
    console.log(matches.filter(m => m.includes('/result/')));
  });
});
