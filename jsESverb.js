//That file is a fork from other project: https://github.com/voldmar/conjugation
//The original file contains this license:

/*
Spanish verbs conjugation library. Based on Pythoñol (http://pythonol.sourceforge.net)

This software is distributed  free-of-charge and open source
under the terms of the Free Education Initiative License.

You should have received a copy  of this license with your copy of
this software. If you did not, you may get a copy of the
license at: http://github.com/voldmar/conjugation/blob/master/LICENSE

*/

function jsESverb() {

//Test without using complete irregular verbs list
//var irregular_verbs = {"llover": {"2pre": "llueves", "3imp": "llueva", "2imp": "llueve", "1pres": "llueva", "3pres": "llueva", "6pres": "lluevan", "6pre": "llueven", "6imp": "lluevan", "1pre": "lluevo", "2pres": "lluevas", "3pre": "llueve", "inf": "llover"}, "clarecer": {"6imp": "clarezcan", "4imp": "clarezcamos", "3imp": "clarezca", "1pres": "clarezca", "3pres": "clarezca", "6pres": "clarezcan", "1pre": "clarezco", "4pres": "clarezcamos", "2pres": "clarezcas", "inf": "clarecer", "5pres": "clarezcáis"}, "lucir": {"6imp": "luzcan", "4imp": "luzcamos", "3imp": "luzca", "1pres": "luzca", "3pres": "luzca", "6pres": "luzcan", "1pre": "luzco", "4pres": "luzcamos", "2pres": "luzcas", "inf": "lucir", "5pres": "luzcáis"}};

var reverse_irregular_verbs = {};

// We need defaultdict with list here because some verbs have same forms in various tenses
for (var verb in irregular_verbs) {
    if (irregular_verbs.hasOwnProperty(verb)) {
        for (var form in irregular_verbs[verb]) {
            if (irregular_verbs[verb].hasOwnProperty(form)) {
                var tension = irregular_verbs[verb][form];
                if (!reverse_irregular_verbs.hasOwnProperty(tension)) {
                    reverse_irregular_verbs[tension] = [verb]; //first position is the infinitve
                }
                reverse_irregular_verbs[tension].push(form); //rest of positons in array are the forms
            }
        }
    }
}

this.conjugate = function(word){
  return conjugate(word);
}

this.isVerb = function(word, showFalses){
  if(word.split(" ").length > 1){ //more than one word is compound
    return isCompound(word);
  }

  var isReg = isRegular(word);
  var isIrreg = isIrregular(word);
  var verbs = isReg.concat(isIrreg);
  var results = [];

  if(!showFalses){
    for(var i = 0; i < verbs.length; ++i){
      if(verbs[i][3]){
        results.push(verbs[i]);
      }
    }
    return results;
  }else{
    return verbs;
  }
}

function reverseSearchInRegularVerbs(word, map){
  var results = [];
  for(var prop in map) {
    if(map.hasOwnProperty(prop)) {
      if(word.endsWith(map[prop])){
        results.push(prop);
      }
    }
  }
  return results;
}

function tenseInformation(word, conjugation, tense, endings){
  var end = endings[tense];
  var infinitive = word.substring(0, word.length - end.length)+conjugation;
  var inList = verbsList.hasOwnProperty(infinitive);
  return [conjugation, tense, infinitive, inList];
}

function isCompound(words){
  var results = [];
  var word = words.split(" ");
  var form = "";

  var v = word[word.length-1];

  if(v.endsWith("ndo")){ //is gerundio
    form = secondary_conjugations_gerundio[words.slice(0,-(v.length+1))];
  } else { //is participio
    form = secondary_conjugations_participio[words.slice(0,-(v.length+1))];
  }

  if(v.endsWith("iendo")){ //could be ir or er
      var infinitiveRoot = v.slice(0,-5);
      for(var i = 0; i < form.length;++i){
        results.push(["ir", form[i], infinitiveRoot+"ir", verbsList.hasOwnProperty(infinitiveRoot+"ir")]);
        results.push(["er", form[i], infinitiveRoot+"er", verbsList.hasOwnProperty(infinitiveRoot+"er")]);
      }
  }
  if(v.endsWith("ando")){ //could be ar
      var infinitive = v.slice(0,-4)+"ar";
      for(var i = 0; i < form.length;++i){
        results.push(["ar", form[i], infinitive, verbsList.hasOwnProperty(infinitive)]);
      }
  }
  if(v.endsWith("ido")){ //could be ir or er
    var infinitiveRoot = v.slice(0,-3);
    for(var i = 0; i < form.length;++i){
      results.push(["ir", form[i], infinitiveRoot+"ir", verbsList.hasOwnProperty(infinitiveRoot+"ir")]);
      results.push(["er", form[i], infinitiveRoot+"er", verbsList.hasOwnProperty(infinitiveRoot+"er")]);
    }
  }
  if(v.endsWith("ado")){ //could be ar
    var infinitive = v.slice(0,-3)+"ar";
    for(var i = 0; i < form.length;++i){
      results.push(["ar", form[i], infinitive, verbsList.hasOwnProperty(infinitive)]);
    }
  }

  return results;
}


function isIrregular(word){
  var isIrregular = [];
  var irregulars = reverse_irregular_verbs[word];
  if(irregulars){
    var infinitive = irregulars[0];
    var conjugation = infinitive.slice(-2);
    for(var i = 1; i < irregulars.length; ++i){
      isIrregular.push([conjugation, irregulars[i], infinitive, true]);
    }
  }
  return isIrregular;
}


function isRegular(word){
  var isRegular = [];

  var ar = reverseSearchInRegularVerbs(word, ar_endings);
  for(var i = 0; i < ar.length; ++i){
    isRegular.push(tenseInformation(word, "ar", ar[i], ar_endings));
  }

  var zar = reverseSearchInRegularVerbs(word, zar_endings);
  for(var i = 0; i < zar.length; ++i){
    isRegular.push(tenseInformation(word, "ar", zar[i], zar_endings));
  }

  var car = reverseSearchInRegularVerbs(word, car_endings);
  for(var i = 0; i < car.length; ++i){
    isRegular.push(tenseInformation(word, "ar", car[i], car_endings));
  }

  var gar = reverseSearchInRegularVerbs(word, gar_endings);
  for(var i = 0; i < gar.length; ++i){
    isRegular.push(tenseInformation(word, "ar", gar[i], gar_endings));
  }

  var er = reverseSearchInRegularVerbs(word, er_endings);
  for(var i = 0; i < er.length; ++i){
    isRegular.push(tenseInformation(word, "er", er[i], er_endings));
  }

  var ir = reverseSearchInRegularVerbs(word, ir_endings);
  for(var i = 0; i < ir.length; ++i){

    isRegular.push(tenseInformation(word, "ir", ir[i], ir_endings));
  }

  return isRegular;
}



var verb_endings = [
    "ar", "er", "ir",
    "arse", "erse", "irse",
    "ár", "ér", "ír",
    "árse", "érse", "írse"
]

var ir_endings = {
    "1pre": "o", "2pre": "es", "3pre": "e",
    "4pre": "imos", "5pre": "ís", "6pre": "en",
    "1pas": "í", "2pas": "iste", "3pas": "ió",
    "4pas": "imos", "5pas": "isteis", "6pas": "ieron",
    "1fut": "iré", "2fut": "irás", "3fut": "irá",
    "4fut": "iremos", "5fut": "iréis", "6fut": "irán",
    "1cop": "ía", "2cop": "ías", "3cop": "ía",
    "4cop": "íamos", "5cop": "íais", "6cop": "ían",
    "1pos": "iría", "2pos": "irías", "3pos": "iría",
    "4pos": "iríamos", "5pos": "iríais", "6pos": "irían",
    "1pres": "a", "2pres": "as", "3pres": "a",
    "4pres": "amos", "5pres": "áis", "6pres": "an",
    "1pass": "iera", "2pass": "ieras", "3pass": "iera",
    "4pass": "iéramos", "5pass": "ierais", "6pass": "ieran",
    "1passb": "iese", "2passb": "ieses", "3passb": "iese",
    "4passb": "iésemos", "5passb": "ieseis", "6passb": "iesen",
    "1futs": "iere", "2futs": "ieres", "3futs": "iere",
    "4futs": "iéremos", "5futs": "iereis", "6futs": "ieren",
    "2imp": "e", "3imp": "a",
    "4imp": "amos", "5imp": "id", "6imp": "an",
    "gerundio": "iendo", "participio": "ido", "infinitivo":"ir"
}

var er_endings = {
    "1pre": "o", "2pre": "es", "3pre": "e",
    "4pre": "emos", "5pre": "éis", "6pre": "en",
    "1pas": "í", "2pas": "iste", "3pas": "ió",
    "4pas": "imos", "5pas": "isteis", "6pas": "ieron",
    "1fut": "eré", "2fut": "erás", "3fut": "erá",
    "4fut": "eremos", "5fut": "eréis", "6fut": "erán",
    "1cop": "ía", "2cop": "ías", "3cop": "ía",
    "4cop": "íamos", "5cop": "íais", "6cop": "ían",
    "1pos": "ería", "2pos": "erías", "3pos": "ería",
    "4pos": "eríamos", "5pos": "eríais", "6pos": "erían",
    "1pres": "a", "2pres": "as", "3pres": "a",
    "4pres": "amos", "5pres": "áis", "6pres": "an",
    "1pass": "iera", "2pass": "ieras", "3pass": "iera",
    "4pass": "iéramos", "5pass": "ierais", "6pass": "ieran",
    "1passb": "iese", "2passb": "ieses", "3passb": "iese",
    "4passb": "iésemos", "5passb": "ieseis", "6passb": "iesen",
    "1futs": "iere", "2futs": "ieres", "3futs": "iere",
    "4futs": "iéremos", "5futs": "iereis", "6futs": "ieren",
    "2imp": "e", "3imp": "a",
    "4imp": "amos", "5imp": "ed", "6imp": "an",
    "gerundio": "iendo", "participio": "ido", "infinitivo":"er"
}

var ar_endings = {
    "1pre": "o", "2pre": "as", "3pre": "a",
    "4pre": "amos", "5pre": "áis", "6pre": "an",
    "1pas": "é", "2pas": "aste", "3pas": "ó",
    "4pas": "amos", "5pas": "steis", "6pas": "aron",
    "1fut": "aré", "2fut": "arás", "3fut": "ará",
    "4fut": "aremos", "5fut": "aréis", "6fut": "arán",
    "1cop": "aba", "2cop": "abas", "3cop": "aba",
    "4cop": "ábamos", "5cop": "abais", "6cop": "aban",
    "1pos": "aría", "2pos": "arías", "3pos": "aría",
    "4pos": "aríamos", "5pos": "aríais", "6pos": "arían",
    "1pres": "e", "2pres": "es", "3pres": "e",
    "4pres": "emos", "5pres": "éis", "6pres": "en",
    "1pass": "ara", "2pass": "aras", "3pass": "ara",
    "4pass": "áramos", "5pass": "arais", "6pass": "aran",
    "1passb": "ase", "2passb": "ases", "3passb": "ase",
    "4passb": "ásemos", "5passb": "aseis", "6passb": "asen",
    "1futs": "are", "2futs": "ares", "3futs": "are",
    "4futs": "áremos", "5futs": "areis", "6futs": "aren",
    "2imp": "a", "3imp": "e",
    "4imp": "emos", "5imp": "ad", "6imp": "en",
    "gerundio": "ando", "participio": "ado", "infinitivo":"ar"
}

var zar_endings = {
    "1pas": "cé",
    "1pres": "ce", "2pres": "ces", "3pres": "ce",
    "4pres": "cemos", "5pres": "céis", "6pres": "cen",
    "3imp": "ce", "4imp": "cemos", "6imp": "cen"
}

var car_endings={
    "1pas": "qué",
    "1pres": "que", "2pres": "ques", "3pres": "que",
    "4pres": "quemos", "5pres": "quéis", "6pres": "quen",
    "3imp": "que", "4imp": "quemos", "6imp": "quen"
}

var gar_endings={
    "1pas": "ué",
    "1pres": "ue", "2pres": "ues", "3pres": "ue",
    "4pres": "uemos", "5pres": "uéis", "6pres": "uen",
    "3imp": "ue", "4imp": "uemos", "6imp": "uen"
}


var secondary_conjugations_gerundio = {};
secondary_conjugations_gerundio['estoy'] = ['1ppro'];
secondary_conjugations_gerundio['estás'] = ['2ppro'];
secondary_conjugations_gerundio['está'] = ['3ppro'];
secondary_conjugations_gerundio['estamos'] = ['4ppro'];
secondary_conjugations_gerundio['estáis'] = ['5ppro'];
secondary_conjugations_gerundio['están'] = ['6ppro'];
secondary_conjugations_gerundio['estaré'] = ['1fpro'];
secondary_conjugations_gerundio['estarás'] = ['2fpro'];
secondary_conjugations_gerundio['estará'] = ['3fpro'];
secondary_conjugations_gerundio['estaremos'] = ['4fpro'];
secondary_conjugations_gerundio['estaréis'] = ['5fpro'];
secondary_conjugations_gerundio['estarán'] = ['6fpro'];
secondary_conjugations_gerundio['habré estado'] = ['1fpp'];
secondary_conjugations_gerundio['habrás estado'] = ['2fpp'];
secondary_conjugations_gerundio['habrá estado'] = ['3fpp'];
secondary_conjugations_gerundio['habremos estado'] = ['4fpp'];
secondary_conjugations_gerundio['habréis estado'] = ['5fpp'];
secondary_conjugations_gerundio['habrán estado'] = ['6fpp'];
secondary_conjugations_gerundio['he estado'] = ['1ppp'];
secondary_conjugations_gerundio['has estado'] = ['2ppp'];
secondary_conjugations_gerundio['ha estado'] = ['3ppp'];
secondary_conjugations_gerundio['hemos estado'] = ['4ppp'];
secondary_conjugations_gerundio['habéis estado'] = ['5ppp'];
secondary_conjugations_gerundio['han estado'] = ['6ppp'];
secondary_conjugations_gerundio['habría estado'] = ['1cpp', '3cpp'];
secondary_conjugations_gerundio['habrías estado'] = ['2cpp'];
secondary_conjugations_gerundio['habríamos estado'] = ['4cpp'];
secondary_conjugations_gerundio['habríais estado'] = ['5cpp'];
secondary_conjugations_gerundio['habrían estado'] = ['6cpp'];
secondary_conjugations_gerundio['estaba'] = ['1ip', '3ip'];
secondary_conjugations_gerundio['estabas'] = ['2ip'];
secondary_conjugations_gerundio['estábamos'] = ['4ip'];
secondary_conjugations_gerundio['estabais'] = ['5ip'];
secondary_conjugations_gerundio['estaban'] = ['6ip'];

var secondary_conjugations_participio = {};
secondary_conjugations_participio['he'] = ['1pp'];
secondary_conjugations_participio['has'] = ['2pp'];
secondary_conjugations_participio['ha'] = ['3pp'];
secondary_conjugations_participio['hemos'] = ['4pp'];
secondary_conjugations_participio['habéis'] = ['5pp'];
secondary_conjugations_participio['han'] = ['6pp'];
secondary_conjugations_participio['había'] = ['1pasp','3pasp'];
secondary_conjugations_participio['habías'] = ['2pasp'];
secondary_conjugations_participio['habíamos'] = ['4pasp'];
secondary_conjugations_participio['habíais'] = ['5pasp'];
secondary_conjugations_participio['habían'] = ['6pasp'];
secondary_conjugations_participio['hube'] = ['1prep'];
secondary_conjugations_participio['hubiste'] = ['2prep'];
secondary_conjugations_participio['hubo'] = ['3prep'];
secondary_conjugations_participio['hubimos'] = ['4prep'];
secondary_conjugations_participio['hubisteis'] = ['5prep'];
secondary_conjugations_participio['hubieron'] = ['6prep'];
secondary_conjugations_participio['habré'] = ['1futp'];
secondary_conjugations_participio['habrás'] = ['2futp'];
secondary_conjugations_participio['habrá'] = ['3futp'];
secondary_conjugations_participio['habremos'] = ['4futp'];
secondary_conjugations_participio['habréis'] = ['5futp'];
secondary_conjugations_participio['habrán'] = ['6futp'];
secondary_conjugations_participio['habría'] = ['1conp','3conp'];
secondary_conjugations_participio['habrías'] = ['2conp'];
secondary_conjugations_participio['habríamos'] = ['4conp'];
secondary_conjugations_participio['habríais'] = ['5conp'];
secondary_conjugations_participio['habrían'] = ['6conp'];
secondary_conjugations_participio['hubiere'] = ['1fps','3fps'];
secondary_conjugations_participio['hubieres'] = ['2fps'];
secondary_conjugations_participio['hubiéremos'] = ['4fps'];
secondary_conjugations_participio['hubiéreis'] = ['5fps'];
secondary_conjugations_participio['hubieren'] = ['6fps'];
secondary_conjugations_participio['hubiera'] = ['1pastps','3pastps'];
secondary_conjugations_participio['hubieras'] = ['2pastps'];
secondary_conjugations_participio['hubiéramos'] = ['4pastps'];
secondary_conjugations_participio['hubierais'] = ['5pastps'];
secondary_conjugations_participio['hubieran'] = ['6pastps'];
secondary_conjugations_participio['haya'] = ['1presps','3presps'];
secondary_conjugations_participio['hayas'] = ['2presps'];
secondary_conjugations_participio['hayamos'] = ['4presps'];
secondary_conjugations_participio['hayáis'] = ['5presps'];
secondary_conjugations_participio['hayan'] = ['6presps'];


var isVerb = function (str) {
    for (var i = verb_endings.length - 1; i >= 0; --i) {
        if (str.endsWith(verb_endings[i])) {
            return true;
        }
    }
    return false;
}

var getRoot = function (verb) {
    for (var i = verb_endings.length - 1; i >= 0; --i) {
        if (verb.endsWith(verb_endings[i])) {
            return verb.substring(0, verb.length - verb_endings[i].length);
        }
    }
    return null;
}

var items = function(dict) {
    var items = [];
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            items.push([key, dict[key]]);
        }
    }
    return items;
}

