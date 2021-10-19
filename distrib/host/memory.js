var TSOS;
(function (TSOS) {
    class Memory {
        constructor(memorySize = 256, memoryBlock = new Array(memorySize)) {
            this.memorySize = memorySize;
            this.memoryBlock = memoryBlock;
        }
        init() {
            for (let i = 0; i < this.memorySize; i++) {
                this.memoryBlock[i] = "00";
            }
            TSOS.Control.memoryUpdateTable();
        }
        getAt(atPC) {
            return this.memoryBlock[atPC];
        }
        override(atAddress, newData) {
            this.memoryBlock[TSOS.Utils.hexToDecimal(atAddress)] = newData;
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map