var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        }
        write(atAddress, newData) {
            _Memory.override(atAddress, newData);
        }
        read(atAddress) {
            return _Memory.getAt(atAddress);
        }
        loadMemory(userEntry) {
            let userArr = userEntry.split(" ");
            for (let i = 0; i < userArr.length; i++) {
                _Memory.memoryBlock[i] = userArr[i];
            }
        }
        nukeMemory() {
            _Memory.init();
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map