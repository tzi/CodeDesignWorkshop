function generateCharacter(params) {
    var priv = {
        x : 0, // horizontal position
        y : 0, // vertical position
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
        speed : 1 // length of a step
    };
    var pub = {};

    if (params) { // initialization of parameters
        for (carac in params) {
            priv[carac] = params[carac];
        }
    }

    // get strength (physical attack)
    pub.getStr = function() {
        return priv.str;
    }
    // get defense (physical)
    pub.getDef = function() {
        return priv.def;
    }
    // get health points
    pub.getPv = function() {
        return priv.pv;
    }
    // get speed
    pub.getStr = function() {
        return priv.speed;
    }

    // Take damage
    pub.take = function(damage, type) {
        damage = damage << 0;
        if (type == undefined || type == 'phys') {
            if (damage < priv.def) {
                return priv.pv;
            }
            priv.pv -= damage - priv.def;
            if (priv.pv < 0) {
                priv.pv = 0;
            }
        } else {
            var pr = pub.getSpecialDef(type);
            var ad = damage;
            if (pr != 0) {
                ad = Math.ceil(damage * (100 - pr)/100);
            }
            priv.pv -= ad;
        }

        return priv.pv;
    }

    // Attack another character
    pub.attack = function(character) {
        var type = priv.str;
        var damage = 'phys';
        if (priv.weapon && priv.weapon.dmg) {
            type += priv.weapon.dmg;
            if (priv.weapon.type !== undefined && priv.weapon.type !== 'phys') {
                type = priv.weapon.dmg;
                damage = priv.weapon.type = 'fire';
            }
        }
        // the other character takes damage with given value and type
        character.take(type, damage);
    }

    // 0
    pub.getSpecialDef = function(type) {
        return priv.pro[type] << 0;
    }

    pub.move = function(d, n) {
        if (n === undefined) {
            n = 1;
        }
        var z = n * priv.speed;
        switch(d) {
            case 'N':
                priv.y += z;
                break;
            case 'NE':
                priv.y += z;
                priv.x += z;
                break;
            case 'S':
                priv.y -= z;
                break;
            case 'SE':
                priv.y -= z;
            case 'E':
                priv.x += z;
                break;
            case 'W':
                priv.x -= z;
                break;
            case 'SW': // W00T ! This is Sud Web ! \o/
                priv.x -= z;
                priv.y -= z;
                break;
        }
    }

    // get X
    pub.getX = function() {
        // We get X in private variables and we return it
        return priv.x;
    }

    // get X
    pub.getY = function() {
        // We get X in private variables and we return it
        return priv.x;
    }

    return pub;
}