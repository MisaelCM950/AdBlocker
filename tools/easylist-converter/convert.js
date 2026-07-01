const https = require('https');
const fs = require('fs');
const path = require('path');

const EASYLIST_URL = 'https://easylist.to/easylist/easylist.txt';
// Moves up two directories from /tools/easylist-converter/ to /AdBlocker/
const OUTPUT_DIR = path.join(__dirname, '../../'); 
const MAX_RULES_PER_FILE = 30000;

console.log('Downloading latest EasyList...');

https.get(EASYLIST_URL, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    
    res.on('end', () => {
        console.log('Parsing rules natively...');
        const lines = data.split('\n');
        const dnrRules = [];
        let idCounter = 1;

        for (const line of lines) {
            const text = line.trim();
            
            // Skip comments, empty lines, and cosmetic HTML hiding rules (##)
            if (!text || text.startsWith('!') || text.startsWith('[') || text.includes('##')) {
                continue;
            }

            // For our custom blocker, we will extract the most powerful network rules:
            // Rules starting with || (domain anchors)
            if (text.startsWith('||')) {
                // EasyList uses $ to specify advanced options (like $third-party,script). 
                // To keep it simple and DNR compliant, we strip options and just block the domain.
                let cleanFilter = text.split('$')[0]; 
                
                // Remove trailing ^ (which acts as a separator in Adblock syntax)
                if (cleanFilter.endsWith('^')) {
                    cleanFilter = cleanFilter.slice(0, -1);
                }

                dnrRules.push({
                    id: idCounter++,
                    priority: 1,
                    action: { type: 'block' },
                    condition: {
                        urlFilter: cleanFilter,
                        resourceTypes: ['main_frame', 'sub_frame', 'script', 'image', 'xmlhttprequest']
                    }
                });
            }
        }

        console.log(`Successfully extracted ${dnrRules.length} network rules.`);

        // Split and save the rules to respect Chrome's limits
        let fileIndex = 1;
        for (let i = 0; i < dnrRules.length; i += MAX_RULES_PER_FILE) {
            const chunk = dnrRules.slice(i, i + MAX_RULES_PER_FILE);
            const outputFilename = `rules_${fileIndex}.json`;
            
            fs.writeFileSync(
                path.join(OUTPUT_DIR, outputFilename),
                JSON.stringify(chunk, null, 2)
            );
            
            console.log(`Saved ${chunk.length} rules to ${outputFilename} in your main AdBlocker folder!`);
            fileIndex++;
        }

        console.log('Conversion complete! Ready to load in Chrome.');
    });
}).on('error', (err) => {
    console.error('Error downloading EasyList:', err.message);
});