var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        }
        write(segment, atAddress, newData) {
            console.log("WRITING: " + _MemoryManager.segmentOffset(segment, TSOS.Utils.hexToDecimal(atAddress)));
            _Memory.override(_MemoryManager.segmentOffset(segment, TSOS.Utils.hexToDecimal(atAddress)), newData);
        }
        read(segment, atAddress) {
            console.log("READING: " + _MemoryManager.segmentOffset(segment, atAddress));
            return _Memory.getAt(_MemoryManager.segmentOffset(segment, atAddress));
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
                    console.log("EXCEEDING MEMORY: TO IMPLEMENT ERROR");
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