
const {createReadStream, readFile, stat, readdir} = require("fs");
const {stat: statPromises, readdir: readdirPromises} = require("fs").promises;
const {resolve, sep} = require("path");

let needle = process.argv[2];

async function asyncMain(needle, haystack = process.cwd()){
  let stats, fullPath;

  needle = new RegExp(needle);
  dirItems = await readdirPromises(haystack);
  for (let item of dirItems) {
    fullPath = resolve(haystack,item);
    stats = await statPromises(fullPath);
    if(stats.isFile()) {
      let filePath = fullPath;
      createReadStream(fullPath).on("data", chunk => {
        if(needle.test(chunk.toString())){
          console.log(`found: ${filePath}`);
        }
      });
    } else {
      asyncMain(needle,fullPath);
    }
  }
}

// alt function using readFile rather than createReadStream
function main(needle, haystack = process.cwd()){

  needle = new RegExp(needle);
  dirItems = readdir(haystack, (readdirError, dir) => {
  if (readdirError) throw readdirError;
    for (let item of dir) {
    let fullPath = resolve(haystack,item);
    let stats = stat(fullPath, (statError, stats) => {
      if (statError) throw statError;
      if(stats.isFile()) {
        let filePath = fullPath;
        readFile(filePath, "utf8", (readFileError, text) => {
          if (readFileError) throw readFileError;
          if (needle.test(text)) console.log(`found: ${filePath}`);
          });
      } else {
        main(needle,fullPath);
      }
    });
    }
  });
}
//main(needle);
asyncMain(needle);
