module TSOS
{
    export class Swapper
    {
        constructor(public rolledOutData: string = "",
                    public rolledInData: string = "") {
        }


        public rollIn(diskPCB: Pcb, segment: number): void
        {
            this.rolledInData = _krnDiskDriver.fileShellRead("~" + diskPCB.pid);

            console.log("ROLLED IN: " + this.rolledInData);

            let byteToWrite = "";
            let addressCounter = 0;

            let oldPCB = _PCB;

            diskPCB.segmentData(segment);
            _PCB = diskPCB;

            _MemoryAccessor.nukeMemory(diskPCB.segment);

            for (let i = 0; i < ( (diskPCB.limit - diskPCB.base) * 3); i+=3)
            {
                if ( i < (this.rolledInData.length - 3) )
                {
                    byteToWrite = this.rolledInData.charAt(i) + this.rolledInData.charAt(i+1);

                    if (! ( (byteToWrite.charCodeAt(0) == 0) && (byteToWrite.charCodeAt(1) == 0) ) )
                    {
                        _MemoryAccessor.write(diskPCB.segment, Utils.decimalToHex(addressCounter), byteToWrite);
                        addressCounter++;
                    }
                }
            }

            let fileName = "~" + diskPCB.pid;
            _krnDiskDriver.fileDelete(fileName);

            diskPCB.location = "Memory";
            _Kernel.krnTrace("Rolling in process " + diskPCB.pid);
            Control.updateVisuals(diskPCB.pc, diskPCB.segment);
        }

        public rollOut(memPCB: Pcb): void
        {
            for (let i = 0; i < (memPCB.limit - memPCB.base); i++)
            {
                this.rolledOutData += _MemoryAccessor.read(memPCB.segment, i, memPCB) + " ";
            }

            this.rolledOutData = this.rolledOutData.trim();

            console.log("ROLLED OUT DATA: " + this.rolledOutData);

            let splitData = this.rolledOutData.split(" ");

            _MemoryAccessor.nukeMemory(memPCB.segment);

            memPCB.location = "Disk";
            memPCB.base = 768;
            memPCB.limit = 768;
            memPCB.segment = -1;

            _krnDiskDriver.fileCreateSwap(memPCB.pid, splitData);
            _Kernel.krnTrace("Rolling out process " + memPCB.pid);

            this.rolledOutData = "";
        }

    }
}