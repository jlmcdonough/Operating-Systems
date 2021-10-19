var TSOS;
(function (TSOS) {
    class Memory {
        constructor(memorySize = 768, memoryBlock = new Array(memorySize)) {
            this.memorySize = memorySize;
            this.memoryBlock = memoryBlock;
            this.segmentOneBase = 0;
            this.segmentOneLimit = 255;
            this.segmentTwoBase = 256;
            this.segmentTwoLimit = 511;
            this.segmentThreeBase = 512;
            this.segmentThreeLimit = 767;
        }
        init() {
            for (let i = 0; i < this.memorySize; i++) {
                this.memoryBlock[i] = "00";
            }
            TSOS.Control.memoryUpdateTable();
        }
        getAt(atPC) {
            console.log("IN getAT: ");
            console.log("ATPC: " + atPC);
            return this.memoryBlock[atPC];
        }
        override(atAddress, newData) {
            this.memoryBlock[atAddress] = newData;
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map