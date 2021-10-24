module TSOS {

    export class MemoryAccessor {

        constructor() {
        }

        public write(segment: number, atAddress: string, newData: string) : void
        {
            console.log("WRITING: " + _MemoryManager.segmentOffset(segment, Utils.hexToDecimal(atAddress)));
            _Memory.override(_MemoryManager.segmentOffset(segment, Utils.hexToDecimal(atAddress)), newData);
        }

        public read(segment: number, atAddress: number) : string
        {
            console.log("READING: " + _MemoryManager.segmentOffset(segment, atAddress));
            return _Memory.getAt(_MemoryManager.segmentOffset(segment, atAddress) );
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
                    console.log("EXCEEDING MEMORY: TO IMPLEMENT ERROR");
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