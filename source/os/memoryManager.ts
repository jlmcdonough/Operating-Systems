module TSOS {
    export class MemoryManager {
        constructor() {
        }

    public segmentEmpty(segment: number) : boolean
    {
        //segments are 1, 2, 3 yet array indices are 0, 1, 2
        if (0 < segment && segment <= 3)
        {
            for (let i = 0; i < _PCBList.length; i++)
            {
                if (_PCBList[i].segment == segment)
                {
                    return false;
                }
            }
            return true;
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
            for (let i = 0; i < _PCBList.length; i++)
            {
                if (_PCBList[i].segment == segment)
                {
                    if ( (_PCBList[i].state === "Running") || (_PCBList[i].state === "Resident") )
                    {
                        return false;
                    }
                }
            }

            return true;
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