App = (function App() {


    /*** Management of project & associate tests ***/
    var Project = {
        name: '',
        testSuite: '',
        active: function() {
            return (Project.name !== '');
        },
        loadProject: function(name){
            if (name) {
                Project.name = name;
                // Load code
                var client = new XMLHttpRequest();
                client.open('GET', 'project/'+name+'/code.js');
                client.onreadystatechange = function() {
                    App.init(client.responseText);
                }
                client.send();
                Project.loadTestSuite('');
            }
        },
        loadTestSuite: function(id){
            if (Project.active()) {
                // Load test suite
                var client = new XMLHttpRequest();
                client.open('GET', 'project/'+Project.name+'/testSuite'+id+'.js');
                client.onreadystatechange = function() {
                    Project.testSuite = client.responseText;
                }
                client.send();
                Interface.TestPanel.clean();
                Interface.clearPicture();
            }
        },
        runTests: function(){
            if (Project.active()) {
                var js = Interface.Editor.getValue();
                try {
                    var currentFileLine = 34;
                    eval(js);
                } catch(e) {
                    var msg = 'Error in javascript compilation: '+e.message;
                    if (typeof e.lineNumber != 'undefined') {
                        msg += ' at line '+(e.lineNumber-currentFileLine);
                    }
                    alert(msg);
                    return false;
                }
                Interface.TestPanel.clean();
                Interface.TestPanel.toggle(true);
                QUnit.reset();
                QUnit.init();
                QUnit.start();
                // Reparse the TestSuite with the current context :(
                eval('var TestSuite=function(){'+Project.testSuite+'}');
                TestSuite();
            }
        },
        init: function() {
            var asserts = [];
            QUnit.log(function(details) {
                if (details.message) {
                    asserts.push('<li class="assert"><span class="result result--'+(details.result?'ok':'ko')+'">['+(details.result?'OK':'KO')+'] '+details.message+'</li>');
                }
            });
            QUnit.testDone(function(details){
                var msg = details.name;
                if (asserts.length) {
                    msg += '<ol class="asserts">'+asserts.join('')+'</ol>';
                    asserts = [];
                }
                Interface.TestPanel.addEntry(msg, details.failed==0);
                if (QUnit.config.stats.bad) {
                    Interface.clearPicture();
                } else {
                    Interface.loadPicture();
                }
            });
        }
    }


    /*** Management of local storage ***/
    var Storage = {
        getAllCodes: function() {
            if (!Project.active()) {
                return {};
            }
            var codes = localStorage['savedCode-'+Project.name];
            if (typeof codes != 'string') {
                return {};
            }
            try {
                return JSON.parse(codes);
            } catch (e) {
            }
            return {};
        },
        getCode: function(name) {
            var codes = Storage.getAllCodes();
            if (typeof codes[name] != 'string') {
                return '';
            }
            return codes[name];
        },
        getAllNames: function() {
            var codes = Storage.getAllCodes();
            var names = [];
            for (name in codes) {
                if (codes.hasOwnProperty(name)) {
                    names.push(name);
                }
            }
            return names;
        },
        addCode: function(name, code) {
            var codes = Storage.getAllCodes();
            var isNew = (typeof code[name] == 'undefined');
            codes[name] = code;
            localStorage['savedCode-'+Project.name] = JSON.stringify(codes);
            return isNew;
        }
    }


    /*** Management of action elements & test panel ***/
    var Interface = {
        selectProjectAction: document.getElementById('selectProjectAction'),
        selectTestAction: document.getElementById('selectTestAction'),
        runTestAction: document.getElementById('runTestAction'),
        saveCodeAction: document.getElementById('saveCodeAction'),
        loadCodeAction: document.getElementById('loadCodeAction'),
        exercisePicture: document.getElementById('picture'),
        Editor: ace.edit('editorFrame'),
        init: function() {
            Interface.selectProjectAction.addEventListener('change', App.selectProject);
            Interface.selectTestAction.addEventListener('change', App.selectTest);
            Interface.loadCodeAction.addEventListener('change', App.loadCode);
            Interface.runTestAction.addEventListener('click', App.runTests);
            Interface.saveCodeAction.addEventListener('click', App.saveCode);
            Interface.Editor.setTheme("ace/theme/twilight");
            Interface.Editor.getSession().setMode("ace/mode/javascript");
            Interface.Editor.on('change', function(){
                Interface.TestPanel.clean();
                Interface.clearPicture();
            });
        },
        enableActions: function() {
            var buttons = document.getElementsByClassName('enableWithProject');
            for(var i=0; i<buttons.length; i++){
                buttons[i].disabled=false;
            }
        },
        addSaveOption: function(name, value) {
            var option = document.createElement( 'option' );
            option.innerHTML = name;
            if (arguments.length == 2){
                option.value = value;
            }
            Interface.loadCodeAction.appendChild( option );
        },
        setOptions: function(names) {
            Interface.loadCodeAction.innerHTML = '';
            Interface.addSaveOption('Load a save','');
            for(var i=0; i<names.length; i++){
                Interface.addSaveOption(names[i]);
            }
        },
        TestPanel: {
            element: document.getElementById('testReport'),
            clean: function() {
                Interface.TestPanel.element.innerHTML = '';
            },
            addEntry: function(name, result) {
                Interface.TestPanel.element
                    .innerHTML += '<li class="test">'
                    + '<span class="test-result test-result--' + (result?'ok':'error') + '">[' + (result?'OK':'ERROR') + '] </span>'
                    + '<span class="test-name">' + name +'</span>'
                    + '</li>';
            },
            toggle: function(action) {
                var method;
                if (typeof action == 'object' || typeof action == 'undefined') {
                    action = false;
                    method='toggle';
                } else if (action) {
                    method='add';
                } else {
                    method='remove';
                }
                var result = document.getElementById('mainFrame').classList[method]('showTest');
            }
        },
        loadPicture: function() {
            if (Interface.exercisePicture.style.display == 'none') {
                var max = 23;
                var min = 1;
                var id = Math.floor(Math.random() * (max - min + 1)) + min;
                Interface.exercisePicture.setAttribute('src', 'picture/pic'+id+'.gif');
                Interface.exercisePicture.style.display = '';
            }
        },
        clearPicture: function() {
            Interface.exercisePicture.style.display = 'none';
            Interface.exercisePicture.setAttribute('src', '');
        }
    }


    /*** Public functions ***/
    var App = {

        // Project
        selectTest: function() {
            Project.loadTestSuite(this.options[this.selectedIndex].value);
            Interface.Editor.focus();
        },
        selectProject: function() {
            Project.loadProject(this.options[this.selectedIndex].value);
            Interface.Editor.focus();
        },
        runTests: function() {
            Project.runTests();
            Interface.Editor.focus();
        },
        toggleTestPanel: function(action) {
            if (Project.active()) {
                Interface.TestPanel.toggle(action);
                Interface.Editor.focus();
            }
        },

        // Editor
        saveCode: function() {
            if (Project.active()) {
                var name = prompt('Under which name?', 'just a try');
                if (Storage.addCode(name, Interface.Editor.getValue())){
                    Interface.addSaveOption(name);
                }
                Interface.Editor.focus();
            }
        },
        loadCode: function() {
            if (Project.active()) {
                var name = this.options[this.selectedIndex].value;
                if (name) {
                    Interface.Editor.setValue(Storage.getCode(name));
                    Interface.Editor.clearSelection();
                    Interface.Editor.focus();
                    this.selectedIndex = 0;
                }
            }
        },
        init: function(val) {
            Interface.Editor.setValue(val);
            Interface.Editor.clearSelection();
            if (Project.active()) {
                Storage.addCode('origin', val);
                Interface.enableActions();
                Interface.setOptions(Storage.getAllNames());
            }
        }
    }


    /*** Initialization ***/
    Interface.init();
    Project.init();
    return App;
})();

