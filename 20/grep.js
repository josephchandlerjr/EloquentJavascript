
const {createReadStream} = require("fs");
const {stat, readdir} = require("fs").promises;
const {resolve, sep} = require("path");

let needle = process.argv[2];

async function main(needle, haystack = process.cwd()){
  let stats, fullPath;

  needle = new RegExp(needle);
  dirItems = await readdir(haystack);
  for (let item of dirItems) {
    fullPath = resolve(haystack,item);
    stats = await stat(fullPath);
    if(stats.isFile()) {
      let filePath = fullPath;
      createReadStream(fullPath).on("data", chunk => {
        if(needle.test(chunk.toString())){
          console.log(`found: ${filePath}`);
        }
      });
    } else {
      main(needle,fullPath);
    }
  }
}

main(needle);
