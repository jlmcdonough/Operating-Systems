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
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Runs the specified user program.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "displays the PID and state of all current processes.");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "resets all memory");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "runs every program");
            this.commandList[this.commandList.length] = sc;
            // kill
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<id> - kills the specified process id.");
            this.commandList[this.commandList.length] = sc;
            // killall
            sc = new TSOS.ShellCommand(this.shellKillAll, "killall", "kills all processes.");
            this.commandList[this.commandList.length] = sc;
            // kill
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<number> - sets the quantum to number.");
            this.commandList[this.commandList.length] = sc;
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
                        _StdOut.putText("LOAD will load the specified user program and will be verified such that only hex code and spaces are valid.");
                        break;
                    case "run":
                        _StdOut.putText("RUN will run the specified user program, denoted by the process ID that was assigned when loaded.");
                        break;
                    case "ps":
                        _StdOut.putText("PS will print a list of all the PCBs that are currently stored as well as their Process IDs.");
                        break;
                    case "clearmem":
                        _StdOut.putText("CLEARMEM will empty out all the memory partitions and essentially reset all memory.");
                        break;
                    case "runall":
                        _StdOut.putText("RUNALL will begin to execute all programs at once.");
                        break;
                    case "kill":
                        _StdOut.putText("KILL will the program specified by the entered process ID.");
                        break;
                    case "killall":
                        _StdOut.putText("KILLALL will kill every process that is running.");
                        break;
                    case "quantum":
                        _StdOut.putText("QUANTUM will set the quantum for round robin scheduling by the user entered number.");
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
                    TSOS.Control.memoryUpdateTable();
                    let segmentOneAvailable = _MemoryManager.segmentEmpty(1);
                    let segmentTwoAvailable = _MemoryManager.segmentEmpty(2);
                    let segmentThreeAvailable = _MemoryManager.segmentEmpty(3);
                    if (!segmentOneAvailable && !segmentTwoAvailable && !segmentThreeAvailable) {
                        segmentOneAvailable = _MemoryManager.segmentReallocate(1);
                        segmentTwoAvailable = _MemoryManager.segmentReallocate(2);
                        segmentThreeAvailable = _MemoryManager.segmentReallocate(3);
                    }
                    if (_ReadyQueue.length > 0 && ((!segmentOneAvailable) && (!segmentTwoAvailable) && (!segmentThreeAvailable))) {
                        _StdOut.putText("There is already 3 programs stored in memory. Cannot load another");
                    }
                    else {
                        let priority;
                        //ensures that the load priority is a number
                        if (isNaN(Number(args[0]))) {
                            _StdOut.putText("It is recommended to include a priority after the load command. Priority was given 99 to this instance.");
                            priority = 99;
                        }
                        else {
                            priority = Number(args[0]);
                        }
                        let thisSegment;
                        if (segmentOneAvailable) {
                            thisSegment = 1;
                        }
                        else if (segmentTwoAvailable) {
                            thisSegment = 2;
                        }
                        else if (segmentThreeAvailable) {
                            thisSegment = 3;
                        }
                        _PCB = new TSOS.Pcb();
                        _PCB.init(priority, thisSegment);
                        let lowerLimit;
                        if (segmentOneAvailable) {
                            console.log("LOADING INTO 0");
                            _ReadyQueue[0] = _PCB;
                        }
                        else if (segmentTwoAvailable) {
                            console.log("LOADING INTO 1");
                            _ReadyQueue[1] = _PCB;
                        }
                        else if (segmentThreeAvailable) {
                            console.log("LOADING INTO 2");
                            _ReadyQueue[2] = _PCB;
                        }
                        else {
                            _StdOut.putText("ERROR LOADING PROGRAM INTO MEMORY");
                        }
                        _MemoryAccessor.nukeMemory(thisSegment);
                        _MemoryAccessor.loadMemory(trimmedInput, thisSegment);
                        TSOS.Control.updateVisuals(0);
                        _StdOut.putText("Successfully loaded user program with priority " + priority);
                        _StdOut.advanceLine();
                        _StdOut.putText("Your program is stored at process ID " + (_ProcessID - 1));
                    }
                }
                else {
                    _StdOut.putText("Please enter valid hex in the program input area.");
                }
            }
            else {
                _StdOut.putText("Populate the user program input area with code before running the load command");
            }
        }
        shellRun(args) {
            //ensures that the run is a number
            if (!isNaN(Number(args[0]))) {
                let neverFound = true;
                for (let i = 0; i < _ReadyQueue.length; i++) {
                    if (_ReadyQueue[i].pid === Number(args[0])) {
                        if (_ReadyQueue[i].state === "Resident") {
                            _PCB = _ReadyQueue[i];
                            _CPU.updateCpuMatchPcb();
                            _PCB.state = "Running";
                            _CPU.isExecuting = true;
                            _StdOut.putText("Running the program stored at: " + args[0]);
                            TSOS.Control.updateVisuals(_PCB.pc);
                        }
                        else {
                            _StdOut.putText("The program stored at " + args[0] + " is not resident");
                        }
                        neverFound = false;
                        break;
                    }
                }
                if (neverFound) {
                    _StdOut.putText("There is no program with that PID number");
                }
            }
            else {
                _StdOut.putText("A positive integer must follow the run command.");
            }
        }
        shellPs(args) {
            if (_ReadyQueue.length > 0) {
                for (let i = 0; i < _ReadyQueue.length; i++) {
                    _StdOut.putText("Process ID: " + _ReadyQueue[i].pid + " State: " + _ReadyQueue[i].state + " Segment: " + _ReadyQueue[i].segment + " Program Counter: " + _ReadyQueue[i].pc + " Priority: " + _ReadyQueue[i].priority);
                    _StdOut.advanceLine();
                }
            }
            else {
                _StdOut.putText("No loaded processes to display");
            }
        }
        shellClearMem(args) {
            if (_CPU.isExecuting) {
                _StdOut.putText("Cannot clear the memory while there are running processes.");
            }
            else {
                _MemoryAccessor.nukeMemory(1);
                _MemoryAccessor.nukeMemory(2);
                _MemoryAccessor.nukeMemory(3);
                TSOS.Control.memoryUpdateTable();
                _StdOut.putText("Memory has been reset.");
            }
        }
        shellRunAll(args) {
            for (let i = 0; i < _ReadyQueue.length; i++) {
                if (_ReadyQueue[i].state === "Resident") {
                    _PCB = _ReadyQueue[i];
                    _CPU.updateCpuMatchPcb();
                    _PCB.state = "Running";
                    _CPU.isExecuting = true;
                    _StdOut.putText("Running the program stored at: " + args[0]);
                    TSOS.Control.updateVisuals(_PCB.pc);
                }
            }
        }
        shellKill(args) {
            if (!isNaN(Number(args[0]))) {
                let thisPID = Number(args[0]);
                let notFound = true;
                for (let i = 0; i < _ReadyQueue.length; i++) {
                    if (_ReadyQueue[i].pid == thisPID) {
                        notFound = false;
                        if (_ReadyQueue[i].state === "Running") {
                            _CPU.isExecuting = false;
                            _PCB.state = "Stopped";
                            _StdOut.putText("Process " + thisPID + " terminated.");
                        }
                        if (_ReadyQueue[i].state === "Resident") {
                            _PCB.state = "Stopped";
                            _StdOut.putText("Process " + thisPID + " terminated.");
                        }
                        if (_ReadyQueue[i].state === "Finished" || _ReadyQueue[i].state === "Stopped") {
                            _StdOut.putText("Process " + thisPID + " is not resident or running.");
                        }
                        TSOS.Control.updateVisuals(0);
                    }
                }
                if (notFound) {
                    _StdOut.putText("Process " + thisPID + " does not exist in the current queue.");
                }
            }
            else {
                _StdOut.putText("Enter a valid process id after kill");
            }
        }
        shellKillAll(args) {
            _CPU.isExecuting = false;
            for (let i = 0; i < _ReadyQueue.length; i++) {
                _ReadyQueue[i].state = "Stopped";
            }
            _StdOut.putText("All stored processes killed");
            TSOS.Control.updateVisuals(0);
        }
        shellQuantum(args) {
            console.log("ARGS: " + args);
            console.log("ARGS length: " + args.length);
            console.log(Number(args[0]));
            console.log("ARGS[0]: " + args[0]);
            if (args.length == 0) {
                _StdOut.putText("Current quantum is " + _Quantum);
                _StdOut.advanceLine();
                _StdOut.putText("To change this, add a number to the quantum command.");
            }
            else if (args.length == 1 && !isNaN(Number(args[0]))) {
                let userQuantum = Number(args[0]);
                if (userQuantum > 0) {
                    _Quantum = userQuantum;
                    _StdOut.putText("Quantum updated to " + _Quantum);
                }
                else {
                    _StdOut.putText("Quantum must be greater than 0.");
                }
            }
            else {
                _StdOut.putText("Quantum command must have nothing follow it, or just a valid positive integer.");
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map