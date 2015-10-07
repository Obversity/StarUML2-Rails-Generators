/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, app, window */


define(function (require, exports, module) {
    "use strict";

    var Commands       = app.getModule("command/Commands"),
        CommandManager = app.getModule("command/CommandManager"),
        MenuManager    = app.getModule("menu/MenuManager"),
        ElementPickerDialog = app.getModule("dialogs/ElementPickerDialog"),
        Dialogs = app.getModule("dialogs/Dialogs"),
        FileSystem = app.getModule("filesystem/FileSystem"),
        FileSystemError = app.getModule("filesystem/FileSystemError"),
        UML = app.getModule("uml/UML");



    // Add a HelloWorld command
    var CMD_RAILS = "rails",
        CMD_RAILS_GENERATE = "rails.generate";

    //handler for the rails generate command
    function _hasBelongsTo(elem){
      debugger;
    }

    function _handleGenerate(base, path, options){
      var result = new $.Deferred();
      console.log(result);

       // If options is not passed, get from preference
      // options = options || CsharpPreferences.getGenOptions();

       // If base is not assigned, popup ElementPicker
       //TODO: refactor to use class for the 'model' object, rather than it just being an array of objects
       if (!base) {
           ElementPickerDialog.showDialog("Select a base model to generate codes", null, type.UMLPackage)
               .done(function (buttonId, selected) {
                   if (buttonId === Dialogs.DIALOG_BTN_OK && selected) {
                       base = selected;
                       console.log(base);

                       //hash to store models
                       var models = {};

                       var generatorType = "model"

                       Dialogs.showInputDialog(
                         "What type of generator do you want? (Defaults to model.)"
                       ).done(function(buttonId, text){

                         if(buttonId === Dialogs.DIALOG_BTN_OK)
                         {
                           if(text != "")
                           {
                             generatorType = text;
                           }
                         }

                         for (var i = 0; i < base.ownedElements.length; i++) {
                           var elem = base.ownedElements[i];
                           if (elem instanceof type.UMLClass) {

                             var modelName = elem.name;
                             //GET ATTRIBUTES FROM CLASS
                             for (var n = 0; n < elem.attributes.length; n++) {
                               var attribute = elem.attributes[n];
                               if(typeof attribute.type === "string"){
                                 models[elem.name] = models[elem.name] || []
                                 models[elem.name].push(
                                   {"attributeName": attribute.name,
                                  "attributeType": attribute.type}
                                    );
                               }
                             }
                             //END GET ATTRIBUTES

                             //GET ASSOCIATIONS
                             for (var n = 0; n < elem.ownedElements.length; n++) {
                               var association = elem.ownedElements[n];
                               if(association instanceof type.UMLAssociation)
                               {
                                 var end1 = association.end1;
                                 var end2 = association.end2;

                                 var ref1 = end1.reference;
                                 var ref2 = end2.reference;

                                 var ref1Name = ref1.name;
                                 var ref2Name = ref2.name;

                                 //MANY TO MANY
                                 if(end1.multiplicity=="*"&&end2.multiplicity=="*")
                                 {
                                   var tableName = [ref1.name, ref2.name].sort().join("_");

                                   models[tableName] = []
                                    models[tableName].push(
                                      {"attributeName": ref1Name, "attributeType": "references"}
                                      );
                                    models[tableName].push(
                                      {"attributeName": ref2Name, "attributeType": "references"}
                                      );
                                 }
                                 else if(end1.multiplicity == "*")
                                 {
                                   models[ref2.name] = models[ref2.name] || []
                                   models[ref2.name].push(
                                      {"attributeName":ref1Name,
                                      "attributeType" : "references"}
                                    )
                                 }
                                 else if(end2.multiplicity == "*")
                                 {
                                   models[ref2.name] = models[ref2.name] || []
                                    models[ref2.name].push(
                                      {"attributeName":ref1Name,
                                      "attributeType" : "references"}
                                    )
                                 }
                               }
                             }
                             //END GET ASSOCIATIONS
                           }
                         }

                         //create generator strings out of the models hash
                         var generators = "";
                         for(var model in models)
                         {
                           if(models.hasOwnProperty(model))
                           {
                             generators += "rails generate " + generatorType + " " + model;
                             var attributes = models[model];
                             for (var i = 0; i < attributes.length; i++) {
                               var kvp = attributes[i];
                               generators += " " + kvp["attributeName"] + ":" + kvp["attributeType"];
                             }
                           }
                           generators += "\n\n";
                         }

                         Dialogs.showTextDialog("Here's your generators:", generators.toLowerCase());
                       });

                   } else {
                       result.reject();
                   }
                });
      }
       return result.promise();

    }

    CommandManager.register("Rails", CMD_RAILS, CommandManager.doNothing);
    CommandManager.register("Generate Generators", CMD_RAILS_GENERATE, _handleGenerate);
    // Add HellWorld menu item (Tools > Hello World)
    var menu = MenuManager.getMenu(Commands.TOOLS);
    var menuItem = menu.addMenuItem(CMD_RAILS);
    menuItem.addMenuItem(CMD_RAILS_GENERATE);

});
