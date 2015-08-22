
/**
 * Caclulate percentajes from known values
 *
 * @example
 *  var vat = new ia_TaxDisc(0.16,2,true,2), // default tax 16%, round amounts to 2 decimals, true=it's markup, tax percent decimals 2
 *      tot = vat.breakdown(100), // returns {before: 100, per: 0.16, value: 16, after: 116 }
 *      ded = vat.breakdown({after:116}}) // returns {before: 100, per: 0.16, value: 16, after: 116 }
 *
 * @class ia_TaxDisc
 * @param {number|string} perDflt default percentage for markup/discount to use ie 0.15 or '15%', default 0.16
 * @param {int} decs number of decimals for amounts, default 2
 * @param {bool} markup true/1 tax or markup, false/-1 discount
 * @param {int} decsPer number of decimals for percentage, default 4
 * @return {object}
 *
 * @author Raul Jose Santos Bernard
 * @company Informatica Asociada SA de CV
 * @License: MIT
 */
function ia_TaxDisc(perDflt, decs,markup,decsPer) {
"use strict";
    // init
        decsPer = isNotNum(decsPer) || decsPer < 0 ? 4 : Number(decsPer);
        try {
        if(isNotNum(perDflt) && perDflt.charAt(perDflt.length - 1) === '%')
            perDflt =  parseFloat(perDflt.substr(0,perDflt.length - 1))/100.00;
        } catch(er) {}
        perDflt = isNotNum(perDflt) ? 0.16 : Number(perDflt);
        decs = isNotNum(decs) || decs < 0 ? 2 : parseInt(decs);
        if( isNotNum(markup) )
            markup = 1;
        else if( markup === true || markup > 0)
            markup = 1;
        else
            markup = -1;
        var me = this;

    // helpers
        function round(n) {
            return decs<0 ? n : Number(Math.round(n+'e'+decs)+'e-'+decs);
        }
        function roundPer(n) {
            return decsPer<0 ? n : Number(Math.round(n+'e'+decsPer)+'e-'+decsPer);
        }
        function isNotNum(n) {
            return n === "" || n === null || isNaN(n);
        }
        function perSet(per) {
            try {
                if(isNotNum(per) && per.charAt(per.length - 1) === '%')
                    per =  parseFloat(per.substr(0,per.length - 1))/100.00;
            } catch(er) {}
            return isNotNum(per) ? perDflt : Number(per);
        }

    // functions
        /**
         * From the before amuount calcluate value and after amonunts
         * @method breakdown
         * @param {number|object} before
         * @param {number} per  percantaje to use, defaults to perDflt given  at instantiation
         * @return ObjectExpression { before:amount, per:%, value:amount, after:amount }, amounts are rounded to decs
         */
        me.breakdown = function(before,per) {
            if( before !== null && typeof before === 'object') {
                per  = perSet( before.per );
                before = before.before;
            } else {
                before = round(before);
                per = perSet(per);
            }

            return {
                    before: before,
                    per: per,
                    value: round( before * per ),
                    after: round( before*(1.00 + markup * per ) )
                };
        };

        /**
         * From the available data return array with all the values { before:amount, per:%, value:amount, after:amount };
         * @method deduce
         * @param {number|object} before amount, null to calculate or object with known values { before:amount, per:%, value:amount, after:amount }
         * @param {number} value amount or null
         * @param {number} after amount or null
         * @param {number|string} per value percantaje to use, ie 0.15 or '15%', defaults to perDflt given  at instantiation
         * @return object with missing values
         */
        me.deduce = function(before,value,after,per) {
            if( before !== null && typeof before === 'object') {
                value = before.value;
                after = before.after;
                per  = perSet( before.per );
                before = before.before;
            } else
                per = perSet(per);


            if(!isNotNum(value)) {
                if( isNotNum(before) && isNotNum(after) ) {
                    return me.breakdown( round( round(value)/per), per );
                }
                if( isNotNum(before) && !isNotNum(after) ) {
                    after = round(after);
                    value=round(value);
                    before = markup > 0 ? round(after - value) : round(after + value);
                    return { before: before, per:perSet(value/before), value: value, after: after };
                }
                if( !isNotNum(before) && isNotNum(after) ) {
                    before = round(before);
                    value = round(value);
                    return {before:before, per:perSet(value/before), value: value, after:round(before + markup * value) };
                }
                // implied elseif !isNotNum(before) && !isNotNum(after), the only option left to consider:
                return {before:round(before), per:per, value: round(value), after:round(after)};
            }

            if( !isNotNum(before) && isNotNum(after) ) {
                return me.breakdown(before,per);
            }
            if( isNotNum(before) && !isNotNum(after) ) {
                return me.breakdown( round( round(after)/(1.00 + markup * per) ),per);
            }
            if( !isNotNum(before) && !isNotNum(after) ) {
                before = round(before);
                after = round(after);
                value = markup>0 ? round(after - before) : round(before - after);
                return {before:before, per:perSet(roundPer(value/before)), value:value, after:after};
            }
            //implied elseif isNotNum(before) && isNotNum(after), the only option left to consider:
            return {before: before, per:perDflt, value:value, after: after};
        };

}