const fs = require('fs');
const extractDomain = require('extract-domain')

var whiteList = [];
var blackList = [];

try{
    whiteList = fs.readFileSync('data/white-list.txt').toString().split("\n");
    blackList = fs.readFileSync('data/black-list.txt').toString().split("\n");
}catch{}


(async () => {

    let justDeleteMe = await fetch('https://raw.githubusercontent.com/jdm-contrib/jdm/master/_data/sites.json');

    if (justDeleteMe.ok) {
        let entries = await justDeleteMe.json();
        entries.forEach(entry => {
            domains = entry.domains.filter(x => x); // Remove empty lines
            domains = extractDomain(domains, { tld: true });
            domains = domains.filter(x => /.*[\.].+/.test(x))
            if (entry.difficulty === 'easy') {
                whiteList.push(...domains);
            } else {
                blackList.push(...domains);
            }
        });
    }

    let rtbf = await fetch('https://raw.githubusercontent.com/rtbf-ir/rtbf.ir/main/data/data.json');

    if (rtbf.ok) {
        let entries = await rtbf.json();
        entries = entries.filter(x => x.website && x.website.trim()); // Remove empty lines
        entries = entries.filter(x => /.*[\.].+/.test(x.website));
        entries.forEach(entry => {
            let domain = extractDomain(entry.website, { tld: true });
            if (entry.keytype === 'easy-label') {
                whiteList.push(domain);
            } else {
                blackList.push(domain);
            }
        });
    }

    whiteList = whiteList.filter(x => x); // Remove empty lines    
    whiteList = whiteList.map(x => x.trim());
    whiteList = [... new Set(whiteList)];
    whiteList.sort();

    writeArrayToFile(whiteList, "data/white-list.txt");

    blackList = blackList.filter(x => x);    
    blackList = blackList.map(x => x.trim());
    blackList = [... new Set(blackList)];
    blackList.sort();
    writeArrayToFile(blackList, "data/black-list.txt");

})()

function writeArrayToFile(arr, filename) {
    const text = arr.join("\n")
    fs.writeFileSync(filename, text, "utf-8");
}
