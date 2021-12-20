var TSOS;
(function (TSOS) {
    class Disk {
        constructor(trackCount = 4, sectorCount = 8, blockCount = 8, blockMemory = 64) {
            this.trackCount = trackCount;
            this.sectorCount = sectorCount;
            this.blockCount = blockCount;
            this.blockMemory = blockMemory;
        }
    }
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=disk.js.map