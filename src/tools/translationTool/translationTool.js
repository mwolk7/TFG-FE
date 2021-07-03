// Global data
var itMergeData = {}
var enMergeData = {}

var keyMapperData = ""


var abbreviations = ["NDG","LP","AM","GBV","UO"]


/**
 * Convert String from dot Notation JSON to neasted object JSON
 * @param o dot notation JSON string
 * @returns neasted object JSON
 */
function convertNested(o) {
    var oo = {}, t, parts, part;
    for (var k in o) {
        t = oo;
        parts = k.split('.');
        var key = parts.pop();
        while (parts.length) {
            part = parts.shift();
            t = t[part] = t[part] || {};
        }
        t[key] = o[k]
    }
    return oo;
}

/**
 * Conver CamelToSnake string
 * @param string
 * @returns {string}
 */
function camelToSnake(string) {
    separator = typeof separator === 'undefined' ? '_' : separator;

    return string
        .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
        .toLowerCase();
}

/**
 * Search and convert the next character to UPPERCASE
 * @param str
 * @param word
 * @returns {string|*}
 */
function searchWordAndUpperCaseNext(str, word) {
    var n = str.search(word);

    if(n <0){return str;}

    n+= word.length;

    str = str.substr(0, n) + str.charAt(n).toUpperCase() + str.substr(n+1, str.length);

    return str;
}

/**
 * Convert key to a valid format
 * @param key
 * @returns {string}
 */
function parseKey(key)
{
    if(key == undefined)
    {
        return key;
    }

    // Store oldKey to map
    var oldKey = key;

    // Search for Abbreviations and convert
    abbreviations.forEach(function(word) {
        key = searchWordAndUpperCaseNext(key,word);
    });

    // Replace ACCENT
    key = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    // REPLACE STRANGE CHARACTER
    key = key.replace(/[^a-zA-Z0-9.]/g, "_");

    key = camelToSnake(key);

    // REPLACE MULTI _
    key = key.replace(/_+/g,"_");

    // REMOVE INITIAL _
    while(key.charAt(0) === '_')
    {
        key = key.substr(1);
    }

    // REMOVE LAST
    if(key.substr(key.length - 1) === '_')
    {
        key = key.slice(0, -1);
    }

    // REMOVE INITIAL _ INSIDE KEY
    key = key.replace("._",".");

    // UPPERCASE
    key = key.toUpperCase();

    // MAPPER
    keyMapperData+=oldKey+";"+key+"\n";

    return key;
}

/**
 * Verify key
 */
function verifyKey(key)
{
    if(key == 'Chiave')
    {
        return false;
    }

    if(key == undefined)
    {
        return false;
    }
    if(key == '')
    {
        return false;
    }

    return true;
}


/**
 * Verify and convert key and value
 * @param key
 * @param value
 * @returns {boolean}
 */
function verifyValue(value)
{
    // VERIFY

    if( value == undefined)
    {
        return false;
    }
    if( value == '')
    {
        return false;
    }

    return true;
}

/**
 *  Read input File String.csv and process it
 */
function readFile(fileName)
{
    var path = __dirname+"/";

    console.log("Reading source file:" + path+fileName);

    return new Promise((resolve, reject) => {

        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(path+fileName, {encoding: 'UCS-2'})
        });

        lineReader.on('line', function (line) {

            var data = line.split('\t');
            var key =data[0];
            var it =data[3];
            var en =data[4];

            if(verifyKey(key))
            {
                key = parseKey(key);

                // Verify items
                if(verifyValue(it)) {
                    itMergeData[key] = it;
                }

                if(verifyValue(en)) {
                    enMergeData[key] = en;
                }
            }

        });

        lineReader.on('error', function (err) {
            console.log("Process file error")
            console.log(err);
        });

        lineReader.on('close', function () {

            resolve();

        });
    });


}

/**
 * Callback write OK
 */
function dummyCallback()
{
    console.log("Write finish")
}

/**
 * Write file
 * @param name
 * @param content
 */
function writeFile(name,content)
{

    console.log("Write File: "+name);

    var fs = require('fs');
    fs.writeFile(name,content,dummyCallback);
}

// MAIN
main = function () {

    console.log("INIT TRANSLATION TOOL");

    var path = __dirname+"/../../assets/locales/"

    // Create promise
    var pStringFile = readFile("Strings.txt");
    var pDevStringFile = readFile("devStrings.txt");

    // Execute Promise
    Promise.all([pStringFile,pDevStringFile]).then(values => {
         writeFile(path+"it.json", JSON.stringify(convertNested(itMergeData), null, 2));
        // writeFile("en.json", JSON.stringify(convertNested(enMergeData), null, 2));
         writeFile(path+"en.json", JSON.stringify(convertNested(itMergeData), null, 2));

         writeFile(__dirname+"/mapper.csv", keyMapperData);
    });
}


if (require.main === module) {
    main();
}
