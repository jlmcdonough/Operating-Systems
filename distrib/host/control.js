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
var TSOS;
(function (TSOS) {
    class Control {
        static hostInit() {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            _taProgramInput = document.getElementById('taProgramInput');
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }
        static hostLog(msg, source = "?") {
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        }
        static toggleAppearance() {
            // Aware this does not "compile" but it works as if it does.
            // Assuming it has something to do with html importing a script instead
            // of npm installing the dark-mode-toggle
            document.addEventListener('colorschemechange', (e) => {
                _APPEARANCE = document.querySelector('dark-mode-toggle').attributes[5].value;
                console.log("Apperance switched to " + _APPEARANCE);
                if (_APPEARANCE === "light") {
                    console.log("SWITCHING CANVAS TO BLACK TEXT");
                    _DefaultFontColor = "#121212";
                    let image = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                    let data = image.data;
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = 0 - data[i];
                        data[i + 1] = 0 - data[i + 1];
                        data[i + 2] = 0 - data[i + 2];
                    }
                    _DrawingContext.putImageData(image, 0, 0);
                }
                else {
                    console.log("SWITCHING CANVAS TO WHITE TEXT");
                    _DefaultFontColor = "#ffffff";
                    let image = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                    let data = image.data;
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] = 255 - data[i];
                        data[i + 1] = 255 - data[i + 1];
                        data[i + 2] = 255 - data[i + 2];
                    }
                    _DrawingContext.putImageData(image, 0, 0);
                }
            });
        }
        //Date and Time for header
        static hostCurrDateTime() {
            document.getElementById("dateTime").innerHTML = "Date - " + new Date().toLocaleDateString() + " Time - " + new Date().toLocaleTimeString();
        }
        //Status for header
        static hostStatus(status) {
            document.getElementById("status").innerHTML = "Status - " + status;
        }
        //
        // Host Events
        //
        static hostBtnStartOS_click(btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. enable the Single Step On buttons
            document.getElementById("btnSingleStepOn").disabled = false;
            document.getElementById("btnSingleStepStep").disabled = false;
            // .. disable the Single Step Off button
            document.getElementById("btnSingleStepOff").disabled = true;
            // .. enable the Memory tracker
            document.getElementById("btnMemoryTrack").disabled = false;
            document.getElementById("btnMemoryTrack").style.backgroundColor = "green";
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            _Memory = new TSOS.Memory();
            _Memory.init();
            _MemoryAccessor = new TSOS.MemoryAccessor();
            _Disk = new TSOS.Disk();
            _PCB = new TSOS.Pcb();
            _Scheduler = new TSOS.Scheduler();
            _Scheduler.init();
            _Dispatcher = new TSOS.Dispatcher();
            _Swapper = new TSOS.Swapper();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        }
        static hostBtnHaltOS_click(btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }
        static hostBtnReset_click(btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
        static hostBtnSSOff_click(btn) {
            _IsSingleStep = false;
            document.getElementById("btnSingleStepOff").disabled = true;
            document.getElementById("btnSingleStepOn").disabled = false;
            document.getElementById("btnSingleStepStep").disabled = true;
        }
        static hostBtnSSOn_click(btn) {
            _IsSingleStep = true;
            document.getElementById("btnSingleStepOff").disabled = false;
            document.getElementById("btnSingleStepOn").disabled = true;
            document.getElementById("btnSingleStepStep").disabled = false;
        }
        static hostBtnSSStep_click(btn) {
            _IsSingleStepStep = true;
        }
        static hostBtnMemoryTrack_click(btn) {
            if (_MemoryTracking) {
                _MemoryTracking = false;
                document.getElementById("btnMemoryTrack").style.backgroundColor = "red";
            }
            else {
                _MemoryTracking = true;
                document.getElementById("btnMemoryTrack").style.backgroundColor = "green";
            }
        }
        static cpuUpdateTable(oldPC) {
            if (_CPU.isExecuting) {
                document.getElementById("cpuPC").innerHTML = TSOS.Utils.padHex(TSOS.Utils.decimalToHex(oldPC));
                document.getElementById("cpuIR").innerHTML = _CPU.ir;
                document.getElementById("cpuAcc").innerHTML = _CPU.acc;
                document.getElementById("cpuX").innerHTML = _CPU.xReg;
                document.getElementById("cpuY").innerHTML = _CPU.yReg;
                document.getElementById("cpuZ").innerHTML = _CPU.zFlag.toString();
            }
            else {
                document.getElementById("cpuPC").innerHTML = "-";
                document.getElementById("cpuIR").innerHTML = "-";
                document.getElementById("cpuAcc").innerHTML = "-";
                document.getElementById("cpuX").innerHTML = "-";
                document.getElementById("cpuY").innerHTML = "-";
                document.getElementById("cpuZ").innerHTML = "-";
            }
        }
        static memoryUpdateTable() {
            let table = document.getElementById("memoryTable");
            let tableBody = "<tbody>";
            for (let i = 0; i < _Memory.memorySize; i += 0x8) {
                let stringHex = i.toString(16);
                let longHex = "000" + stringHex; //0 would be 000, so assume worst case, best case is FFF and then the 000 would be removed anyways
                let normalizedHex = longHex.substring(longHex.length - 3); //take last 3 elements
                let row = "0x" + normalizedHex;
                tableBody += `<tr><td>${row}</td>`;
                for (let j = i; j < i + 8; j += 0x1) {
                    tableBody += "<td " + `id=mem${j}>` + _Memory.memoryBlock[j] + "</td>";
                }
                tableBody += "</tr>";
            }
            tableBody += "</tbody>";
            table.innerHTML = tableBody;
        }
        static memoryTableColor(pc, operandCount, segment) {
            if ((segment > 0) && (segment < 4)) {
                let offset = (segment - 1) * 256;
                let mainHighlight, secondaryHighlight;
                if (_APPEARANCE === "dark") {
                    mainHighlight = "#3700B3";
                    secondaryHighlight = "#BB86FC";
                }
                else if (_APPEARANCE === "light") {
                    mainHighlight = "#1E88E5";
                    secondaryHighlight = "#BBDEFB";
                }
                document.getElementById("mem" + (pc + offset)).style.backgroundColor = mainHighlight;
                for (let i = 1; i <= operandCount; i++) {
                    document.getElementById("mem" + ((pc + offset) + i)).style.backgroundColor = secondaryHighlight;
                    if (_MemoryTracking) {
                        document.getElementById("mem" + ((pc + offset) + i)).scrollIntoView({ block: 'nearest' });
                    }
                }
            }
        }
        static pcbUpdateTable(oldPC) {
            let table = document.getElementById("pcbTable");
            let tableBody = "<tbody>" + "<tr>" +
                "<th>PID</th><th>PC</th><th>Acc</th><th>X</th><th>Y</th><th>Z</th><th>Priority</th><th>State</th><th>Location</th><th>Mem. Base</th><th>Mem. Limit</th><th>Segment</th><th>Running Quanta</th>" +
                "</tr>";
            for (let i = 0; i < _PCBList.length; i++) {
                let pcbPC;
                if (_PCBList[i].state === "Running") {
                    pcbPC = TSOS.Utils.padHex(TSOS.Utils.decimalToHex(oldPC));
                }
                else {
                    pcbPC = TSOS.Utils.padHex(TSOS.Utils.decimalToHex(_PCBList[i].pc));
                }
                tableBody += "<tr>" +
                    `<td> ${_PCBList[i].pid} </td>` +
                    `<td> ${pcbPC} </td>` +
                    `<td> ${_PCBList[i].acc} </td>` +
                    `<td> ${_PCBList[i].xReg} </td>` +
                    `<td> ${_PCBList[i].yReg} </td>` +
                    `<td> ${_PCBList[i].zFlag.toString()} </td>` +
                    `<td> ${_PCBList[i].priority.toString()} </td>` +
                    `<td> ${_PCBList[i].state} </td>` +
                    `<td> ${_PCBList[i].location} </td>` +
                    `<td> ${_PCBList[i].base} </td>` +
                    `<td> ${_PCBList[i].limit} </td>` +
                    `<td> ${_PCBList[i].segment} </td>` +
                    `<td> ${_PCBList[i].runningQuanta} </td>` +
                    "</tr>";
            }
            tableBody += "</tbody>";
            table.innerHTML = tableBody;
        }
        static diskUpdateTable() {
            let table = document.getElementById("diskTable");
            let tableBody = "<tbody>" + "<tr>" +
                "<th>T:S:B</th><th>Used</th><th>Next</th><th>Data</th>" +
                "</tr>";
            for (let i = 0; i < _Disk.trackCount; i++) {
                for (let j = 0; j < _Disk.sectorCount; j++) {
                    for (let k = 0; k < _Disk.blockCount; k++) {
                        let data = sessionStorage.getItem(i + "," + j + "," + k).split(" ");
                        let thisData = "";
                        for (let x = 4; x < data.length; x++) {
                            thisData += (data[x] + " ");
                        }
                        thisData.trim();
                        tableBody += "<tr>" +
                            `<td> ${i + ',' + j + ',' + k} </td>` +
                            `<td> ${data[0]} </td>` +
                            `<td> ${data[1] + ',' + data[2] + ',' + data[3]} </td>` +
                            `<td> ${thisData} </td>`;
                    }
                }
            }
            tableBody += "</tbody>";
            table.innerHTML = tableBody;
        }
        static updateVisuals(oldPC, segment) {
            Control.cpuUpdateTable(oldPC);
            Control.pcbUpdateTable(oldPC);
            if (_IsDiskFormatted) {
                Control.diskUpdateTable();
            }
            Control.memoryUpdateTable();
            if (typeof segment !== 'undefined') {
                Control.memoryTableColor(oldPC, operandCount, segment);
            }
            else {
                Control.memoryTableColor(oldPC, operandCount, _PCB.segment);
            }
        }
        static swapFileSafety(fileName) {
            if (fileName.charAt(0) === "~") {
                return false;
            }
            else {
                return true;
            }
        }
    }
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map