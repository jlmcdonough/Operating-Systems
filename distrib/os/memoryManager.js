var TSOS;
(function (TSOS) {
    class MemoryManager {
        constructor() {
        }
        segmentEmpty(segment) {
            //segments are 1, 2, 3 yet array indices are 0, 1, 2
            if (0 < segment && segment <= 3) {
                for (let i = 0; i < _PCBList.length; i++) {
                    if (_PCBList[i].segment == segment) {
                        return false;
                    }
                }
                return true;
            }
            else {
                return false;
            }
        }
        segmentReallocate(segment) {
            if (0 < segment && segment <= 3) {
                if (!((_PCBList[segment - 1].state === "Running") || (_PCBList[segment - 1].state === "Resident"))) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        segmentOffset(segment, address) {
            let offset = 0;
            switch (segment) {
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
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map