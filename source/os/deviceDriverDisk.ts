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

            for (let i = 0; i < 4; i++)
            {
                emptyBlockMemory[i] = 0;
            }
            for (let j = 4; j < emptyBlockMemory.length; j++)
            {
                emptyBlockMemory[j] = "-";
            }

            console.log("EMPTY: " + emptyBlockMemory);
            for (let x = 0; x < _Disk.trackCount; x++)
            {
                for (let y = 0; y < _Disk.sectorCount; y++)
                {
                    for (let z = 0; z < _Disk.blockCount; z++)
                    {
                        if ( (x == 0) && (y == 0) && (z == 0) ) //Master Boot Record set to used so never overriden
                        {
                            emptyBlockMemory[0] = 1;
                            sessionStorage.setItem(x + "," + y + "," + z,
                                emptyBlockMemory.join(" ") );
                            emptyBlockMemory[0] = 0;
                        }
                        else
                        {
                            sessionStorage.setItem(x + "," + y + "," + z,
                                emptyBlockMemory.join(" ") );
                        }
                    }
                }
            }

            Control.diskUpdateTable();
        }

        public fileCreate(fileName: string): void
        {
            let tsbName = this.nextTSBName();
            let tsbData = this.nextTSBData();

            let tsbNameData = sessionStorage.getItem(tsbName).split(" ");
            let tsbDataData = sessionStorage.getItem(tsbData).split(" ");

            tsbNameData[0] = "1"
            tsbDataData[0] = "1"

            let tsbDataSplit = tsbData.split(",")
            tsbNameData[1] = tsbDataSplit[0];
            tsbNameData[2] = tsbDataSplit[1];
            tsbNameData[3] = tsbDataSplit[2];

            for (let i = 0; i < fileName.length; i++)
            {
                tsbNameData[i + 4] = Utils.decimalToHex(fileName.charCodeAt(i));
            }

            sessionStorage.setItem(tsbName, tsbNameData.join(" "));
            sessionStorage.setItem(tsbData, tsbDataData.join(" "));

            Control.diskUpdateTable();
        }

        public nextTSBName(): string
        {
            for (let i = 0; i < _Disk.sectorCount; i++)
            {
                for (let j = 0; j < _Disk.blockCount; j++)
                {
                    let thisData = sessionStorage.getItem("0," + i + "," + j).split(" ");

                    if (thisData[0] === "0")
                    {
                        return "0" + "," + i + "," + j;
                    }

                }
            }
            return "full";
        }

        public nextTSBData(): string
        {
            for (let i = 1; i < _Disk.trackCount; i++)
            {
                for (let j = 0; j < _Disk.sectorCount; j++)
                {
                    for (let k = 0; k < _Disk.blockCount; k++)
                    {
                        let thisData = sessionStorage.getItem(i + "," + j + "," + k).split(" ");

                        if (thisData[0] === "0")
                        {
                            return i + "," + j + "," + k;
                        }
                    }
                }
            }

            return "full";
        }

    }
}
