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
                "- Displays the current version data");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                "help",
                "- This is the help command. Seek help");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                "shutdown",
                "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                "cls",
                "- Clears the screen and resets the cursor position");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                "man",
                "<topic> - Displays the MANual page for <topic>");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                "trace",
                "<on | off> - Turns the OS trace on or off");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                "rot13",
                "<string> - Does rot13 obfuscation on <string>");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                "prompt",
                "<string> - Sets the prompt");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                "date",
                "- Displays the date and time");
            this.commandList[this.commandList.length] = sc;

            // whereAmI
            sc = new ShellCommand(this.shellWhereAmI,
                "whereami",
                "- Displays the users current location");
            this.commandList[this.commandList.length] = sc;

            // diceRoll
            sc = new ShellCommand(this.shellDiceRoll,
                "diceroll",
                "- Rolls two six-sided dice");
            this.commandList[this.commandList.length] = sc;

            // status
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - Modifies the status message");
            this.commandList[this.commandList.length] = sc;

            // BSOD
            sc = new ShellCommand(this.shellBSOD,
                "bsod",
                "- Triggers blue screen of death");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                "load",
                "<priority> - Loads the specified user program");
            this.commandList[this.commandList.length] = sc;

            // run
            sc = new ShellCommand(this.shellRun,
                "run",
                "<pid> - Runs the specified user program");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            sc = new ShellCommand(this.shellPs,
                "ps",
                "- Displays the PID and state of all current processes");
            this.commandList[this.commandList.length] = sc;

            // clearmem
            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "- Resets all memory");
            this.commandList[this.commandList.length] = sc;

            // runall
            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "- Runs every program");
            this.commandList[this.commandList.length] = sc;

            // kill
            sc = new ShellCommand(this.shellKill,
                "kill",
                "<id> - Kills the specified process id");
            this.commandList[this.commandList.length] = sc;

            // killall
            sc = new ShellCommand(this.shellKillAll,
                "killall",
                "- Kills all processes");
            this.commandList[this.commandList.length] = sc;

            // quantum
            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "<number> - Sets the quantum to number");
            this.commandList[this.commandList.length] = sc;

            // create
            sc = new ShellCommand(this.shellCreate,
                "create",
                "<filename> - Creates new file");
            this.commandList[this.commandList.length] = sc;

            // read
            sc = new ShellCommand(this.shellRead,
                "read",
                "<filename> - Reads the file");
            this.commandList[this.commandList.length] = sc;

            // write
            sc = new ShellCommand(this.shellWrite,
                "write",
                "<filename> \"<data>\" - Writes to the following file");
            this.commandList[this.commandList.length] = sc;

            // delete
            sc = new ShellCommand(this.shellDelete,
                "delete",
                "<filename> - Removes the specified file");
            this.commandList[this.commandList.length] = sc;

            // format
            sc = new ShellCommand(this.shellFormat,
                "format",
                "- Initializes disks");
            this.commandList[this.commandList.length] = sc;

            // ls
            sc = new ShellCommand(this.shellLs,
                "ls",
                "- Displays files");
            this.commandList[this.commandList.length] = sc;

            // setschedule
            sc = new ShellCommand(this.shellSetSchedule,
                "setschedule",
                "<type> - Sets the scheduling algorithm");
            this.commandList[this.commandList.length] = sc;

            // getschedule
            sc = new ShellCommand(this.shellGetSchedule,
                "getschedule",
                "- Displays current scheduler");
            this.commandList[this.commandList.length] = sc;

            // rename
            sc = new ShellCommand(this.shellRename,
                "rename",
                "<oldfilename> <newfilename> - Renames a file");
            this.commandList[this.commandList.length] = sc;

            // copy
            sc = new ShellCommand(this.shellCopy,
                "copy",
                "<oldfilename> <newfilename> - copies a file");
            this.commandList[this.commandList.length] = sc;


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
                _StdOut.putText("must be the pride of [subject hometown here]");
            } else {
                _StdOut.putText("Type 'help' for, well... help");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch");
            _SarcasticMode = true;
        }

        public shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster");
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
            _StdOut.putText("Shutting down..");
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
                        _StdOut.putText("Help displays a list of (hopefully) valid commands");
                        break;

                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    case "ver":
                        _StdOut.putText("VER displays the current version for " + APP_NAME );
                        break;
                    case "shutdown":
                        _StdOut.putText("SHUTDOWN will shutdown " + APP_NAME + " while leaving the hardware running");
                        break;
                    case "cls":
                        _StdOut.putText("CLS will clear the canvas window and sets the cursor back to the start");
                        break;
                    case "trace":
                        _StdOut.putText("TRACE can be toggled ON or OFF. TRACE ON allows the host log to update and trace user inputs. TRACE OFF freezes the host log");
                        break;
                    case "rot13":
                        _StdOut.putText("ROT13 will shift all characters in the following string to the right by 13 characters");
                        break;
                    case "prompt":
                        _StdOut.putText("PROMPT will replace the current prompt (i.e. \">\" by default) with the following string");
                        break;
                    case "date":
                        _StdOut.putText("DATE displays the users current date and time based off their system location");
                        break;
                    case "whereami":
                        _StdOut.putText("WHEREAMI displays the users current physical location, not location in the OS");
                        break;
                    case "diceroll":
                        _StdOut.putText("DICEROLL rolls two six sided dice and then displays the result of each one and their sum");
                        break;
                    case "status":
                        _StdOut.putText("STATUS customizes the status message to the following string");
                        break;
                    case "bsod":
                        _StdOut.putText("BSOD triggers a blue screen of death, the same way it would trap an OS error");
                        break;
                    case "load":
                        _StdOut.putText("LOAD will load the specified user program and will be verified such that only hex code and spaces are valid");
                        break;
                    case "run":
                        _StdOut.putText("RUN will run the specified user program, denoted by the process ID that was assigned when loaded");
                        break;
                    case "ps":
                        _StdOut.putText("PS will print a list of all the PCBs that are currently stored as well as their Process IDs");
                        break;
                    case "clearmem":
                        _StdOut.putText("CLEARMEM will empty out all the memory partitions and essentially reset all memory");
                        break;
                    case "runall":
                        _StdOut.putText("RUNALL will begin to execute all programs at once");
                        break;
                    case "kill":
                        _StdOut.putText("KILL will the program specified by the entered process ID");
                        break;
                    case "killall":
                        _StdOut.putText("KILLALL will kill every process that is running");
                        break;
                    case "quantum":
                        _StdOut.putText("QUANTUM will set the quantum for round robin scheduling by the user entered number");
                        break;
                    case "create":
                        _StdOut.putText("CREATE will use the given name to create and store an empty file with the name");
                        break;
                    case "read":
                        _StdOut.putText("READ will display the contents of the file with the given name");
                        break;
                    case "write":
                        _StdOut.putText("WRITE will use the given name to write the following data to the file.");
                        break;
                    case "delete":
                        _StdOut.putText("DELETE will remove the file with the given name from disk");
                        break;
                    case "format":
                        _StdOut.putText("FORMAT will initialize all blocks in all sectors in all tracks");
                        break;
                    case "ls":
                        _StdOut.putText("LS will list the files currently stored on disk");
                        _StdOut.advanceLine();
                        _StdOut.putText("LS -a will list all, including hidden, files currently stored on disk");
                        break;
                    case "setschedule":
                        _StdOut.putText("SETSCHEDULE will change the scheduling strategy to requested type. Acceptable inputs are rr (round robin scheduling), fcfs (first come first serve scheduling), priority (non-preemptive priority scheduling)");
                        break;
                    case "getschedule":
                        _StdOut.putText("GETSCHEDULE will return the currently selected scheduling algorithm");
                        break;
                    case "rename":
                        _StdOut.putText("RENAME will change the old file name to the new one that is provided");
                        break;
                    case "copy":
                        _StdOut.putText("COPY will create a new file with a new name, with the same contents of the old file");
                        break;

                    default:
                        _StdOut.putText("No manual entry for " + args[0] );
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus");
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
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>");
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
                _StdOut.putText("Usage: rot13 <string>  Please supply a string");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string");
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
                _StdOut.putText("Status must contain at least one character");
            }
        }

        public shellBSOD(args: string[]) {
            _Kernel.krnTrapError("Manual trigger of BSOD")
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

                    let segmentOneAvailable = _MemoryManager.segmentEmpty(1);
                    let segmentTwoAvailable = _MemoryManager.segmentEmpty(2);
                    let segmentThreeAvailable = _MemoryManager.segmentEmpty(3);


                    if (!segmentOneAvailable && !segmentTwoAvailable && !segmentThreeAvailable)
                    {
                        segmentOneAvailable = _MemoryManager.segmentReallocate(1);
                        segmentTwoAvailable = _MemoryManager.segmentReallocate(2);
                        segmentThreeAvailable = _MemoryManager.segmentReallocate(3);
                    }

                    if(_PCBList.length > 0 && (
                        ( !segmentOneAvailable ) && ( !segmentTwoAvailable) && ( !segmentThreeAvailable) )
                    )
                    {
                        if (_IsDiskFormatted)
                        {
                            let priority;
                            //ensures that the load priority is a number
                            if (isNaN(Number(args[0])))
                            {
                                _StdOut.putText("It is recommended to include a priority after the load command. Priority was given 32 to this instance");
                                priority = 32;
                            }
                            else
                            {
                                priority = Number(args[0]);
                            }

                            let newPCB = new Pcb();
                            newPCB.init(priority);

                            newPCB.location = "Disk";
                            newPCB.base = 768;
                            newPCB.limit = 768;
                            newPCB.segment = -1;

                            _PCBList[_PCBList.length] = newPCB;

                            _MemoryAccessor.loadMemory(trimmedInput, newPCB.segment, newPCB.pid);
                            Control.updateVisuals(0, newPCB.segment);

                            _StdOut.putText("Successfully loaded user program with priority " + priority);
                            _StdOut.advanceLine();
                            _StdOut.putText("Your program is stored at process ID " + (_ProcessID - 1) );
                        }
                        else
                        {
                            _StdOut.putText("There is already 3 programs stored in memory. Cannot load another");
                            _StdOut.putText("Format the disk to allow for more programs to be stored")
                        }
                    }
                    else
                    {
                        let priority;
                        //ensures that the load priority is a number
                        if (isNaN(Number(args[0])))
                        {
                            _StdOut.putText("It is recommended to include a priority after the load command. Priority was given 32 to this instance");
                            priority = 32;
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
                        else
                        {
                            _StdOut.putText("ERROR LOADING PROGRAM INTO MEMORY");
                        }

                        if (segmentOneAvailable || segmentTwoAvailable || segmentThreeAvailable)
                        {
                            let newPCB = new Pcb();
                            newPCB.init(priority, thisSegment);
                            _PCBList[_PCBList.length] = newPCB;

                            _MemoryAccessor.nukeMemory(thisSegment);
                            _MemoryAccessor.loadMemory(trimmedInput, thisSegment);
                            Control.updateVisuals(0, thisSegment);

                            _StdOut.putText("Successfully loaded user program with priority " + priority);
                            _StdOut.advanceLine();
                            _StdOut.putText("Your program is stored at process ID " + (_ProcessID - 1) );
                        }
                    }
                }
                else
                {
                    _StdOut.putText("Please enter valid hex in the program input area");
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
                let neverFound = true;
                for(let i = 0; i < _PCBList.length; i++)
                {
                    if (_PCBList[i].pid === Number(args[0]) )
                    {
                        if (_PCBList[i].state === "Resident")
                        {
                            _PCBList[i].state = "Ready";
                            _Scheduler.readyQueue.enqueue(_PCBList[i]);
                            _Scheduler.doScheduling();
                        }
                        else
                        {
                            _StdOut.putText("The program stored at " + args[0] + " is not resident");
                        }

                        neverFound = false;
                        break;
                    }
                }

                if (neverFound)
                {
                    _StdOut.putText("There is no program with that PID number");
                }

            }
            else
            {
                _StdOut.putText("A positive integer must follow the run command");
            }
        }

        public shellPs(args: string[])
        {
            if (_PCBList.length > 0)
            {
                for (let i = 0; i < _PCBList.length; i++)
                {
                    _StdOut.putText("Process ID: " + _PCBList[i].pid + " State: " + _PCBList[i].state + " Segment: " + _PCBList[i].segment + " Program Counter: " + _PCBList[i].pc + " Priority: " + _PCBList[i].priority);
                    _StdOut.advanceLine();
                }
            }
            else
            {
                _StdOut.putText("No loaded processes to display");
            }
        }

        public shellClearMem(args: string[])
        {
            if (_CPU.isExecuting)
            {
                _StdOut.putText("Cannot clear the memory while there are running processes")
            }
            else
            {
                if (args.length == 0)
                {
                    _MemoryAccessor.nukeMemory(1);
                    _MemoryAccessor.nukeMemory(2);
                    _MemoryAccessor.nukeMemory(3);
                    Control.memoryUpdateTable();
                    _StdOut.putText("Memory has been reset");
                }
                else if (args.length == 1 && !isNaN(Number(args[0])))
                {
                    let segment = Number(args[0]);
                    if ( (segment > 0) && (segment < 4) )
                    {
                        _MemoryAccessor.nukeMemory(segment);
                        Control.memoryUpdateTable();
                        _StdOut.putText("Memory in segment " + segment + " has been reset");
                    }
                    else
                    {
                        _StdOut.putText("Segment must be between 1 and 3 (inclusive)")
                    }
                }
                else
                {
                    _StdOut.putText("Quantum command must have nothing follow it, or just a valid positive integer")
                }
            }
        }

        public shellRunAll(args: string[])
        {
            let canRun = false;

            for(let i = 0; i < _PCBList.length; i++)
            {
                if (_PCBList[i].state === "Resident")
                {
                    _PCBList[i].state = "Ready";
                    _Scheduler.readyQueue.enqueue(_PCBList[i]);
                    canRun = true;
                }
            }

            if (canRun)
            {
                _Scheduler.doScheduling();
            }
            else
            {
                _StdOut.putText("There are no programs to run");
            }
        }

        public shellKill(args: string[])
        {
            if (!isNaN(Number(args[0])))
            {
                let thisPID = Number(args[0]);
                let notFound = true;
                for (let i = 0; i < _PCBList.length; i++)
                {
                    if (_PCBList[i].pid == thisPID )
                    {
                        notFound = false;
                        if (_PCBList[i].state === "Resident" ||
                            _PCBList[i].state === "Running" ||
                            _PCBList[i].state === "Ready"
                        )
                        {
                            _PCBList[i].state = "Stopped";
                            _PCBList[i].endingCycle = _CycleCount;
                            _Scheduler.readyQueue.remove(_PCBList[i].pid);
                            _StdOut.putText("Process " + thisPID + " terminated");
                            _StdOut.advanceLine();
                            Utils.displayPCBAllData(_PCBList[i]);
                        }
                        else
                        {
                            _StdOut.putText("Process " + thisPID + " is not resident or running");
                        }


                        Control.updateVisuals(0);
                    }
                }

                if (notFound)
                {
                    _StdOut.putText("Process " + thisPID + " does not exist in the current queue");
                }
            }
            else
            {
                _StdOut.putText("Enter a valid process id after kill")
            }
        }

        public shellKillAll(args: string[])
        {
            _CPU.isExecuting = false;

            for (let i = 0; i < _PCBList.length; i++)
            {
                _PCBList[i].state = "Stopped";
                _PCBList[i].endingCycle = _CycleCount;
                _StdOut.putText("Process " + _PCBList[i].pid + " terminated");
                _StdOut.advanceLine();
                Utils.displayPCBAllData(_PCBList[i]);
            }
            _StdOut.putText("All stored processes killed");
            Control.updateVisuals(0);
        }

        public shellQuantum(args: string[])
        {
            if (args.length == 0)
            {
                _StdOut.putText("Current quantum is " + _RRQuantum);
                _StdOut.advanceLine();
                _StdOut.putText("To change this, add a number to the quantum command");
            }
            else if (args.length == 1 && !isNaN(Number(args[0])))
            {
                let userQuantum = Number(args[0]);
                if (userQuantum > 0)
                {
                    _RRQuantum = userQuantum;
                    _StdOut.putText("Quantum updated to " + _RRQuantum);

                    if (_Scheduler.schedulingSystem === "RR")
                    {
                        _Scheduler.quanta = _RRQuantum;
                    }
                }
                else
                {
                    _StdOut.putText("Quantum must be greater than 0")
                }
            }
            else
            {
                _StdOut.putText("Quantum command must have nothing follow it, or just a valid positive integer")
            }

        }

        public shellCreate(args: string[])
        {
            if (_IsDiskFormatted)
            {
                if (args.length == 1)
                {
                    if ( args[0].charAt(0) === "~")
                    {
                        _StdOut.putText("The file name cannot begin with ~");
                    }
                    else if ( _krnDiskDriver.fileCreate(args[0]) )
                    {
                        _StdOut.putText("File " + args[0] + " has been created");
                        Control.diskUpdateTable();
                    }
                    else
                    {
                        _StdOut.putText("The file name " + args[0] + " is already in use");
                    }
                }
                else
                {
                    _StdOut.putText("Must enter the name for file after the create command");
                }
            }
            else
            {
                _StdOut.putText("Disk must be formatted before performing any disk actions");
            }
        }

        public shellRead(args: string[])
        {
            if (_IsDiskFormatted)
            {
                if (args.length == 1)
                {
                    if (!Control.swapFileSafety(args[0]))
                    {
                        _StdOut.putText("Cannot access a swap file");
                    }
                    else
                    {
                        let fileData = _krnDiskDriver.fileShellRead(args[0]);
                        if (fileData != null)
                        {
                            _StdOut.putText("Contents of file " + args[0] + ":");
                            _StdOut.advanceLine();
                            _StdOut.putText(fileData);
                        }
                        else
                        {
                            _StdOut.putText("The file " + args[0] + " does not exist");
                        }
                    }
                }
                else
                {
                    _StdOut.putText("Must enter the name for file after the read command");
                }
            }
            else
            {
                _StdOut.putText("Disk must be formatted before performing any disk actions");
            }
        }

        public shellWrite(args: string[])
        {
            if (_IsDiskFormatted)
            {
                if (args.length > 1)
                {
                    let fileName = args[0];

                    if (!Control.swapFileSafety(fileName))
                    {
                        _StdOut.putText("Cannot access a swap file");
                    }
                    else
                    {
                        let writeFirst = args[1];
                        let writeLast = args[args.length - 1];
                        let toWrite = "";

                        if ( (writeFirst.charAt(0) === "\"") && (writeLast.charAt(writeLast.length - 1) === "\"") )
                        {
                            if (args.length == 2)
                            {
                                toWrite = writeFirst.substring(1, (writeFirst.length - 1) )
                            }
                            else
                            {
                                toWrite = writeFirst.substring(1, writeFirst.length) + " ";

                                for (let i = 2; i < args.length - 1; i++)
                                {
                                    toWrite += args[i] + " ";
                                }

                                toWrite += writeLast.substring(0, writeLast.length - 1);
                            }

                            if ( _krnDiskDriver.fileWrite(fileName, toWrite, false) )
                            {
                                _StdOut.putText("Writing to file " + fileName);
                                Control.diskUpdateTable();
                            }
                            else
                            {
                                _StdOut.putText("File " + fileName + " does not exist, cannot write");
                            }
                        }
                        else
                        {
                            _StdOut.putText("Must enter file name and text encompassed in quotation marks")
                        }
                    }
                }
                else
                {
                    _StdOut.putText("Must enter the name for file after the create command");
                }
            }
            else
            {
                _StdOut.putText("Disk must be formatted before performing any disk actions");
            }
        }

        public shellDelete(args: string[])
        {
            if (_IsDiskFormatted)
            {
                if (!Control.swapFileSafety(args[0]))
                {
                    _StdOut.putText("Cannot access a swap file");
                }
                else
                {
                    if ( _krnDiskDriver.fileDelete(args[0]) )
                    {
                        _StdOut.putText("File " + args[0] + " has been deleted");
                        Control.diskUpdateTable();
                    }
                    else
                    {
                        _StdOut.putText("File " + args[0] + " does not exist");
                    }
                }
            }
            else
            {
                _StdOut.putText("Disk must be formatted before performing any disk actions");
            }
        }

        public shellFormat(args: string[])
        {
            if (_CPU.isExecuting)
            {
                _StdOut.putText("Cannot format disk with a running CPU")
            }
            else
            {
                _krnDiskDriver.format();
                _IsDiskFormatted = true;
                _StdOut.putText("Disk has been formatted");
            }
        }

        public shellLs(args: string[])
        {
            if (_IsDiskFormatted)
            {
                console.log("ARGS COUNT: " + args.length);
                console.log("ARGS: " + args);

                if ( (args.length > 1) || ( (args.length == 1) && (args[0] != "-a") ) )
                {
                    _StdOut.putText("The only acceptable suffix is '-a'")
                }
                else
                {
                    let suffix = args[0]
                    let list;

                    if (suffix === "-a" || suffix === "-l")
                    {
                        list = _krnDiskDriver.fileList(suffix);
                    }
                    else
                    {
                        list = _krnDiskDriver.fileList();
                    }

                    if (list.length > 0)
                    {
                        _StdOut.putText("Current files:");
                        _StdOut.advanceLine();
                        for (let i = 0; i < list.length; i++)
                        {
                            _StdOut.putText("   -> " + list[i]);
                            _StdOut.advanceLine();
                        }
                    }
                    else
                    {
                        _StdOut.putText("There are currently no files on disk");
                    }
                }
            }
            else
            {
                _StdOut.putText("Disk must be formatted before performing any disk actions");
            }
        }

        public shellSetSchedule(args: string[])
        {
            if (! (_CPU.isExecuting) )
            {
                if (args.length != 1)
                {
                    _StdOut.putText("One and only one argument is required");
                }
                else
                {
                    if (args[0].toLocaleUpperCase() === "FCFS")
                    {
                        _Scheduler.quanta = _FCFSQuantum;
                        _Scheduler.schedulingSystem = "FCFS";
                        _StdOut.putText("Scheduling algorithm set to First Come First Serve (FCFS)");
                    }
                    else if (args[0].toLocaleUpperCase() === "RR")
                    {
                        _Scheduler.quanta = _RRQuantum;
                        _Scheduler.schedulingSystem = "RR";
                        _StdOut.putText("Scheduling algorithm set to Round Robin (RR) with a quantum of " + _Scheduler.quanta);
                    }
                    else if (args[0].toLocaleUpperCase() === "PRIORITY")
                    {
                        _Scheduler.schedulingSystem = "PRIORITY";
                        _StdOut.putText("Scheduling algorithm set to Non-Preemptive Priority (PRIORITY)");
                    }
                    else
                    {
                        _StdOut.putText("Please make sure you are only entering the correct abbreviation for the valid scheduling types. See manual for help")
                    }
                }
            }
            else
            {
                _StdOut.putText("Changing scheduler whilst programs are running is not permitted");
            }
        }

        public shellGetSchedule(args: string[])
        {
            _StdOut.putText("Current scheduling algorithm is " + _Scheduler.schedulingSystem);
        }

        public shellRename(args: string[])
        {
            if (_IsDiskFormatted)
            {
                if (args.length == 2)
                {
                    let oldName = args[0];
                    let newName = args[1];

                    if ( oldName.charAt(0) === "~")
                    {
                        _StdOut.putText("Cannot rename a swap file");
                    }
                    else if ( newName.charAt(0) === "~")
                    {
                        _StdOut.putText("The file name cannot begin with ~");
                    }
                    else
                    {
                        if ( _krnDiskDriver.getFileTSB(oldName) == null )
                        {
                            _StdOut.putText("File " + oldName + " does not exist");
                        }
                        else
                        {
                            let oldDirectoryData = sessionStorage.getItem(_krnDiskDriver.getFileTSB(oldName)).split(" ");
                            let newDirectoryData = _krnDiskDriver.createEmptyBlock();

                            for (let i = 0; i < 4; i++)
                            {
                                newDirectoryData[i] = oldDirectoryData[i];
                            }

                            for (let j = 0; j < args[1].length; j++)
                            {
                                newDirectoryData[j + 4] = Utils.decimalToHex(newName.charCodeAt(j));
                            }

                            _StdOut.putText("File " + oldName + " has been renamed to " + newName);

                            sessionStorage.setItem(_krnDiskDriver.getFileTSB(oldName), newDirectoryData.join(" "));
                            Control.diskUpdateTable();
                        }
                    }
                }
                else
                {
                    _StdOut.putText("Old file name and new file name must be provided in order to copy");
                }
            }
        }

        public shellCopy(args: string[])
        {
            if (_IsDiskFormatted)
            {
                if (args.length == 2)
                {
                    if ( args[0].charAt(0) === "~")
                    {
                        _StdOut.putText("Cannot copy a swap file");
                    }
                    else if ( args[1].charAt(0) === "~")
                    {
                        _StdOut.putText("The file name cannot begin with ~");
                    }
                    else
                    {
                        let oldFileContents = _krnDiskDriver.fileShellRead(args[0]);

                        if (oldFileContents == null)
                        {
                            _StdOut.putText("File " + args[0] + " does not exist and cannot been copied from");
                        }
                        else
                        {

                            if ( _krnDiskDriver.fileCreate(args[1]) )
                            {
                                _StdOut.putText("File " + args[1] + " does not exist, creating a new file to copy into");
                                _StdOut.advanceLine();
                            }
                            else
                            {
                                _StdOut.putText("File " + args[1] + " already exists, copy will overwrite");
                                _StdOut.advanceLine();
                            }

                            if ( _krnDiskDriver.fileWrite(args[1], oldFileContents, false) )
                            {
                                Control.diskUpdateTable();
                                _StdOut.putText("File " + args[0] + " has been successfully copied into " + args[1]);
                            }
                            else
                            {
                                _StdOut.putText("Error writing to file " + args[1]);
                            }
                        }
                    }
                }
                else
                {
                    _StdOut.putText("Original file and new file name must be provided in order to copy");
                }
            }
        }

    }
}
