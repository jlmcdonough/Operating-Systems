/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
        }

        public krnKbdDriverEntry(): void
        {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public format(): void
        {
            let emptyBlockMemory = new Array(64)

            for (let i = 0; i < emptyBlockMemory.length; i++)
            {
                emptyBlockMemory[i] = "-";
            }

            for (let i = 0; i < _Disk.trackCount; i++)
            {
                for (let j = 0; j < _Disk.sectorCount; j++)
                {
                    for (let k = 0; k < _Disk.blockCount; k++)
                    {
                        sessionStorage.setItem(i + "," + j + "," + k,
                                                emptyBlockMemory.join(" ") );
                    }
                }
            }

            Control.diskUpdateTable();
        }

    }
}
