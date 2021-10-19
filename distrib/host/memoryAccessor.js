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
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map