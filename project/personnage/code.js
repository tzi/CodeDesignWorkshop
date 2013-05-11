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

    // Take damage
    pub.take = function(damage) {
        damage = damage << 0;
        if (damage < priv.def) {
            return priv.pv;
        }
        priv.pv -= damage - priv.def;
        if (priv.pv < 0) {
            priv.pv = 0;
        }
        return priv.pv;
    }

    return pub;
}