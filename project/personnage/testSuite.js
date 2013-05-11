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