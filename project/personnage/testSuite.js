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