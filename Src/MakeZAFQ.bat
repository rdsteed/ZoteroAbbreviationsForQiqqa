Rem MakeZTFQ.bat combines abbreviations.json and cite.js into single wrapper file ztfq.js
echo Zotero = {Cite:{}}; > temp1
echo Zotero.abbreviations =  >> temp1
echo ; > temp2
echo ZAFQ = {}; > temp3
echo ZAFQ.getAbbreviation = Zotero.Cite.getAbbreviation; >> temp3
copy /b temp1+abbreviations.json+temp2+cite.js+temp3 zafq.js
erase temp1 temp2 temp3
