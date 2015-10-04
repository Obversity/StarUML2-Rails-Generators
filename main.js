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
                       var generators = "";

                       for (var i = 0; i < base.ownedElements.length; i++) {
                         var elem = base.ownedElements[i];

                         if (elem instanceof type.UMLClass) {
                           var generatorString = "rails generate scaffold ";
                           for (var n = 0; n < elem.attributes.length; n++) {
                             var attribute = elem.attributes[n];
                             generatorString += attribute.name + ":" + attribute.type + " ";
                           }
                           generators += generatorString + "\n"

                         }

                       }

                       alert(generators); 

                       // If path is not assigned, popup Open Dialog to select a folder

                          // CsharpCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);

                   } else {
                       result.reject();
                   }
                });
      } //else {
      //      // If path is not assigned, popup Open Dialog to select a folder
      //      if (!path) {
      //          FileSystem.showOpenDialog(false, true, "Select a folder where generated codes to be located", null, null, function (err, files) {
      //              if (!err) {
      //                  if (files.length > 0) {
      //                      path = files[0];
      //                      CsharpCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);
      //                  } else {
      //                      result.reject(FileSystem.USER_CANCELED);
      //                  }
      //              } else {
      //                  result.reject(err);
      //              }
      //          });
      //      } else {
      //          CsharpCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);
      //      }
      //  }
       return result.promise();

    }

    CommandManager.register("Rails", CMD_RAILS, CommandManager.doNothing);
    CommandManager.register("Generate Generators", CMD_RAILS_GENERATE, _handleGenerate);
    // Add HellWorld menu item (Tools > Hello World)
    var menu = MenuManager.getMenu(Commands.TOOLS);
    var menuItem = menu.addMenuItem(CMD_RAILS);
    menuItem.addMenuItem(CMD_RAILS_GENERATE);

});
