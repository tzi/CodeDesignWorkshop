App = (function App() {


    /*** Attributes ***/
    var project;


    /*** Management of local storage ***/
    var Storage = {
        getAllCodes: function() {
            if (!project) {
                return {};
            }
            var codes = localStorage['savedCode-'+project];
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
            localStorage['savedCode-'+project] = JSON.stringify(codes);
            return isNew;
        }
    }


    /*** Management of action elements & test panel ***/
    var Interface = {
        selectProjectAction: document.getElementById('selectProjectAction'),
        showTestAction: document.getElementById('showTestAction'),
        runTestAction: document.getElementById('runTestAction'),
        saveCodeAction: document.getElementById('saveCodeAction'),
        loadCodeAction: document.getElementById('loadCodeAction'),
        Editor: ace.edit('editorFrame'),
        init: function() {
            Interface.selectProjectAction.addEventListener('change', App.selectProject);
            Interface.loadCodeAction.addEventListener('change', App.loadCode);
            Interface.showTestAction.addEventListener('click', App.toggleTestPanel);
            Interface.runTestAction.addEventListener('click', App.runTests);
            Interface.saveCodeAction.addEventListener('click', App.saveCode);
            Interface.Editor.setTheme("ace/theme/twilight");
            Interface.Editor.getSession().setMode("ace/mode/javascript");
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
            clean: function() {
                document.getElementById('testFrame').innerHTML = '';
            },
            addEntry: function(name, result) {
                document.getElementById('testFrame')
                    .innerHTML += '<li class="test">'
                    + '<span class="test-name">' + name +': </span>'
                    + '<span class="test-result test-result--' + (result?'ok':'error') + '">' + (result?'OK':'ERROR') + '</span>'
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
                var button = document.getElementById('showTestAction');
                if (result || action) {
                    button.innerHTML = 'Hide tests';
                } else {
                    button.innerHTML = 'Show tests';
                }
            }
        }
    }


    /*** Public functions ***/
    var App = {

        // Project
        selectProject: function() {
            var selected = this.options[this.selectedIndex].value;
            if (selected) {
                project = selected;
                var script = document.createElement( 'script' );
                script.src = '/project/'+project+'.js';
                document.body.appendChild( script );
            }
        },

        // Tests
        toggleTestPanel: function(action) {
            if (project) {
                Interface.TestPanel.toggle(action);
                Interface.Editor.focus();
            }
        },
        runTests: function() {
            if (project) {
                var js = Interface.Editor.getValue();
                try {
                    eval(js);
                } catch(e) {
                    alert('Error in javascript compilation: ' + e.message);
                    return false;
                }
                Interface.TestPanel.clean();
                Interface.TestPanel.toggle(true);
                QUnit.reset();
                QUnit.init();
                QUnit.start();
                TestSuite(js);
                Interface.Editor.focus();
            }
        },

        // Editor
        saveCode: function() {
            if (project) {
                var name = prompt('Under which name?', 'just a try');
                if (Storage.addCode(name, Interface.Editor.getValue())){
                    Interface.addSaveOption(name);
                }
                Interface.Editor.focus();
            }
        },
        loadCode: function() {
            if (project) {
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
            if (project) {
                Storage.addCode('origin', val);
                Interface.enableActions();
                Interface.setOptions(Storage.getAllNames());
            }
        }
    }

    // Initialization
    QUnit.testDone(function(details){
        Interface.TestPanel.addEntry(details.name, details.failed==0);
    });
    Interface.init();

    return App;
})();

