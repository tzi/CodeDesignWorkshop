function generateCharacter(params) {
    var priv = {
        x : 0,
        y : 0,
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
            var prot_rate = pub.getSpecialDef(type);
            var actual_damage = damage;
            if (prot_rate != 0) {
                actual_damage = Math.ceil(damage * (100 - prot_rate)/100);
            }
            priv.pv -= actual_damage;
        }

        return priv.pv;
    }

    // Attack another character
    pub.attack = function(character) {
        var damage = priv.str;
        var type = 'phys';
        if (priv.weapon && priv.weapon.dmg) {
            damage += priv.weapon.dmg;
            if (priv.weapon.type !== undefined && priv.weapon.type !== 'phys') {
                damage = priv.weapon.dmg;
                type = priv.weapon.type = 'fire';
            }
        }
        character.take(damage, type);
    }

    pub.getSpecialDef = function(type) {
        return priv.pro[type] << 0;
    }

    pub.move = function(direction, nb_of_steps) {
        if (nb_of_steps === undefined) {
            nb_of_steps = 1;
        }
        var dist = nb_of_steps * priv.speed;
        switch(direction) {
            case 'N':
                priv.y += dist;
                break;
            case 'NE':
                priv.y += dist;
                priv.x += dist;
                break;
            case 'S':
                priv.y -= dist;
                break;
            case 'SE':
                priv.y -= dist;
            case 'E':
                priv.x += dist;
                break;
            case 'W':
                priv.x -= dist;
                break;
            case 'SW': // W00T ! Sud Web ! \o/
                priv.x -= dist;
                priv.y -= dist;
                break;
        }
    }

    pub.getX = function() {
        return priv.x;
    }

    pub.getY = function() {
        return priv.y;
    }

    return pub;
}