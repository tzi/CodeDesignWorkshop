function generateCharacter(params) {
    var priv = {
        str: 1,
        def: 1,
        pv: 10
    };
    var pub = {};

    if (params) {
        for (carac in params) {
            priv[carac] = params[carac];
        }
    }

    pub.getStr = function() {
        return priv.str;
    }
    pub.getDef = function() {
        return priv.def;
    }
    pub.getPv = function() {
        return priv.pv;
    }

    return pub;
}