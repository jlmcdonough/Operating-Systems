/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentFontColor = _DefaultFontColor, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "", inputHistory = [], inputHistoryIndex = 0) {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentFontColor = currentFontColor;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.inputHistory = inputHistory;
            this.inputHistoryIndex = inputHistoryIndex;
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    //add to input history
                    this.inputHistory[this.inputHistory.length] = this.buffer;
                    this.inputHistoryIndex = this.inputHistory.length;
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) { //the backspace key
                    if (this.buffer.length > 0) //save the trouble if nothing to be deleted
                     {
                        let toBeDeleted = this.buffer[this.buffer.length - 1];
                        this.deleteChr(toBeDeleted);
                        this.buffer = this.buffer.substring(0, this.buffer.length - 1); //reduces buffer size so cannot delete more than should be able to
                    }
                }
                else if (chr == String.fromCharCode(9)) { //the tab key
                    if (this.buffer.length > 0) {
                        let myCommands = _OsShell.commandList;
                        let matchCommands = [];
                        let userInput = this.buffer;
                        myCommands.forEach(function (cmd) {
                            if (cmd.command.startsWith(userInput)) //substring(0, userInput.length) == userInput)
                             {
                                matchCommands[matchCommands.length] = cmd;
                            }
                        });
                        if (matchCommands.length === 1) {
                            this.deleteStr(this.buffer);
                            this.putText(matchCommands[0].command);
                            this.buffer = matchCommands[0].command;
                        }
                        else if (matchCommands.length > 1) {
                            this.advanceLine();
                            this.putText("The following commands begin with " + userInput + ":");
                            this.advanceLine();
                            for (let x = 0; x < matchCommands.length; x++) {
                                this.putText(matchCommands[x].command);
                                this.advanceLine();
                            }
                            _OsShell.putPrompt();
                            this.putText(userInput);
                        }
                    }
                }
                //up arrow wants the most recent
                else if (chr == String.fromCharCode(38)) { //up arrow
                    if (this.inputHistoryIndex > 0) {
                        this.inputHistoryIndex--;
                        this.deleteStr(this.buffer);
                        this.putText(this.inputHistory[this.inputHistoryIndex]);
                        this.buffer = this.inputHistory[this.inputHistoryIndex];
                    }
                }
                //down arrow goes back, cannot be first to be used
                else if (chr == String.fromCharCode(40)) { //down arrow
                    if ((this.inputHistoryIndex < this.inputHistory.length - 1) &&
                        (this.inputHistoryIndex >= -1)) {
                        this.inputHistoryIndex++;
                        this.deleteStr(this.buffer);
                        this.putText(this.inputHistory[this.inputHistoryIndex]);
                        this.buffer = this.inputHistory[this.inputHistoryIndex];
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        putText(text) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        }
        advanceLine() {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
        }
        deleteChr(chr) {
            if (this.buffer.length > 0) {
                let xAdjust = _DrawingContext.measureText(this.currentFont, this.currentFontSize, chr);
                this.currentXPosition = this.currentXPosition - xAdjust;
                _DrawingContext.deleteText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, chr);
            }
        }
        deleteStr(str) {
            while (str.length > 0) {
                this.deleteChr(str[str.length - 1]);
                str = str.slice(0, -1);
            }
        }
        BSOD() {
            this.clearScreen();
            _DrawingContext.fillStyle = "#85b0c4";
            _DrawingContext.fillRect(0, 0, 500, 500); //dimensions set in div style divConsole in index.html
            this.currentXPosition = 50;
            this.currentYPosition = 50;
            _DefaultFontColor = "#ffffff"; //temporary overrides default color to white, won't effect a reboot since the default default is black
            this.putText("An error has occured. Shutting down...");
            _OsShell.promptStr = ""; //remove cursor
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map