# TranslationTool

* Generate ".json" language files and copy to "assets/locales/*" dir

## How to use

The tool has two input files: Strings.csv and devStrings.csv

Strings.csv comes from functional documents (Strings.xls)
devStrings.csv it is for developers exclusive use.

File format:

KEY ; TYPE ; IT ; EN

Eg:

DASHBOARD.TITLE;string;Pannello;Home

Output:

assets/locales/it.json

assets/locales/en.json

mapper.json

Data parser

1. Replace ACCENT
2. Replace STRANGE CHARACTERS TO _
3. camelToSnake
4. Replace multiples _
5. Remove initial _
6. Remove last _
7. To uppercase

Eg:

FROM:

  {}! " èàùì á ó The paret.child.newchild  ![]{} 123   camelCaseTest TestCamelSnake ___  new___  string!!!_____

TO:
  
EAUI_A_O_THE_PARET.CHILD.NEWCHILD_123_CAMEL_CASE_TEST_TEST_CAMEL_SNAKE_NEW_STRING

    

### Create Strings.csv

1. Open Strings.xls
2. Export as CSV (not UTF8)
3. Copy Strings.csv to tools/translationTool/

###EXECUTE

#### NPM RUN
* Execute: npm run generateStrings

#### CMD

* Install node
* Go to translationTool folder
* Execute: node translationTool.js

## TODO

* Generate "en.json": Comment line 224 and uncomment line 223
