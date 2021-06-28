/*
Title: CFG to CNF Simulator
Author: Mohammad Imam Hossain
Date: 28/06/2021
All rights reserved.
*/

/* ------------------------------ set of terminals validation --------------------------------- */
var terminals = document.getElementById('terminals');
terminals.addEventListener('keyup', checkterminals);

/* ------------------------- return true if valid, otherwise false ---------------------------- */
function validateterminals() {
    var curvalue = terminals.value;
    var re = /^\s*[a-z]\s*(,\s*[a-z]\s*)*$/;
    if (re.test(curvalue)) {
        return true;
    } else {
        return false;
    }
}

function checkterminals() {
    var result = validateterminals();
    if (result == true) {
        terminals.classList.remove("is-invalid");
    } else {
        terminals.classList.add("is-invalid");
    }
    testallRSrules();
}

/* ------------------------ to generate all the terminals as a list ------------------------------------------------ */
function genterminalslist() {
    if (validateterminals() == true) {
        var curterminals = terminals.value;
        var terminallist = curterminals.split(',');
        var trimmedterminallist = terminallist.map(function(item) { return item.trim(); });
        return trimmedterminallist;
    } else {
        return [];
    }

}

/* -------------------------------------- set of variables validation -------------------------------- */
var vars = document.getElementById('vars');
vars.addEventListener('keyup', checkvars);

/* ------------------------- return trye if valid, otherwise false ----------------------------------- */
function validatevars() {
    var curvalue = vars.value;
    var re = /^\s*[A-Z]\s*(,\s*[A-Z]\s*)*$/;
    if (re.test(curvalue)) {
        return true;
    } else {
        return false;
    }
}

function checkvars() {
    var result = validatevars();
    if (result == true) {
        configurealldropdown(); ///updating all the dropdown box accordingly
        vars.classList.remove("is-invalid");
    } else {
        clearalldropdown();
        vars.classList.add("is-invalid");
    }
    testallRSrules();
}

/* ------------------------- generate all the variables as a list --------------------------------------------------- */
function genvarslist() {
    if (validatevars() == true) {
        var curvars = vars.value;
        var varlist = curvars.split(',');
        var trimmedvarlist = varlist.map(function(item) { return item.trim(); });
        return trimmedvarlist;
    } else {
        return [];
    }

}

/* ----------------------- to generate full list of variables, terminals, epsilon and | charater ------------------------------------------ */
function genallsymbolslist() {
    var varlist = genvarslist();
    var terminallist = genterminalslist();

    var alllist = [];
    alllist = alllist.concat(varlist);
    alllist = alllist.concat(terminallist);
    alllist.push("|");
    alllist.push(String.fromCharCode(949));

    return alllist;
}

var startvar = document.getElementById("startvar");
/* ------------------------- will check whether a start variable was chosen or not ----------------------------- */
function validatestartvar() {
    var startvarval = startvar.value;
    if (!startvarval) {
        return false;
    } else {
        return true;
    }
}

/* ----------------------------- updating all the dropdown internal options ------------------------------------ */
function configurealldropdown() {
    var optionsstr = gendropdowncode();

    ///start variable dropdown
    var startvar = document.getElementById('startvar');
    startvar.innerHTML = optionsstr;

    ///rule board dropdown
    var ruledropdowns = document.querySelectorAll('.rule select');
    for (var ind in ruledropdowns) {
        var eachdropdown = ruledropdowns[ind];
        eachdropdown.innerHTML = optionsstr;
    }
}

/* ---------------------------- clearing all the dropdown internal options --------------------------------------- */
function clearalldropdown() {
    ///start variable dropdown
    var startvar = document.getElementById('startvar');
    startvar.innerHTML = "";

    ///all the rule board dropdowns
    var ruledropdowns = document.querySelectorAll('.rule select');
    for (var ind in ruledropdowns) {
        var eachdropdown = ruledropdowns[ind];
        eachdropdown.innerHTML = "";
    }
}

