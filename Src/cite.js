"use strict";
var Zotero = {"Cite":{}};

/**
 * Get a CSL abbreviation in the format expected by citeproc-js
 */
Zotero.Cite.getAbbreviation = new function() {
	var abbreviations,
		abbreviationCategories;

	/**
	 * Initialize abbreviations database.
	 */
	function init() {
		if(!abbreviations) loadAbbreviations();
	}

	function loadAbbreviations() {
		abbreviations = ZAFQ.abbreviations;
		abbreviationCategories = {};
		for(var jurisdiction in abbreviations) {
			for(var category in abbreviations[jurisdiction]) {
				abbreviationCategories[category] = true;
			}
		}
	}
	
	/**
	 * Normalizes a key
	 */
	function normalizeKey(key) {
		// Strip periods, normalize spacing, and convert to lowercase
		return key.toString().
			replace(/(?:\b|^)(?:and|et|y|und|l[ae]|the|[ld]')(?:\b|$)|[\x21-\x2C.\/\x3A-\x40\x5B-\x60\\\x7B-\x7E]/ig, "").
			replace(/\s+/g, " ").trim();
	}

	function lookupKey(key) {
		return key.toLowerCase().replace(/\s*\./g, "." );
	}
	
	/**
	 * Replace getAbbreviation on citeproc-js with our own handler.
	 */
	return function getAbbreviation(listname, obj, jurisdiction, category, key) {
		init();

		// Short circuit if we know we don't handle this kind of abbreviation
		if(!abbreviationCategories[category] && !abbreviationCategories[category+"-word"]) return;

		var normalizedKey = normalizeKey(key),
			lcNormalizedKey = lookupKey(normalizedKey),
			abbreviation;
		if(!normalizedKey) return;
		
		var jurisdictions = ["default"];
		if(jurisdiction !== "default" && abbreviations[jurisdiction]) {
			jurisdictions.unshift(jurisdiction);
		}

		// Look for full abbreviation
		var jur, cat;
		for(var i=0; i<jurisdictions.length && !abbreviation; i++) {
			if((jur = abbreviations[jurisdictions[i]]) && (cat = jur[category])) {
				abbreviation = cat[lcNormalizedKey];
			}
		}

		if(!abbreviation) {
			// Abbreviate words individually
			var words = normalizedKey.split(/([ \-])/);

			if(words.length > 1) {
				var lcWords = [];
				for(var j=0; j<words.length; j+=2) {
					lcWords[j] = lookupKey(words[j]);
				}
				for(var j=0; j<words.length; j+=2) {
					var word = words[j],
						lcWord = lcWords[j],
						newWord = undefined,
						exactMatch = false;
					
					for(var i=0; i<jurisdictions.length && newWord === undefined; i++) {
						if(!(jur = abbreviations[jurisdictions[i]])) continue;
						if(!(cat = jur[category+"-word"])) continue;
						
						if(cat.hasOwnProperty(lcWord)) {
							// Complete match
							newWord = cat[lcWord];
							exactMatch = true;
						} else if(lcWord.charAt(lcWord.length-1) == 's' && cat.hasOwnProperty(lcWord.substr(0, lcWord.length-1))) {
							// Try dropping 's'
							newWord = cat[lcWord.substr(0, lcWord.length-1)];
							exactMatch = true;
						} else {
							if(j < words.length-2) {
								// Two-word match
								newWord = cat[lcWord+words[j+1]+lcWords[j+2]];
								if(newWord !== undefined) {
									words.splice(j+1, 2);
									lcWords.splice(j+1, 2);
									exactMatch = true;
								}
							}

							if(newWord === undefined) {
								// Partial match
								for(var k=lcWord.length; k>0 && newWord === undefined; k--) {
									newWord = cat[lcWord.substr(0, k)+"-"];
								}
							}
						}
					}
					
					// Don't substitute with a longer word
					if(newWord && !exactMatch && word.length - newWord.length < 1) {
						newWord = word;
					}
					
					// Fall back to full word
					if(newWord === undefined) newWord = word;
					
					// Don't discard last word (e.g. Climate of the Past => Clim. Past)
					if(!newWord && j == words.length-1) newWord = word;
					
					words[j] = newWord.substr(0, 1).toUpperCase() + newWord.substr(1);
				}
				abbreviation = words.join("").replace(/\s+/g, " ").trim();
			} else {
				abbreviation = key;
			}
		}

		if(!abbreviation) abbreviation = key; //this should never happen, but just in case
		
		//Zotero.debug("Abbreviated "+key+" as "+abbreviation);
		
		// Add to jurisdiction object
		if(!obj[jurisdiction]) {
			obj[jurisdiction] = new Zotero.CiteProc.CSL.AbbreviationSegments();
		}
		obj[jurisdiction][category][key] = abbreviation;
	}
}
