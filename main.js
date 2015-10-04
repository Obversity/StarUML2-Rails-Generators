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
    function _handleGenerate(base, path, options){
      var result = new $.Deferred();
      console.log(result);

       // If options is not passed, get from preference
      // options = options || CsharpPreferences.getGenOptions();

       // If base is not assigned, popup ElementPicker
       if (!base) {
           ElementPickerDialog.showDialog("Select a base model to generate codes", null, type.UMLPackage)
               .done(function (buttonId, selected) {
                   if (buttonId === Dialogs.DIALOG_BTN_OK && selected) {
                       base = selected;
                       console.log(base);

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

                         var generators = "";

                         for (var i = 0; i < base.ownedElements.length; i++) {
                           var elem = base.ownedElements[i];
                           if (elem instanceof type.UMLClass) {
                             var generatorString = "rails generate " + generatorType + " " + elem.name + " ";
                             for (var n = 0; n < elem.attributes.length; n++) {
                               var attribute = elem.attributes[n];
                               if(typeof attribute.type === "string"){
                                 generatorString += attribute.name + ":" + attribute.type + " ";
                               }
                             }
                             generators += generatorString + "\n\n"
                           }
                         }
                         Dialogs.showTextDialog("Here's your generators:", generators);
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
