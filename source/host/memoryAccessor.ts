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

        public read(segment: number, atAddress: number) : string
        {
            let valueToRead = _MemoryManager.segmentOffset(segment, atAddress);
            if ( (_PCB.base <= valueToRead) && (valueToRead <= _PCB.limit) )
            {
                return _Memory.getAt(valueToRead);
            }
            else
            {
                Utils.memoryOutOfBoundsError();
            }

        }

        public loadMemory(userEntry: string, segmentNumber: number): void
        {
            let userArr = userEntry.split(" ");

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