/* -------------------------- will dynamically generate all the dropdowns internal options html code ------------------------------------------ */
function gendropdowncode() {
    var trimmedvarlist = genvarslist();

    ///initializing the dropdown box
    var dropdownoptions = "";
    for (var itemind in trimmedvarlist) {
        var item = trimmedvarlist[itemind];
        if (item != "") {
            var inneroption = document.createElement('option');
            inneroption.value = item;
            inneroption.innerText = item;

            dropdownoptions += inneroption.outerHTML;
        }
    }
    return dropdownoptions;
}

var addnewbtn = document.getElementById('addnewbtn');
addnewbtn.addEventListener('click', addnewfield);

///calling for showing the default first rule
addnewfield();

/* ------------------------------- will show extra html rule fields for new rule entry --------------------------------------------- */
function addnewfield() {
    var ruleboard = document.getElementById('ruleboard');

    var optionstr = gendropdowncode();

    var childelm = document.createElement('div'); ///each new rule will be within a div element
    childelm.classList.add("rule", "row", "g-0");
    childelm.innerHTML = '<div class="col-lg-3"><select class="form-select left">' + optionstr + '</select></div>';
    childelm.innerHTML += '<div class="col-lg-2 text-center"><i class="fas fa-long-arrow-alt-right" style="font-size:300%; color:#666699;"></i></div>';
    childelm.innerHTML += '<div class="col-lg-6"><input type="text" class="rightside form-control d-block" onkeyup="validateRS(event);"><div class="form-text">Type <code>&lt;ep&gt;</code> for &epsilon;.</div></div>';
    childelm.innerHTML += '<div class="col-lg-1 text-center"><i class="fas fa-trash-alt pt-2" style="color:#ff3385;font-size:130%;" onclick="deleterule(event);"></i></div>';

    ruleboard.appendChild(childelm);
}

/* ------------------------------- this function validates each right hand side rule --------------------------------------------- */
function validateRS(e) {
    var textfield = e.target;
    var values = textfield.value;

    ///finding out <ep> and replacing with epsilon character
    var newvalue = values.replace(/<ep>/g, String.fromCharCode(949));
    textfield.value = newvalue;

    ///checking for valid right side
    return testallRSrules();
}

/* ------------------------------ test validity for all the rules right side portion ---------------------------------------------- */
function testallRSrules() {
    var allsymbolarr = genallsymbolslist();

    ///accessing all rules right side
    var rsrules = document.querySelectorAll('.rule .rightside');
    var globalflag = true;
    for (var ind = 0; ind < rsrules.length; ind++) {
        var eachrs = rsrules[ind].value;

        if (!eachrs) {
            rsrules[ind].classList.add('is-invalid');
            globalflag = false;
        } else {
            var flag = true;
            for (var ind1 in eachrs) {
                var curchar = eachrs[ind1];
                if (curchar != " " && allsymbolarr.indexOf(curchar) == -1) {
                    flag = false;
                    break;
                }
            }

            ///can't start and end with | char
            if (eachrs.startsWith('|') || eachrs.endsWith("|")) {
                flag = false;
            }

            if (flag == false) {
                rsrules[ind].classList.add('is-invalid');
                globalflag = false;
            } else {
                rsrules[ind].classList.remove('is-invalid');
            }
        }
    }
    return globalflag;
}

/* ----------------------------- delete the current rule field ----------------------------------------------- */
function deleterule(e) {
    var delbtn = e.target;
    var rulediv = delbtn.parentNode.parentNode;
    console.log(rulediv);

    var ruleboard = document.getElementById('ruleboard');
    ruleboard.removeChild(rulediv);
}

/* ----------------------------- building a rule object containing all the rules ----------------------------- */
function buildRuleObj() {
    var RuleObj = {}; ///an object of the form: {"variable1":["rspart1","rspart2"], "variable2":["rspart1","rspart2"]}

    ///rule board traversing
    var rules = document.querySelectorAll('.rule');
    for (var ind = 0; ind < rules.length; ind++) {
        var leftpart = rules[ind].childNodes[0].firstChild.value;
        var rightpart = rules[ind].childNodes[2].firstChild.value;

        ///console.log(leftpart);
        ///console.log(rightpart);

        ///checking for key existance
        var rulekeys = Object.keys(RuleObj);
        if (rulekeys.indexOf(leftpart) == -1) {
            RuleObj[leftpart] = []; ///new rule
        }

        var splitRS = rightpart.split('|');
        var trimmedsplitRS = splitRS.map(function(item) { return item.trim(); });
        for (var rs in trimmedsplitRS) {
            RuleObj[leftpart].push(trimmedsplitRS[rs]);
        }
    }

    console.log(RuleObj);
    return RuleObj;
}

