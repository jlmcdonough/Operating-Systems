module TSOS
{
    export class Swapper
    {
        constructor(public rolledOutData: string = "",
                    public rolledInData: string = "") {
        }


        public rollIn(diskPCB: Pcb, segment: number): void
        {
            console.log("ROLLLING IN");
            this.rolledInData = _krnDiskDriver.fileShellRead("~" + diskPCB.pid);
            console.log("ROLLED IN DATA: " + this.rolledInData);
            let byteToWrite = "";
            let addressCounter = 0;

            let oldPCB = _PCB;

            diskPCB.segmentData(segment);
            _PCB = diskPCB;

            _MemoryAccessor.nukeMemory(diskPCB.segment);

            for (let i = 0; i < (diskPCB.limit - diskPCB.base); i+=3)
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

            Control.updateVisuals(diskPCB.pc, diskPCB.segment);
        }

        public rollOut(memPCB: Pcb): void
        {
            console.log("ROLLING OUT");

            for (let i = 0; i < (memPCB.limit - memPCB.base); i++)
            {
                this.rolledOutData += _MemoryAccessor.read(memPCB.segment, i, memPCB) + " ";
            }

            console.log("ROLLED OUT DATA: " + this.rolledOutData)
            this.rolledOutData = this.rolledOutData.trim();
            let splitData = this.rolledOutData.split(" ");

            _MemoryAccessor.nukeMemory(memPCB.segment);

            memPCB.location = "Disk";
            memPCB.base = 768;
            memPCB.limit = 768;
            memPCB.segment = -1;

            _krnDiskDriver.fileCreateSwap(memPCB.pid, splitData);

            this.rolledOutData = "";
            //this.rollIn(_PCBList[3], 1);
        }

    }
}