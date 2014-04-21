ZoteroAbbreviationsForQiqqa
===========================
This project consists of two parts.

1.  A wrapper around modified code extracted from Zotero to create an abbreviation function suitable for calling from citeproc-js.

2.  Patches to Qiqqa to include and call the modified code.

This project represents individual effort of a Qiqqa user to add abbreviation to his version of Qiqqa and is presented for educational purposes only.  The files run_incite.js and runengine.html are copyrighted by Quantisle Ltd. and are presented for illustration only to show how I personally modified Qiqqa for my own use.  In no way should their inclusion on this site be construed to suggest they are released under any form of the GPL or similar license.

All other files represent my own efforts based on Zotero and released under the AGPL license as permitted.

To make Zotero style abbreviations in Qiqqa, I do the following in my directory, C:\Program Files (x86)\Qiqqa\InCite\resources :

1.  Modified Qiqqa files runengine.html to include zafq.js
2.  Modified run_incite.js to provide ZAFQ.getAbbreviation() for citeproc-js.
2.  Added the file zafq.js to provide the ZAFQ.getAbbreviation() function by wrapping abbreviation definitions and code from Zotero.

This seems to work well, but has only been tested with version 61a of Qiqqa, which uses a recent version of citeproc-js (v1.0.533).  Qiqqa has announced plans for this version of citeproc-js to be included in version 62.

Bottom line:  I copy zafq.js, runengine.html, and run_incite.js from src to C:\Program Files (x86)\Qiqqa\InCite\resources and I now have Zotero's automatic abbreviations in Qiqqa.
