/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        format() {
            let emptyBlockMemory = new Array(64);
            for (let i = 0; i < emptyBlockMemory.length; i++) {
                emptyBlockMemory[i] = "-";
            }
            for (let i = 0; i < _Disk.trackCount; i++) {
                for (let j = 0; j < _Disk.sectorCount; j++) {
                    for (let k = 0; k < _Disk.blockCount; k++) {
                        sessionStorage.setItem(i + "," + j + "," + k, emptyBlockMemory.join(" "));
                    }
                }
            }
            TSOS.Control.diskUpdateTable();
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map