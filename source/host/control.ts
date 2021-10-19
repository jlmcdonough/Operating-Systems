/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            _taProgramInput = <HTMLTextAreaElement>document.getElementById('taProgramInput');

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }

        //Date and Time for header
        public static hostCurrDateTime(): void {
            document.getElementById("dateTime").innerHTML = "Date - " + new Date().toLocaleDateString() + " Time - " + new Date().toLocaleTimeString();
        }

        //Status for header
        public static hostStatus(status): void {
            document.getElementById("status").innerHTML = "Status - " + status;
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. enable the Single Step On buttons
            (<HTMLButtonElement>document.getElementById("btnSingleStepOn")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStepStep")).disabled = false;

            // .. disable the Single Step Off button
            (<HTMLButtonElement>document.getElementById("btnSingleStepOff")).disabled = true;


            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            _Memory = new Memory();
            _Memory.init();

            _MemoryAccessor = new MemoryAccessor();

            _PCB = new Pcb();

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static hostBtnSSOff_click(btn): void
        {
            _SingleStep = false;

            (<HTMLButtonElement>document.getElementById("btnSingleStepOff")).disabled = true;
            (<HTMLButtonElement>document.getElementById("btnSingleStepOn")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStepStep")).disabled = true;

        }

        public static hostBtnSSOn_click(btn): void
        {
            _SingleStep = true;

            (<HTMLButtonElement>document.getElementById("btnSingleStepOff")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStepOn")).disabled = true;
            (<HTMLButtonElement>document.getElementById("btnSingleStepStep")).disabled = false;

        }

        public static hostBtnSSStep_click(btn): void
        {
            _SingleStepStep = true;
        }

        public static cpuUpdateTable(): void
        {
            if (_CPU.isExecuting)
            {
                document.getElementById("cpuPC").innerHTML = Utils.padHex(Utils.decimalToHex(_CPU.pc));
                document.getElementById("cpuIR").innerHTML = _CPU.ir;
                document.getElementById("cpuAcc").innerHTML = _CPU.acc;
                document.getElementById("cpuX").innerHTML = _CPU.xReg;
                document.getElementById("cpuY").innerHTML = _CPU.yReg;
                document.getElementById("cpuZ").innerHTML = _CPU.zFlag.toString();
            }
            else
            {
                document.getElementById("cpuPC").innerHTML = "-";
                document.getElementById("cpuIR").innerHTML = "-";
                document.getElementById("cpuAcc").innerHTML = "-";
                document.getElementById("cpuX").innerHTML = "-";
                document.getElementById("cpuY").innerHTML = "-";
                document.getElementById("cpuZ").innerHTML = "-";
            }
        }

        public static memoryUpdateTable(): void
        {
            let table = document.getElementById("memoryTable");
            let tableBody = "<tbody>";

            for (let i = 0; i < _Memory.memorySize; i += 0x8)
            {
                let stringHex = i.toString(16);
                let longHex = "000" + stringHex;        //0 would be 000, so assume worst case, best case is FFF and then the 000 would be removed anyways
                let normalizedHex = longHex.substring(longHex.length - 3); //take last 3 elements
                let row = "0x" + normalizedHex;

                tableBody += `<tr><td>${row}</td>`;

                for (let j = i; j < i + 8; j += 0x1)
                {
                    tableBody +=`<td>${_Memory.memoryBlock[j]}</td>`;
                }

                tableBody += "</tr>";
            }

            tableBody += "</tbody>";
            table.innerHTML = tableBody;
        }

        public static pcbUpdateTable(): void
        {
            document.getElementById("pcbPC").innerHTML = Utils.padHex(Utils.decimalToHex(_PCB.pc));;
            document.getElementById("pcbAcc").innerHTML = _PCB.acc;
            document.getElementById("pcbX").innerHTML = _PCB.xReg;
            document.getElementById("pcbY").innerHTML = _PCB.yReg;
            document.getElementById("pcbZ").innerHTML = _PCB.zFlag.toString();
            document.getElementById("pcbPriority").innerHTML = _PCB.priority.toString();
            document.getElementById("pcbState").innerHTML = _PCB.state;
            document.getElementById("pcbLocation").innerHTML = _PCB.location;
        }
    }
}
