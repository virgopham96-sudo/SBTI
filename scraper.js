import https from 'https';
import fs from 'fs';

const urls = [
  '/en/result/ctrl', '/en/result/atm-er', '/en/result/dior-s', '/en/result/boss',
  '/en/result/than-k', '/en/result/oh-no', '/en/result/gogo', '/en/result/sexy',
  '/en/result/love-r', '/en/result/mum', '/en/result/fake', '/en/result/ojbk',
  '/en/result/malo', '/en/result/joker', '/en/result/woc', '/en/result/thin-k',
  '/en/result/shit', '/en/result/zzzz', '/en/result/poor', '/en/result/monk',
  '/en/result/imsb', '/en/result/solo', '/en/result/fuck', '/en/result/dead',
  '/en/result/imfw', '/en/result/hhhh', '/en/result/drunk'
];

const results = [];

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get('https://sbti.dev' + url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  for (const url of urls) {
    console.log(`Fetching ${url}...`);
    const html = await fetchUrl(url);
    
    // Extract title
    const titleMatch = html.match(/<title>(.*?) SBTI Result/);
    const title = titleMatch ? titleMatch[1] : '';
    
    // Extract description
    const descMatch = html.match(/<meta property="og:description" content="(.*?)"/);
    const desc = descMatch ? descMatch[1] : '';
    
    // Extract dimensions (they are usually in some format like `<div class="..."><span class="...">Dimension</span><span class="...">Value</span></div>`)
    // Let's just extract the text inside the dimension profile section.
    // Actually, it's easier to just get the MBTI mapping and the quote.
    
    // The quote is usually at the end of the description: "Read the full SBTI result meaning, 15-dimension personality profile, and character breakdown. [Quote]"
    let quote = '';
    if (desc) {
      const parts = desc.split('character breakdown. ');
      if (parts.length > 1) quote = parts[1];
    }
    
    results.push({
      id: url.split('/').pop(),
      title,
      quote,
      description: desc
    });
  }
  
  fs.writeFileSync('sbti_data.json', JSON.stringify(results, null, 2));
  console.log('Done!');
}

main();
