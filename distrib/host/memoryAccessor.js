var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        }
        write(segment, atAddress, newData) {
            let valueToRead = _MemoryManager.segmentOffset(segment, TSOS.Utils.hexToDecimal(atAddress));
            if ((_PCB.base <= valueToRead) && (valueToRead <= _PCB.limit)) {
                _Memory.override(_MemoryManager.segmentOffset(segment, TSOS.Utils.hexToDecimal(atAddress)), newData);
            }
            else {
                TSOS.Utils.memoryOutOfBoundsError();
            }
        }
        read(segment, atAddress, pcb) {
            let valueToRead = _MemoryManager.segmentOffset(segment, atAddress);
            let useThisPcb;
            if (pcb != undefined) {
                console.log("DEFINED, THEREFORE USING: " + pcb.pid);
                useThisPcb = pcb;
            }
            else {
                console.log("UNDEFINED, THEREFORE USING: " + _PCB.pid);
                useThisPcb = _PCB;
            }
            console.log("VAL TO READ: " + valueToRead + " SEG: " + segment + " @ ADD: " + atAddress);
            console.log("BASE : " + useThisPcb.base + " LIMIT: " + useThisPcb.limit);
            if ((useThisPcb.base <= valueToRead) && (valueToRead <= useThisPcb.limit)) {
                console.log("SHOULD BE: " + _Memory.memoryBlock[valueToRead]);
                return _Memory.getAt(valueToRead);
            }
            else {
                console.log("IN ELSE");
                TSOS.Utils.memoryOutOfBoundsError();
            }
            console.log("END OF READ");
        }
        loadMemory(userEntry, segmentNumber, pid) {
            let userArr = userEntry.split(" ");
            if (segmentNumber < 4) {
                let points = TSOS.Utils.segmentStuff(segmentNumber);
                let startingPoint = points[0];
                let maxPoint = points[1];
                for (let i = 0; i < userArr.length; i++) {
                    if (i <= maxPoint - startingPoint) {
                        _Memory.memoryBlock[i + startingPoint] = userArr[i];
                    }
                    else {
                        TSOS.Utils.memoryOutOfBoundsError();
                    }
                }
            }
            else {
                _krnDiskDriver.fileCreateSwap(pid, userArr);
            }
        }
        nukeMemory(segmentNumber) {
            let points = TSOS.Utils.segmentStuff(segmentNumber);
            let startingPoint = points[0];
            let maxPoint = points[1];
            for (let i = startingPoint; i < maxPoint; i++) {
                _Memory.memoryBlock[i] = "00";
            }
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map