/* ---------------------------------- this function will stepwise call each of the 4 steps of conversion ------------------------------------ */
function convert() {
    if (validatevars() == false) {
        vars.classList.add("is-invalid");
    }
    if (validateterminals() == false) {
        terminals.classList.add("is-invalid");
    }
    testallRSrules();

    if (validatevars() && validateterminals() && validatestartvar() && testallRSrules()) {
        var RuleObj = buildRuleObj();

        var RuleObj1 = step1(RuleObj);
        showstep(RuleObj1, 'step1');

        var RuleObj2 = step2(RuleObj1);
        showstep(RuleObj2, 'step2');

        var RuleObj3 = step3(RuleObj2);
        console.log(RuleObj3);
        showstep(RuleObj3, 'step3');

        var RuleObj4 = step4(RuleObj3);
        console.log(RuleObj4);
        showstep(RuleObj4, 'step4');
    } else {
        alert("Invalid Context Free Grammar!");
    }
}

/* ----------------------------- showing each steps output -------------------------------------------------- */
function showstep(RuleObj, stepname) {
    var content = "<table class='table text-center'>";
    content += "<tbody><tr>";
    content += "<td>";
    content += "&lt;S0&gt;</td> <td>&rarr;</td> <td>";
    var currs1 = RuleObj["<S0>"];
    content += escapeHtml(currs1[0]);
    for (var itemind1 = 1; itemind1 < currs1.length; itemind1++) {
        content += " | " + escapeHtml(currs1[itemind1]);
    }
    content += "</td></tr>";

    for (var ind in RuleObj) {
        if (ind != "<S0>") {
            content += "<tr><td>";
            content += escapeHtml(ind) + "</td> <td>&rarr;</td> <td>";

            var currs = RuleObj[ind];
            content += escapeHtml(currs[0]);

            for (var itemind = 1; itemind < currs.length; itemind++) {
                content += " | " + escapeHtml(currs[itemind]);
            }

            content += "</td></tr>";
        }
    }

    content += "</tbody></table>";
    document.getElementById(stepname).innerHTML = content;
}

///################################################################################### step 1 ########################################################################

/* ------------------------------ cnf step 1: adding new start variable -------------------------------------------------------------------------- */
function step1(RuleObj) {
    RuleObj["<S0>"] = [];
    RuleObj["<S0>"].push(document.getElementById('startvar').value);

    console.log(RuleObj);
    return RuleObj;
}

///################################################################################### step 2 ########################################################################

/* ---------------------------------------- cnf step 2: removing all epsilon rules ----------------------------------------------------------------- */
/* in js objects are passed by reference */
function step2(RuleObj) {
    ///to track already the epsilon rule is removed or not
    var removedvars = [];

    ///loop until all the epsilon rules were removed
    while (true) {
        var nextepsilon = findnextepsilon(RuleObj);
        if (nextepsilon == "") break; ///if no epsilon rules found then break

        removedvars.push(nextepsilon); ///adding the variable to the already epsilon removed list to stop repetition
        RuleObj1 = removeepsilon(RuleObj, nextepsilon, removedvars);
    }

    console.log(RuleObj);
    return RuleObj;
}

/* ------- find the next epsilon rule and return the corresponding leftside variable. For A-><ep>, it will return A ---------- */
function findnextepsilon(RuleObj) {
    for (var key in RuleObj) {
        if (key != "<S0>") { ///epsilon is allowed in start state, so no need to check
            var rsvalue = RuleObj[key];
            var epsilonind = rsvalue.indexOf(String.fromCharCode(949));
            if (epsilonind != -1) {
                return key; ///epsilon found
            }
        }
    }
    return ""; ///if no epsilon found
}

