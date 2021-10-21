/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        private checkHexDigits: (value: string) => boolean;

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                "date",
                "- Displays the date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereAmI
            sc = new ShellCommand(this.shellWhereAmI,
                "whereami",
                "- Displays the users current location.");
            this.commandList[this.commandList.length] = sc;

            // diceRoll
            sc = new ShellCommand(this.shellDiceRoll,
                "diceroll",
                "- Rolls two six-sided dice.");
            this.commandList[this.commandList.length] = sc;

            // status
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - Modifies the status message");
            this.commandList[this.commandList.length] = sc;

            // BSOD
            sc = new ShellCommand(this.shellBSOD,
                "bsod",
                "- Triggers blue screen of death.");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                "load",
                "<priority> - Loads the specified user program.");
            this.commandList[this.commandList.length] = sc;

            // run
            sc = new ShellCommand(this.shellRun,
                "run",
                "<pid> - Runs the specified user program.");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            //buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);

            // 4.2 Make only the command lowercase
            cmd = cmd.toLowerCase();

            // 4.3 Record it in the return value.
            retVal.command = cmd;

            // 5.1 if status, want to keep spaces
            if(retVal.command == "status")
            {
                let statusMessage = "";
                for (let j in tempList)
                {
                    statusMessage += tempList[j] + " ";
                }
                statusMessage = statusMessage.trim();
                retVal.args[0] = statusMessage;
            }
            // 5.2 Now create the args array from what's left (if not status)
            else
            {
                for (var i in tempList) {
                    var arg = Utils.trim(tempList[i]);
                    if (arg != "")
                    {
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
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
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

                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate(args: string[]) {
            _StdOut.putText(Date());
        }

        public shellWhereAmI(args: string[]) {
            _StdOut.putText("You are currently located at 51.6032° N, 0.0657° W, nah don't actually know. That would be neat though");
        }

        public shellDiceRoll(args: string[]) {
            let die1 = Math.floor(Math.random() * 6) + 1
            let die2 = Math.floor(Math.random() * 6) + 1
            _StdOut.putText("Die 1: " + die1 + " Die 2: " + die2 + " TOTAL: " + (die1 + die2));
        }

        public shellStatus(args: string[]) {
            if(args.length > 0) {
                let status = "";
                args.forEach(function (char) {
                   status += char;
                });
                _StdOut.putText("Status updated to: " + status);
                Control.hostStatus(status)
            } else {
                _StdOut.putText("Status must contain at least one character.");
            }
        }

        public shellBSOD(args: string[]) {
            _Kernel.krnTrapError("Manual trigger of BSOD.")
        }

        public shellLoad(args: string[])
        {
            //do not want the input to either be blank or just spaces
            if (_taProgramInput.value.length > 0 && _taProgramInput.value.trim())
            {
                let validHex = true;
                let trimmedInput = _taProgramInput.value.replace(/(\r\n|\n|\r)/gm,"").replace(/\s/g,"");  //removes whitespace

                trimmedInput = trimmedInput.replace(/.{1,2}(?=(.{2})+$)/g, '$& ');  //add space after every second character

                let charArray = Array.from(trimmedInput.toLocaleUpperCase());

                charArray.forEach(function (char)
                {
                    switch (char){      //checks to make sure only hex digits were entered
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

                if(validHex)
                {
                    Control.memoryUpdateTable();
                    let segmentOneAvailable = _MemoryManager.segmentAvailable(1);
                    let segmentTwoAvailable = _MemoryManager.segmentAvailable(2);
                    let segmentThreeAvailable = _MemoryManager.segmentAvailable(3);

                    if(_ReadyQueue.length > 0 && (
                        ( !segmentOneAvailable ) && ( !segmentTwoAvailable) && ( !segmentThreeAvailable) )
                    )
                    {
                        _StdOut.putText("There is already 3 programs stored in memory. Cannot load another");
                    }
                    else
                    {
                        let priority;
                        //ensures that the load priority is a number
                        if (isNaN(Number(args[0])))
                        {
                            _StdOut.putText("It is recommended to include a priority after the load command. Priority was given 99 to this instance.");
                            priority = 99;
                        }
                        else
                        {
                            priority = Number(args[0]);
                        }

                        let thisSegment;
                        if(segmentOneAvailable)
                        {
                            thisSegment = 1;
                        }
                        else if(segmentTwoAvailable)
                        {
                            thisSegment = 2;
                        }
                        else if(segmentThreeAvailable)
                        {
                            thisSegment = 3;
                        }

                        _PCB = new Pcb();
                        _PCB.init(priority, thisSegment);

                        let lowerLimit;
                        if (segmentOneAvailable)
                        {
                            console.log("LOADING INTO 0")
                            _ReadyQueue[0] = _PCB;
                        }
                        else if (segmentTwoAvailable)
                        {
                            console.log("LOADING INTO 1")
                            _ReadyQueue[1] = _PCB;
                        }
                        else if (segmentThreeAvailable)
                        {
                            console.log("LOADING INTO 2")
                            _ReadyQueue[2] = _PCB;
                        }
                        else
                        {
                            _StdOut.putText("ERROR LOADING PROGRAM INTO MEMORY");
                        }
                        _MemoryAccessor.nukeMemory(thisSegment);
                        _MemoryAccessor.loadMemory(trimmedInput, thisSegment);
                        Control.updateVisuals(0);

                        _StdOut.putText("Successfully loaded user program with priority " + priority);
                        _StdOut.advanceLine();
                        _StdOut.putText("Your program is stored at process ID " + (_ProcessID - 1) );
                    }
                }
                else
                {
                    _StdOut.putText("Please enter valid hex in the program input area.");
                }
            }
            else
            {
                _StdOut.putText("Populate the user program input area with code before running the load command");
            }
        }

        public shellRun(args: string[])
        {
            //ensures that the run is a number
            if (!isNaN(Number(args[0])))
            {
                if( (_ReadyQueue.length - 1) >= Number(args[0]) )
                {
                    for(let i = 0; i < _ReadyQueue.length; i++)
                    {
                        if (_ReadyQueue[i].pid === Number(args[0]) )
                        {
                            if (_ReadyQueue[i].state === "Resident")
                            {
                                _PCB = _ReadyQueue[i];
                                _CPU.updateCpuMatchPcb();
                                _PCB.state = "Running";
                                _CPU.isExecuting = true;
                                _StdOut.putText("Running the program stored at: " + args[0]);
                                Control.updateVisuals(_PCB.pc);
                            }
                            else
                            {
                                _StdOut.putText("The program stored at " + args[0] + " is not resident");
                            }
                            break;
                        }
                    }

                }
                else
                {
                    _StdOut.putText("There is no program with that PID number");
                }
            }
            else
            {
                _StdOut.putText("Run function must be followed by a number")
            }
        }
    }
}
