// Exo 1 =========================================================================
QUnit.test('You can initialize a character with given parameters', function(){
	var params = {
		str: 5,
		def: 6,
		pv: 37
	};
	var perso = generateCharacter(params);
    QUnit.equal(perso.getStr(), 5, "Strength");
    QUnit.equal(perso.getDef(), 6, "Defense");
    QUnit.equal(perso.getPv(), 37, "PV");
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