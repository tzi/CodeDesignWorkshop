function generateCharacter(params) {
    var priv = {
        str: 1,
        def: 1,
        pv: 10,
        pro : { // special protections, in %
            'fire': 0,
            'water': 0,
            'air':0,
            'earth': 0,
            'emo': 0
        },
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

    // Attack another character
    pub.attack = function(character) {
        var base = 0;
        if (priv.weapon && priv.weapon.dmg) {
            base = priv.weapon.dmg;
        }
        var damage = priv.str + base;
        character.take(damage);
    }

    pub.getSpecialDef = function(type) {
        return priv.pro[type] << 0;
    }

    return pub;
}