var update = function(dict, other) {
    if (other instanceof Array) {
        for (var i = other.length - 1; i >= 0; i) {
            if (other[i].length != 2) {
                throw "other array must contain pairs of [key, value]";
            }
            dict[other[i][0]] = other[i][1];
        }
        return
    }
    if (other instanceof Object) {
        for (var key in other) {
            if (other.hasOwnProperty(key)) {
                dict[key] = other[key];
            }
        }
    }
}

function isReflexive(full_word){
  return full_word.endsWith("se");
}



function conjugate(full_word) {
    full_word = full_word.toLowerCase().trim();
    if (!isVerb(full_word)) {
        return null;
    }

    var reflexive = isReflexive(full_word);
    var base = reflexive ? full_word.substring(0, full_word.length - 2) : full_word;
    var root = getRoot(full_word);
    var conjugations = {};

    // TODO: rename foo to something reasonable
    function foo (root, endings) {
        var tenses = {};
        for (var type in endings) {
            if (endings.hasOwnProperty(type)) {
                tenses[type] = root + endings[type];
            }
        }
        return tenses;
    }

    if (base.endsWith("ir") || base.endsWith("ír")) {
        update(conjugations, foo(root, ir_endings));
    }
    if (base.endsWith("er") || base.endsWith("ér")) {
        update(conjugations, foo(root, er_endings));
    }
    if (base.endsWith("ar") || base.endsWith("ár")) {
        update(conjugations, foo(root, ar_endings));
        var _root = root.slice(0, root.length - 1);
        if (base.endsWith("zar")) {
            update(conjugations, foo(_root, zar_endings));
        }
        if (base.endsWith("gar")) {
            update(conjugations, foo(_root, gar_endings));
        }
        if (base.endsWith("car")) {
            update(conjugations, foo(_root, car_endings));
        }
    }

    if (irregular_verbs.hasOwnProperty(base)) {
        update(conjugations, irregular_verbs[base]);
    }

    if (reflexive) {
        var _items = items(conjugations);
        for (var i = _items.length - 1; i >= 0; i--) {
            var type = _items[i][0];
            var form = _items[i][1];

            if (type === "2imp") {
                conjugations[type] = form + "te";
                continue;
            }

            var index = +type.charAt(0);
            if (isNaN(index)) {
                continue;
            }

            conjugations[type] = [null, "me", "te", "se", "nos", "os", "se"][index] + " " + form;
        }
    }

    secondary_conjugations(conjugations, base, reflexive);

    // negative imperatives:
    if (conjugations.hasOwnProperty("2pres")) {
        conjugations["2impn"] = "no " + conjugations["2pres"];
    }
    if (conjugations.hasOwnProperty("3pres")) {
        conjugations["3impn"] = "no " + conjugations["3pres"];
    }
    if (conjugations.hasOwnProperty("4pres")) {
        conjugations["4impn"] = "no " + conjugations["4pres"];
    }
    if (conjugations.hasOwnProperty("5pres")) {
        conjugations["5impn"] = "no " + conjugations["5pres"];
    }
    if (conjugations.hasOwnProperty("6pres")) {
        conjugations["6impn"] = "no " + conjugations["6pres"];
    }

    return conjugations;
}

