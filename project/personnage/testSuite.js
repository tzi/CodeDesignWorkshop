QUnit.test('You can initialize a character with given parameters', function(){
	var params = {
		str: 5,
		def: 6,
		pv: 37
	};
	var perso = generateCharacter(params);
    QUnit.equal(perso.getStr(), 5);
    QUnit.equal(perso.getDef(), 6);
    QUnit.equal(perso.getPv(), 37);
});

QUnit.test('A character takes damage and is protected by its def', function() {
	var params = {def: 5, pv: 10};
	var perso = generateCharacter(params);
	QUnit.equal(perso.take(10), 5);
	QUnit.equal(perso.getPv(), 5);
	QUnit.equal(perso.take(15), 0);
	QUnit.equal(perso.getPv(), 0);
});

QUnit.test('A character hits another character without weapon', function() {
	var params_attacker = {str: 5};
	var params_attacked = {def: 3, pv: 20};
	var attacker = generateCharacter(params_attacker);
	var attacked = generateCharacter(params_attacked);

	attacker.attack(attacked);
	QUnit.equal(attacked.getPv(), 18);
});

QUnit.test('A character hits another character with a weapon', function() {
	var params_attacker = {str: 5, weapon: {dmg: 5}};
	var params_attacked = {def: 3, pv: 20};
	var attacker = generateCharacter(params_attacker);
	var attacked = generateCharacter(params_attacked);

	attacker.attack(attacked);
	QUnit.equal(attacked.getPv(), 13);
});

QUnit.test('Protection against known types is calculated', function() {
	var params = {pro: {fire: 2, water: 3, emo: 4}};
	var c = generateCharacter(params);
	QUnit.equal(c.getSpecialDef('fire'), 2);
	QUnit.equal(c.getSpecialDef('water'), 3);
	QUnit.equal(c.getSpecialDef('emo'), 4);
});

QUnit.test('Protection against an unknown type is 0', function() {
	var params = {pro: {fire: 2, water: 3, emo: 4}};
	var c = generateCharacter(params);
	QUnit.equal(c.getSpecialDef('schtroumpf'), 0);
});

QUnit.test('A character takes special damage of type "fire" with no protection', function() { 
	var params = {pv: 100};
	var c = generateCharacter(params);
	c.take(10, 'fire');
	QUnit.equal(c.getPv(), 90);
});

QUnit.test('A character takes 100 special damage of type "fire" with 50% protection', function() { 
	var params = {pv: 100, pro: {fire: 50}};
	var c = generateCharacter(params);
	c.take(100, 'fire');
	QUnit.equal(c.getPv(), 50, "Character is left with 50 PV out of 100");
});

QUnit.test('A character casts a special attack on another', function() {
	QUnit.expect(2);
	var mock = generateCharacter();
	mock.take = function(damage, type) {
		QUnit.equal(damage, 100, "Damage is equal to 100");
		QUnit.equal(type, 'fire', "Damage type is fire");
	};

	var c = generateCharacter({
		weapon: {
			dmg: 100,
			type: 'fire'
		}
	});
	c.attack(mock);

});

QUnit.test('A character moves correctly with a given speed', function() {
	var c = generateCharacter({speed: 2});
	QUnit.equal(c.getX(), 0);
	QUnit.equal(c.getY(), 0);
	c.move('N');
	QUnit.equal(c.getX(), 0, "Has correct X after going 1 step North");
	QUnit.equal(c.getY(), 2, "Has correct Y after going 1 step North");
	c.move('E');
	QUnit.equal(c.getX(), 2, "Has correct X after going 1 step East");
	QUnit.equal(c.getY(), 2, "Has correct Y after going 1 step East");
	c.move('SE', 3);
	QUnit.equal(c.getX(), 8, "Has correct X after going 3 steps South-East");
	QUnit.equal(c.getY(), -4, "Has correct Y after going 3 steps South-East");
	c.move('W', 4);
	QUnit.equal(c.getX(), 0, "Has correct X after going 4 steps West");
	QUnit.equal(c.getY(), -4, "Has correct Y after going 4 steps West");
});