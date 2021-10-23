module TSOS {
    export class MemoryManager {
        constructor() {
        }

    public segmentEmpty(segment: number) : boolean
    {
        //segments are 1, 2, 3 yet array indices are 0, 1, 2
        if (0 < segment && segment <= 3)
        {
            /*switch (segment)
            {
                case 1:
                    if (_MemoryAccessor.read(1, 0) == "00")
                        return true;
                    else if( ! ( (_ReadyQueue[segment - 1].state === "Ready") || (_ReadyQueue[segment - 1].state === "Resident") ) )
                        return true;
                    else
                        return false;
                case 2:
                    if (_MemoryAccessor.read(2, 0) == "00")
                        return true;
                    else if( ! ( (_ReadyQueue[segment - 1].state === "Ready") || (_ReadyQueue[segment - 1].state === "Resident") ) )
                        return true;
                    else
                        return false;
                case 3:
                    if (_MemoryAccessor.read(3, 0) == "00")
                        return true;
                    else if( ! ( (_ReadyQueue[segment - 1].state === "Ready") || (_ReadyQueue[segment - 1].state === "Resident") ) )
                        return true;
                    else
                        return false;
                default:
                    return false;
            }*/

            if (_MemoryAccessor.read(segment, 0) === "00")
            {
                return true;
            }
            else
            {
                return false;
            }

        }
        else
        {
            return false;
        }
    }

    public segmentReallocate(segment: number) : boolean
    {
        if (0 < segment && segment <= 3)
        {
            if ( ! ( (_ReadyQueue[segment - 1].state === "Ready") || (_ReadyQueue[segment - 1].state === "Resident") ) )
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    public segmentOffset(segment : number, address: number) : number
    {
        let offset = 0;
        switch(segment)
        {
            case 1:
                offset = address + _Memory.segmentOneBase;
                break;
            case 2:
                offset = address + _Memory.segmentTwoBase;
                break;
            case 3:
                offset = address + _Memory.segmentThreeBase;
                break;

        }
        return offset;
    }


    }
}