/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        constructor() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereAmI
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Displays the users current location.");
            this.commandList[this.commandList.length] = sc;
            // diceRoll
            sc = new TSOS.ShellCommand(this.shellDiceRoll, "diceroll", "- Rolls two six-sided dice.");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Modifies the status message");
            this.commandList[this.commandList.length] = sc;
            // BSOD
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- Triggers blue screen of death.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "<priority> - Loads the specified user program.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            //buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Make only the command lowercase
            cmd = cmd.toLowerCase();
            // 4.3 Record it in the return value.
            retVal.command = cmd;
            // 5.1 if status, want to keep spaces
            if (retVal.command == "status") {
                let statusMessage = "";
                for (let j in tempList) {
                    statusMessage += tempList[j] + " ";
                }
                statusMessage = statusMessage.trim();
                retVal.args[0] = statusMessage;
            }
            // 5.2 Now create the args array from what's left (if not status)
            else {
                for (var i in tempList) {
                    var arg = TSOS.Utils.trim(tempList[i]);
                    if (arg != "") {
                        retVal.args[retVal.args.length] = tempList[i];
                        console.log("argsLength: " + retVal.args.length);
                    }
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    case "ver":
                        _StdOut.putText("VER displays the current version for " + APP_NAME + ".");
                        break;
                    case "shutdown":
                        _StdOut.putText("SHUTDOWN will shutdown " + APP_NAME + " while leaving the hardware running.");
                        break;
                    case "cls":
                        _StdOut.putText("CLS will clear the canvas window and sets the cursor back to the start.");
                        break;
                    case "trace":
                        _StdOut.putText("TRACE can be toggled ON or OFF. TRACE ON allows the host log to update and trace user inputs. TRACE OFF freezes the host log.");
                        break;
                    case "rot13":
                        _StdOut.putText("ROT13 will shift all characters in the following string to the right by 13 characters.");
                        break;
                    case "prompt":
                        _StdOut.putText("PROMPT will replace the current prompt (i.e. \">\" by default) with the following string.");
                        break;
                    case "date":
                        _StdOut.putText("DATE displays the users current date and time based off their system location.");
                        break;
                    case "whereami":
                        _StdOut.putText("WHEREAMI displays the users current physical location, not location in the OS.");
                        break;
                    case "diceroll":
                        _StdOut.putText("DICEROLL rolls two six sided dice and then displays the result of each one and their sum.");
                        break;
                    case "status":
                        _StdOut.putText("STATUS customizes the status message to the following string.");
                        break;
                    case "bsod":
                        _StdOut.putText("BSOD triggers a blue screen of death, the same way it would trap an OS error.");
                        break;
                    case "load":
                        _StdOut.putText("LOAD will load specified user program and will be verified such that only hex code and spaces are valid.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellDate(args) {
            _StdOut.putText(Date());
        }
        shellWhereAmI(args) {
            _StdOut.putText("You are currently located at 51.6032° N, 0.0657° W, nah don't actually know. That would be neat though");
        }
        shellDiceRoll(args) {
            let die1 = Math.floor(Math.random() * 6) + 1;
            let die2 = Math.floor(Math.random() * 6) + 1;
            _StdOut.putText("Die 1: " + die1 + " Die 2: " + die2 + " TOTAL: " + (die1 + die2));
        }
        shellStatus(args) {
            if (args.length > 0) {
                let status = "";
                args.forEach(function (char) {
                    status += char;
                });
                _StdOut.putText("Status updated to: " + status);
                TSOS.Control.hostStatus(status);
            }
            else {
                _StdOut.putText("Status must contain at least one character.");
            }
        }
        shellBSOD(args) {
            _Kernel.krnTrapError("Manual trigger of BSOD.");
        }
        shellLoad(args) {
            //do not want the input to either be blank or just spaces
            if (_taProgramInput.value.length > 0 && _taProgramInput.value.trim()) {
                //ensures that the load priority is a number
                if (!isNaN(Number(args[0]))) {
                    let priority = Number(args[0]);
                    let validHex = true;
                    let trimmedInput = _taProgramInput.value.replace(/(\r\n|\n|\r)/gm, "").replace(/\s/g, ""); //removes whitespace
                    trimmedInput = trimmedInput.replace(/.{1,2}(?=(.{2})+$)/g, '$& '); //add space after every second character
                    let charArray = Array.from(trimmedInput.toLocaleUpperCase());
                    charArray.forEach(function (char) {
                        switch (char) { //checks to make sure only hex digits were entered
                            case " ":
                                break;
                            case "0":
                                break;
                            case "1":
                                break;
                            case "2":
                                break;
                            case "3":
                                break;
                            case "4":
                                break;
                            case "5":
                                break;
                            case "6":
                                break;
                            case "7":
                                break;
                            case "8":
                                break;
                            case "9":
                                break;
                            case "A":
                                break;
                            case "B":
                                break;
                            case "C":
                                break;
                            case "D":
                                break;
                            case "E":
                                break;
                            case "F":
                                break;
                            default: validHex = false;
                        }
                    });
                    if (validHex) {
                        _StdOut.putText("Successfully loaded user program with priority " + priority);
                    }
                    else {
                        _StdOut.putText("Please enter valid hex in the program input area.");
                    }
                }
                else {
                    _StdOut.putText("The load function must be entered with a priority number after it");
                }
            }
            else {
                _StdOut.putText("Populate the user program input area with code before running the load command");
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map