function secondary_conjugations(conjugations, base, reflexive){;
  //conjugations = {};
  rdict = {'1': '', '2': '', '3': '', '4': '', '5': '', '6': ''};
  if(reflexive){
    rdict = {
        '1': 'me ', '2': 'te ', '3': 'se ',
        '4': 'nos ', '5': 'os ', '6': 'se ',
    };
  }

  conjugations['1fpop'] = rdict['1'] + 'voy a ' + base;
  conjugations['2fpop'] = rdict['2'] + 'vas a ' + base;
  conjugations['3fpop'] = rdict['3'] + 'va a ' + base;
  conjugations['4fpop'] = rdict['4'] + 'vamos a ' + base;
  conjugations['5fpop'] = rdict['5'] + 'vais a ' + base;
  conjugations['6fpop'] = rdict['6'] + 'van a ' + base;
  if(conjugations.hasOwnProperty('gerundio')){
    // present progressive;
    conjugations['1ppro'] = rdict['1'] + 'estoy ' + conjugations['gerundio'];
    conjugations['2ppro'] = rdict['2'] + 'estás ' + conjugations['gerundio'];
    conjugations['3ppro'] = rdict['3'] + 'está ' + conjugations['gerundio'];
    conjugations['4ppro'] = rdict['4'] + 'estamos ' + conjugations['gerundio'];
    conjugations['5ppro'] = rdict['5'] + 'estáis ' + conjugations['gerundio'];
    conjugations['6ppro'] = rdict['6'] + 'están ' + conjugations['gerundio'];
    // future progressive;
    conjugations['1fpro'] = rdict['1'] + 'estaré ' + conjugations['gerundio'];
    conjugations['2fpro'] = rdict['2'] + 'estarás ' + conjugations['gerundio'];
    conjugations['3fpro'] = rdict['3'] + 'estará ' + conjugations['gerundio'];
    conjugations['4fpro'] = rdict['4'] + 'estaremos ' + conjugations['gerundio'];
    conjugations['5fpro'] = rdict['5'] + 'estaréis ' + conjugations['gerundio'];
    conjugations['6fpro'] = rdict['6'] + 'estarán ' + conjugations['gerundio'];
    // future perfect progressive;
    conjugations['1fpp'] = rdict['1'] + 'habré estado ' + conjugations['gerundio'];
    conjugations['2fpp'] = rdict['2'] + 'habrás estado ' + conjugations['gerundio'];
    conjugations['3fpp'] = rdict['3'] + 'habrá estado ' + conjugations['gerundio'];
    conjugations['4fpp'] = rdict['4'] + 'habremos estado ' + conjugations['gerundio'];
    conjugations['5fpp'] = rdict['5'] + 'habréis estado ' + conjugations['gerundio'];
    conjugations['6fpp'] = rdict['6'] + 'habrán estado ' + conjugations['gerundio'];
    // present perfect progressive;
    conjugations['1ppp'] = rdict['1'] + 'he estado ' + conjugations['gerundio'];
    conjugations['2ppp'] = rdict['2'] + 'has estado ' + conjugations['gerundio'];
    conjugations['3ppp'] = rdict['3'] + 'ha estado ' + conjugations['gerundio'];
    conjugations['4ppp'] = rdict['4'] + 'hemos estado ' + conjugations['gerundio'];
    conjugations['5ppp'] = rdict['5'] + 'habéis estado ' + conjugations['gerundio'];
    conjugations['6ppp'] = rdict['6'] + 'han estado ' + conjugations['gerundio'];
    // conditional perfect progressive;
    conjugations['1cpp'] = rdict['1'] + 'habría estado ' + conjugations['gerundio'];
    conjugations['2cpp'] = rdict['2'] + 'habrías estado ' + conjugations['gerundio'];
    conjugations['3cpp'] = rdict['3'] + 'habría estado ' + conjugations['gerundio'];
    conjugations['4cpp'] = rdict['4'] + 'habríamos estado ' + conjugations['gerundio'];
    conjugations['5cpp'] = rdict['5'] + 'habríais estado ' + conjugations['gerundio'];
    conjugations['6cpp'] = rdict['6'] + 'habrían estado ' + conjugations['gerundio'];
    // imperfect progressive;
    conjugations['1ip'] = rdict['1'] + 'estaba ' + conjugations['gerundio'];
    conjugations['2ip'] = rdict['2'] + 'estabas ' + conjugations['gerundio'];
    conjugations['3ip'] = rdict['3'] + 'estaba ' + conjugations['gerundio'];
    conjugations['4ip'] = rdict['4'] + 'estábamos ' + conjugations['gerundio'];
    conjugations['5ip'] = rdict['5'] + 'estabais ' + conjugations['gerundio'];
    conjugations['6ip'] = rdict['6'] + 'estaban ' + conjugations['gerundio'];
  }

  if(conjugations.hasOwnProperty('participio')){
    // present perfect;
    conjugations['1pp'] = rdict['1'] + 'he ' + conjugations['participio'];
    conjugations['2pp'] = rdict['2'] + 'has ' + conjugations['participio'];
    conjugations['3pp'] = rdict['3'] + 'ha ' + conjugations['participio'];
    conjugations['4pp'] = rdict['4'] + 'hemos ' + conjugations['participio'];
    conjugations['5pp'] = rdict['5'] + 'habéis ' + conjugations['participio'];
    conjugations['6pp'] = rdict['6'] + 'han ' + conjugations['participio'];
    // past perfect;
    conjugations['1pasp'] = rdict['1'] + 'había ' + conjugations['participio'];
    conjugations['2pasp'] = rdict['2'] + 'habías ' + conjugations['participio'];
    conjugations['3pasp'] = rdict['3'] + 'había ' + conjugations['participio'];
    conjugations['4pasp'] = rdict['4'] + 'habíamos ' + conjugations['participio'];
    conjugations['5pasp'] = rdict['5'] + 'habíais ' + conjugations['participio'];
    conjugations['6pasp'] = rdict['6'] + 'habían ' + conjugations['participio'];
    // preterit perfect;
    conjugations['1prep'] = rdict['1'] + 'hube ' + conjugations['participio'];
    conjugations['2prep'] = rdict['2'] + 'hubiste ' + conjugations['participio'];
    conjugations['3prep'] = rdict['3'] + 'hubo ' + conjugations['participio'];
    conjugations['4prep'] = rdict['4'] + 'hubimos ' + conjugations['participio'];
    conjugations['5prep'] = rdict['5'] + 'hubisteis ' + conjugations['participio'];
    conjugations['6prep'] = rdict['6'] + 'hubieron ' + conjugations['participio'];
    // future perfect;
    conjugations['1futp'] = rdict['1'] + 'habré ' + conjugations['participio'];
    conjugations['2futp'] = rdict['2'] + 'habrás ' + conjugations['participio'];
    conjugations['3futp'] = rdict['3'] + 'habrá ' + conjugations['participio'];
    conjugations['4futp'] = rdict['4'] + 'habremos ' + conjugations['participio'];
    conjugations['5futp'] = rdict['5'] + 'habréis ' + conjugations['participio'];
    conjugations['6futp'] = rdict['6'] + 'habrán ' + conjugations['participio'];
    // conditional perfect;
    conjugations['1conp'] = rdict['1'] + 'habría ' + conjugations['participio'];
    conjugations['2conp'] = rdict['2'] + 'habrías ' + conjugations['participio'];
    conjugations['3conp'] = rdict['3'] + 'habría ' + conjugations['participio'];
    conjugations['4conp'] = rdict['4'] + 'habríamos ' + conjugations['participio'];
    conjugations['5conp'] = rdict['5'] + 'habríais ' + conjugations['participio'];
    conjugations['6conp'] = rdict['6'] + 'habrían ' + conjugations['participio'];
    // future perfect subjunctive;
    conjugations['1fps'] = rdict['1'] + 'hubiere ' + conjugations['participio'];
    conjugations['2fps'] = rdict['2'] + 'hubieres ' + conjugations['participio'];
    conjugations['3fps'] = rdict['3'] + 'hubiere ' + conjugations['participio'];
    conjugations['4fps'] = rdict['4'] + 'hubiéremos ' + conjugations['participio'];
    conjugations['5fps'] = rdict['5'] + 'hubiéreis ' + conjugations['participio'];
    conjugations['6fps'] = rdict['6'] + 'hubieren ' + conjugations['participio'];
    // present perfect subjunctive;
    conjugations['1pastps'] = rdict['1'] + 'hubiera ' + conjugations['participio'];
    conjugations['2pastps'] = rdict['2'] + 'hubieras ' + conjugations['participio'];
    conjugations['3pastps'] = rdict['3'] + 'hubiera ' + conjugations['participio'];
    conjugations['4pastps'] = rdict['4'] + 'hubiéramos ' + conjugations['participio'];
    conjugations['5pastps'] = rdict['5'] + 'hubierais ' + conjugations['participio'];
    conjugations['6pastps'] = rdict['6'] + 'hubieran ' + conjugations['participio'];
    // present perfect subjunctive;
    conjugations['1presps'] = rdict['1'] + 'haya ' + conjugations['participio'];
    conjugations['2presps'] = rdict['2'] + 'hayas ' + conjugations['participio'];
    conjugations['3presps'] = rdict['3'] + 'haya ' + conjugations['participio'];
    conjugations['4presps'] = rdict['4'] + 'hayamos ' + conjugations['participio'];
    conjugations['5presps'] = rdict['5'] + 'hayáis ' + conjugations['participio'];
    conjugations['6presps'] = rdict['6'] + 'hayan ' + conjugations['participio'];
  }

  return conjugations;
}


}
