module TSOS {

    export class MemoryAccessor {

        constructor() {
        }

        public write(segment: number, atAddress: string, newData: string) : void
        {
            let valueToRead = _MemoryManager.segmentOffset(segment, Utils.hexToDecimal(atAddress));
            if ( (_PCB.base <= valueToRead) && (valueToRead <= _PCB.limit) )
            {
                _Memory.override(_MemoryManager.segmentOffset(segment, Utils.hexToDecimal(atAddress)), newData);
            }
            else
            {
                Utils.memoryOutOfBoundsError();
            }
        }

        public read(segment: number, atAddress: number, pcb?: Pcb) : string
        {
            let valueToRead = _MemoryManager.segmentOffset(segment, atAddress);
            let useThisPcb;

            if (pcb != undefined)
            {
                console.log("DEFINED, THEREFORE USING: " + pcb.pid);
                useThisPcb = pcb;
            }
            else
            {
                console.log("UNDEFINED, THEREFORE USING: " + _PCB.pid);
                useThisPcb = _PCB;
            }

            console.log("VAL TO READ: " + valueToRead + " SEG: " + segment + " @ ADD: " + atAddress);
            console.log("BASE : " + useThisPcb.base + " LIMIT: " + useThisPcb.limit);

            if ( (useThisPcb.base <= valueToRead) && (valueToRead <= useThisPcb.limit) )
            {
                console.log("SHOULD BE: " + _Memory.memoryBlock[valueToRead]);
                return _Memory.getAt(valueToRead);
            }
            else
            {
                console.log("IN ELSE");
                Utils.memoryOutOfBoundsError();
            }
            console.log("END OF READ");
        }

        public loadMemory(userEntry: string, segmentNumber: number, pid?: number): void
        {
            let userArr = userEntry.split(" ");

            if (segmentNumber < 4)
            {
                let points = Utils.segmentStuff(segmentNumber);
                let startingPoint = points[0];
                let maxPoint = points[1];

                for(let i = 0; i < userArr.length; i++)
                {
                    if (i <= maxPoint - startingPoint)
                    {
                        _Memory.memoryBlock[i + startingPoint] = userArr[i];
                    }
                    else
                    {
                        Utils.memoryOutOfBoundsError();
                    }
                }
            }
            else
            {
                _krnDiskDriver.fileCreateSwap(pid, userArr);
            }
        }

        public nukeMemory(segmentNumber: number): void
        {
            let points = Utils.segmentStuff(segmentNumber);
            let startingPoint = points[0];
            let maxPoint = points[1];

            for(let i = startingPoint; i < maxPoint; i++)
            {
                _Memory.memoryBlock[i] = "00";
            }
        }
    }
}