/* ------------------- remove the epsilon rule and add corresponding new rules. Also do not add repeated epsilon rules. ---------- */
function removeepsilon(RuleObj, epsilonkey, removedvars) {
    ///removing the current epsilon rule
    var rsrules = RuleObj[epsilonkey];
    var ind = rsrules.indexOf(String.fromCharCode(949));
    rsrules.splice(ind, 1);
    ///console.log(RuleObj);

    ///now finding the existance of the leftside variable and adding corresponding new rules
    for (var key in RuleObj) {
        var rsvalue = RuleObj[key];
        var newrules = []; ///will hold the newly generated rules

        for (var ind = 0; ind < rsvalue.length; ind++) {
            var curvalue = rsvalue[ind];

            ///if epsilonkey exists
            if (curvalue.indexOf(epsilonkey) != -1) {
                ///finding out all the current epsilon key positions
                var indexlist = [];
                var start = 0;
                while (curvalue.indexOf(epsilonkey, start) != -1) {
                    var curind = curvalue.indexOf(epsilonkey, start);
                    indexlist.push(curind);
                    start = curind + 1;
                }
                ///console.log(indexlist);

                var allpossiblerules = genallpossiblerules(indexlist, curvalue);
                ///console.log(allpossiblerules);
                newrules = newrules.concat(allpossiblerules);
            }
        }

        ///if the new rule contains epsilon then we need to check whether we have already removed it or not
        if (newrules.indexOf(String.fromCharCode(949)) != -1) {
            ///epsilon found

            ///checking removedvars arr
            if (removedvars.indexOf(key) != -1) {
                ///already removed then no need to include again the same epsilon rule
                var epind = newrules.indexOf(String.fromCharCode(949));
                newrules.splice(epind, 1);
            }
        }

        ///adding all the new rules to rsvalue array
        for (var eachitem in newrules) {
            var curitem = newrules[eachitem];
            if (rsvalue.indexOf(curitem) == -1) {
                ///already not added
                rsvalue.push(curitem);
            }
        }

        RuleObj[key] = rsvalue;
    }

    return RuleObj;
}

/* ----------------------- generate all possible rules considering all possible combination of leftside variable ----------------- */
function genallpossiblerules(positionlist, rule) {
    var newrules = [];

    var sz = positionlist.length;
    for (var i = 1; i < Math.pow(2, sz); i++) { ///i=0 is the rule itself
        ///according to the bit representation of i, we need to ignore the corresponding value
        var considerpos = [];

        for (var j = 0; j < sz; j++) {
            if ((i & (1 << j)) != 0) {
                ///this bit is the one bit
                considerpos.push(positionlist[j]);
            }
        }
        ///console.log(considerpos);

        var newrulestr = "";
        for (var strind = 0; strind < rule.length; strind++) {
            if (considerpos.indexOf(strind) != -1) {
                ///ignore the variable then
            } else {
                newrulestr += rule[strind];
            }
        }
        /// console.log(newrulestr);

        if (newrulestr == "") newrulestr = String.fromCharCode(949);

        newrules.push(newrulestr);
    }

    return newrules;
}

///################################################################################### step 3 ########################################################################

/* ---------------------------- cnf step 3: removing unit rules ----------------------------------------------------------------------------------------- */
function step3(RuleObj) {
    ///removing all the self rules
    RuleObj = removeself(RuleObj);

    var removedrules = []; ///to track already removed unit rules. Form: [[left,right],[left,right],... ...]

    while (true) {
        var nextunitrule = findnextunitrule(RuleObj); ///will return a unit rule as an array of the form: ['leftside','rightside']
        ///console.log(nextunitrule);
        if (nextunitrule.length == 0) break; ///if no unit rule found then break

        var leftside = nextunitrule[0]; ///unit rule left side
        var rightside = nextunitrule[1]; ///unit rule right side

        ///removing the found unit rule
        var rsvalue = RuleObj[leftside];
        var unitruleind = rsvalue.indexOf(rightside);
        rsvalue.splice(unitruleind, 1);

        var newrules = RuleObj[rightside]; ///the new rules to be added
        ///checking for repeated newrule
        var flag = false;
        for (var ind = 0; ind < removedrules.length; ind++) {
            var curitem = removedrules[ind];

            if (curitem[0] == leftside && newrules.indexOf(curitem[1]) != -1) {
                ///remove the item from newrules
                var findind = newrules.indexOf(curitem[1]);
                newrules.splice(findind, 1);
            }
        }

        ///adding all the new rules to rsvalue array
        for (var eachitem in newrules) {
            var curitem = newrules[eachitem];
            if (rsvalue.indexOf(curitem) == -1 && curitem != leftside) { ///repetition check
                ///already not added
                rsvalue.push(curitem);
            }
        }

        RuleObj[leftside] = rsvalue;
        removedrules.push(nextunitrule);
    }

    console.log(RuleObj);
    return RuleObj;
}

