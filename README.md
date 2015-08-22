# ia_TaxDisc

> Tax - Discount Calculator

Given any 2 values of 4 (base amount, % tax/discount, tax / discount amout, final amount) deduces the missing values.

# Usage

Include the script
```
<script src="/path/ia_TaxDisc.js"></script>
```


# Examples
```
 // default tax 20%, round amounts to 2 decimals, true=it's markup, tax percent decimals 2
var vat = var vat = new ia_TaxDisc(0.2,2,true,2);
vat.deduce({before:100,after:120}); // returns: {before: 100, per: 0.2, value: 20, after: 120, }
vat.deduce({per:'10%',after:330}); // returns: {before: 300, per: 0.1, value: 30, after: 330, }
disc.breakdown(100); // using defaults returns: {before: 100, per: 0.2, value: 20, after: 120, }

// default discount 10%, round amounts to 2 decimals, false=it's discount, discount percent decimals 2
var disc = new ia_TaxDisc('10%',2,false,2);
disc.deduce({before: 200,value: 30,}) // returns: {before: 200, per: 0.15, value: 30, after: 170, }

disc.breakdown(150); // using defaults, results = {before: 150, per: 0.1, value: 15, after: 135, }

```

# License: MIT

