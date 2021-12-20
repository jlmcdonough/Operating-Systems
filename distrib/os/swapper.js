var TSOS;
(function (TSOS) {
    class Swapper {
        constructor(rolledOutData = "", rolledInData = "") {
            this.rolledOutData = rolledOutData;
            this.rolledInData = rolledInData;
        }
        rollIn(diskPCB, segment) {
            this.rolledInData = _krnDiskDriver.fileShellRead("~" + diskPCB.pid, true);
            let byteToWrite = "";
            let addressCounter = 0;
            diskPCB.segmentData(segment);
            _PCB = diskPCB;
            _MemoryAccessor.nukeMemory(diskPCB.segment);
            for (let i = 0; i < ((diskPCB.limit - diskPCB.base) * 2); i += 2) {
                if (i < (this.rolledInData.length - 2)) {
                    byteToWrite = this.rolledInData.charAt(i) + this.rolledInData.charAt(i + 1);
                    if (!((byteToWrite.charCodeAt(0) == 0) && (byteToWrite.charCodeAt(1) == 0))) {
                        _MemoryAccessor.write(diskPCB.segment, TSOS.Utils.decimalToHex(addressCounter), byteToWrite);
                        addressCounter++;
                    }
                }
            }
            let fileName = "~" + diskPCB.pid;
            _krnDiskDriver.fileDelete(fileName);
            diskPCB.location = "Memory";
            _Kernel.krnTrace("Rolling in process " + diskPCB.pid);
            TSOS.Control.updateVisuals(diskPCB.pc, diskPCB.segment);
        }
        rollOut(memPCB) {
            for (let i = 0; i < (memPCB.limit - memPCB.base); i++) {
                this.rolledOutData += _MemoryAccessor.read(memPCB.segment, i, memPCB) + " ";
            }
            this.rolledOutData = this.rolledOutData.trim();
            let splitData = this.rolledOutData.split(" ");
            _MemoryAccessor.nukeMemory(memPCB.segment);
            memPCB.location = "Disk";
            memPCB.base = 768;
            memPCB.limit = 768;
            memPCB.segment = -1;
            _krnDiskDriver.fileCreateSwap(memPCB.pid, splitData);
            _Kernel.krnTrace("Rolling out process " + memPCB.pid);
            this.rolledOutData = "";
        }
    }
    TSOS.Swapper = Swapper;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=swapper.js.map