/* --------------------------- remove all the self rules ----------------------------------------------------- */
function removeself(RuleObj) {
    for (var key in RuleObj) {
        var rsvalue = RuleObj[key];

        for (var ind = 0; ind < rsvalue.length;) {
            var rsrule = rsvalue[ind];
            if (rsrule == key) {
                rsvalue.splice(ind, 1);
            } else {
                ind++;
            }
        }
    }
    return RuleObj;
}

/* ------------------------------------- search for the next unit rule to remove --------------------------------------------------- */
function findnextunitrule(RuleObj) {
    var trimmedvars = genvarslist();

    for (var key in RuleObj) {
        var rsvalue = RuleObj[key];

        for (var ind = 0; ind < rsvalue.length; ind++) {
            var rsrule = rsvalue[ind];

            if (trimmedvars.indexOf(rsrule) != -1) {
                ///unit variable found
                return [key, rsrule];
            }
        }
    }

    return []; ///for no unit rules returns an empty array
}

///################################################################################### step 4 ########################################################################

/* ------------------------------------------------------------------------ cnf step 4: proper form conversion ------------------------------------------------------- */
function step4(RuleObj) {
    ///first making all the rules with length >=3 length to exact 2 length
    RuleObj = twolenrules(RuleObj);
    ///console.log(RuleObj);

    ///convert all the terminals to variables
    RuleObj = terminalvar(RuleObj);
    ///console.log(RuleObj);

    console.log(RuleObj);
    return RuleObj;
}

/* -------------------- to escape the special html characters --------------------------------- */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ------------------------------------ generate next available variables - all the variable names are in the form <Z1>,<Z2>,... etc. --------------------------------------- */
function gennextvar(RuleObj) {
    var maxnumber = 0;

    for (var key in RuleObj) {
        var curkey = key;
        if (curkey.startsWith("<Z") && curkey.endsWith(">")) {
            var curnumber = parseInt(curkey.slice(2, curkey.length - 1));
            if (curnumber > maxnumber) maxnumber = curnumber;
        }
    }

    var nextnumber = maxnumber + 1;
    return "<Z" + nextnumber + ">";
}

/* ------------------------------------ calculate length of each right side rule        ------------------------------------------------------------- */
/* ------------------------------------ returns false if the length is 2, true otherwise -------------------------------------------------------------- */
function calclen(rsrule) {
    //if rsrule contains < then it is already in length 2
    if (rsrule.indexOf("<") != -1) {
        return false;
    } else if (rsrule.length <= 2) {
        return false;
    } else {
        return true; ///true means violation
    }
}

/* ----------------------------------- search for new rule that violates 2 len condition -------------------------------------------------------------- */
function searchviolation(RuleObj) {
    for (var key in RuleObj) {
        var rsvalue = RuleObj[key];

        for (var ind in rsvalue) {
            var rsrule = rsvalue[ind];

            if (calclen(rsrule)) {
                return [key, rsrule];
            }
        }
    }
    return []; ///if no violation found then return an empty array
}

/* ------------------------------ check and match single right side rules only ----------------------------------------------------- */
function singlersrule(RuleObj) {
    var listrule = [];
    for (var key in RuleObj) {
        var rsvalue = RuleObj[key];
        if (rsvalue.length == 1) {
            var rsrule = rsvalue[0];
            if (rsrule.length > 1) { ///not a terminal
                listrule.push([key, rsrule]);
            }
        }
    }
    return listrule;
}

