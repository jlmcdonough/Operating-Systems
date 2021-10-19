module TSOS {
    export class MemoryManager {
        constructor() {
        }

    public segmentAvailable(segment: number) : boolean
    {
        //segments are 1, 2, 3 yet array indices are 0, 1, 2
        if (0 < segment && segment <= 3)
        {
            console.log("approaching switch");
            switch (segment)
            {
                case 1:
                    console.log("case 1");
                    if (_MemoryAccessor.read(_Memory.segmentOneBase) == "00")
                        return true;
                    else if( ! ( (_ReadyQueue[segment - 1].state === "Ready") || (_ReadyQueue[segment - 1].state === "Resident") ) )
                        return true;
                    else
                        return false;
                case 2:
                    console.log("case 2");
                    if (_MemoryAccessor.read(_Memory.segmentTwoBase) == "00")
                        return true;
                    else if( ! ( (_ReadyQueue[segment - 1].state === "Ready") || (_ReadyQueue[segment - 1].state === "Resident") ) )
                        return true;
                    else
                        return false;
                case 3:
                    console.log("case 3");
                    if (_MemoryAccessor.read(_Memory.segmentThreeBase) == "00")
                        return true;
                    else if( ! ( (_ReadyQueue[segment - 1].state === "Ready") || (_ReadyQueue[segment - 1].state === "Resident") ) )
                        return true;
                    else
                        return false;
                default:
                    return false;
            }
        }
        else
        {
            console.log("avoid switch");
            return false;
        }
    }


    }
}