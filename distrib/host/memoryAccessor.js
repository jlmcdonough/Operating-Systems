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
        read(segment, atAddress) {
            let valueToRead = _MemoryManager.segmentOffset(segment, atAddress);
            if ((_PCB.base <= valueToRead) && (valueToRead <= _PCB.limit)) {
                return _Memory.getAt(valueToRead);
            }
            else {
                TSOS.Utils.memoryOutOfBoundsError();
            }
        }
        loadMemory(userEntry, segmentNumber) {
            let userArr = userEntry.split(" ");
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