/* ---------------------------- making all the rules with length >=3 length to exact 2 length --------------------------------------------------------------- */
function twolenrules(RuleObj) {
    var tracknewrules = singlersrule(RuleObj); ///to off the repetition
    while (true) {
        var violation = searchviolation(RuleObj);
        ///console.log(violation);
        if (violation.length > 0) {
            ///remove the current rule
            var leftkey = violation[0];
            var rightkey = violation[1];
            var rsvalue = RuleObj[leftkey];

            var rightkeyind = rsvalue.indexOf(rightkey);
            rsvalue.splice(rightkeyind, 1);

            var part1 = rightkey.substr(0, 1);
            var part2 = rightkey.substr(1);

            ///checking newly generated rules for repetition
            var flag = false;
            for (var ind = 0; ind < tracknewrules.length; ind++) {
                var currule = tracknewrules[ind];
                if (currule[1] == part2) {
                    ///already exists
                    var newvar = currule[0];
                    var newrule = part1 + newvar;
                    rsvalue.push(newrule);
                    RuleObj[leftkey] = rsvalue;

                    flag = true;
                    break;
                }
            }

            if (flag == false) {
                ///already no rules exists

                ///adding new short right side rule
                var newvar = gennextvar(RuleObj);
                var newrule = part1 + newvar;
                rsvalue.push(newrule);
                RuleObj[leftkey] = rsvalue;

                ////adding new RuleObj variable and corresponding rules
                RuleObj[newvar] = [part2];

                tracknewrules.push([newvar, part2]); ///using newvar we can generate the rest portion
            }

        } else {
            break; ///if no violation found
        }
    }

    return RuleObj;
}

/* ---------------------- search for single terminal rule ------------------------------------------ */
function singleterminalrule(RuleObj) {
    var listrule = [];
    for (var key in RuleObj) {
        var rsvalue = RuleObj[key];
        if (rsvalue.length == 1) { ///only one rule in the RS
            var rsrule = rsvalue[0];
            if (rsrule.length == 1 && rsrule != String.fromCharCode(949)) { /// a terminal
                listrule.push([key, rsrule]);
            }
        }
    }
    return listrule;
}

/* ------------------------ search terminal rule violation -------------------------------------------- */
function searchterminalviolation(RuleObj) {
    var curterminalslist = genterminalslist();
    for (var key in RuleObj) {
        var rsvalue = RuleObj[key];

        for (var ind in rsvalue) {
            var rsrule = rsvalue[ind];
            if (rsrule.length > 1) { ///more than 1 length meaning 2 length always
                for (var tind in rsrule) {
                    var curchar = rsrule[tind];
                    if (curterminalslist.indexOf(curchar) != -1) {
                        ///terminals found
                        return [key, rsrule, curchar];
                    }
                }
            }
        }
    }
    return []; ///for no violation return empty list
}

/* ---------------------------------- search for terminal in 2 length rules and replace them ---------------------------------------- */
function terminalvar(RuleObj) {
    var trackterminals = singleterminalrule(RuleObj); ///already implemented single termianl rule

    while (true) {
        var violation = searchterminalviolation(RuleObj);
        if (violation.length > 0) {
            var leftkey = violation[0];
            var rightkey = violation[1];
            var foundterminal = violation[2];
            var rsvalue = RuleObj[leftkey];

            ///remove the current rule
            var rightkeyind = rsvalue.indexOf(rightkey);
            rsvalue.splice(rightkeyind, 1);

            ///check for repetition
            var flag = false;
            for (var ind = 0; ind < trackterminals.length; ind++) {
                var currule = trackterminals[ind];
                if (currule[1] == foundterminal) {
                    rightkey = rightkey.replace(foundterminal, currule[0]);
                    rsvalue.push(rightkey);
                    RuleObj[leftkey] = rsvalue;

                    flag = true;
                    break;
                }
            }

            if (flag == false) {
                ///no existing rules found
                var newvar = gennextvar(RuleObj);
                RuleObj[newvar] = [foundterminal]; ///this is the new rule
                trackterminals.push([newvar, foundterminal]);

                rightkey = rightkey.replace(foundterminal, newvar);
                rsvalue.push(rightkey);
                RuleObj[leftkey] = rsvalue;
            }
        } else {
            break;
        }
    }

    return RuleObj;
}