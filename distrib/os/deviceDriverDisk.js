/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        format() {
            let emptyBlockMemory = this.createEmptyBlock();
            for (let x = 0; x < _Disk.trackCount; x++) {
                for (let y = 0; y < _Disk.sectorCount; y++) {
                    for (let z = 0; z < _Disk.blockCount; z++) {
                        if ((x == 0) && (y == 0) && (z == 0)) //Master Boot Record set to used so never overriden
                         {
                            emptyBlockMemory[0] = 1;
                            sessionStorage.setItem(x + "," + y + "," + z, emptyBlockMemory.join(" "));
                            emptyBlockMemory[0] = 0;
                        }
                        else {
                            sessionStorage.setItem(x + "," + y + "," + z, emptyBlockMemory.join(" "));
                        }
                    }
                }
            }
            TSOS.Control.diskUpdateTable();
        }
        fileCreate(fileName) {
            let nameCheck = this.getFileTSB(fileName);
            if (nameCheck != null) {
                return false;
            }
            else {
                let tsbName = this.nextTSBName();
                let tsbData = this.nextTSBData();
                let tsbNameData = sessionStorage.getItem(tsbName).split(" ");
                let tsbDataData = sessionStorage.getItem(tsbData).split(" ");
                tsbNameData[0] = "1";
                tsbDataData[0] = "1";
                let tsbDataSplit = tsbData.split(",");
                tsbNameData[1] = tsbDataSplit[0];
                tsbNameData[2] = tsbDataSplit[1];
                tsbNameData[3] = tsbDataSplit[2];
                for (let i = 0; i < fileName.length; i++) {
                    tsbNameData[i + 4] = TSOS.Utils.decimalToHex(fileName.charCodeAt(i));
                }
                sessionStorage.setItem(tsbName, tsbNameData.join(" "));
                sessionStorage.setItem(tsbData, tsbDataData.join(" "));
                return true;
            }
        }
        fileCreateSwap(pid, fileData) {
            let fileName = "~" + pid;
            if (this.fileCreate(fileName)) {
                if (this.fileWrite(fileName, fileData.join(" "))) {
                    _Kernel.krnTrace("Swap file " + fileName + " created");
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
            return true;
        }
        fileWrite(fileName, fileData, nextTSB) {
            let tsbLocToWrite = this.dataTSBFromFileName(fileName);
            if (tsbLocToWrite != null) {
                //let tsbLocData = sessionStorage.getItem(tsbLocToWrite).split(" ");
                let tsbLocData = this.createEmptyBlock();
                if (fileData.length <= 60) {
                    for (let i = 0; i < fileData.length; i++) {
                        tsbLocData[i + 4] = TSOS.Utils.decimalToHex(fileData.charCodeAt(i));
                    }
                    tsbLocData[0] = "1";
                    let newLoc;
                    if (nextTSB != undefined) {
                        newLoc = nextTSB;
                    }
                    else {
                        newLoc = tsbLocToWrite;
                    }
                    tsbLocData[1] = "*";
                    tsbLocData[2] = "*";
                    tsbLocData[3] = "*";
                    sessionStorage.setItem(newLoc, tsbLocData.join(" "));
                }
                else {
                    let tsbLocData = this.createEmptyBlock();
                    for (let j = 0; j < 60; j++) {
                        tsbLocData[j + 4] = TSOS.Utils.decimalToHex(fileData.charCodeAt(j));
                    }
                    tsbLocData[0] = "1";
                    let newLoc;
                    if (nextTSB != undefined) {
                        newLoc = nextTSB;
                    }
                    else {
                        newLoc = tsbLocToWrite;
                    }
                    sessionStorage.setItem(newLoc, tsbLocData.join(" "));
                    let goNext = this.nextTSBData();
                    let goNextSplit = goNext.split(",");
                    let tempStorage = sessionStorage.getItem(newLoc).split(" ");
                    tempStorage[1] = goNextSplit[0];
                    tempStorage[2] = goNextSplit[1];
                    tempStorage[3] = goNextSplit[2];
                    sessionStorage.setItem(newLoc, tempStorage.join(" "));
                    let dataLeft = fileData.substring(60, fileData.length);
                    this.fileWrite(fileName, dataLeft, goNext);
                }
                return true;
            }
            else {
                return false;
            }
        }
        fileDelete(fileName) {
            let tsbToDelete = this.dataTSBFromFileName(fileName);
            if ((this.deleteFileData(tsbToDelete)) && (this.deleteFileTSB(fileName))) {
                return true;
            }
            else {
                return false;
            }
        }
        fileShellRead(fileName) {
            let tsbLocToWrite = this.dataTSBFromFileName(fileName);
            let ans = this.fileRead(tsbLocToWrite, "");
            return ans;
        }
        fileRead(fileLoc, fileData) {
            if (fileLoc != null) {
                let tsbLocData = sessionStorage.getItem(fileLoc).split(" ");
                for (let i = 4; i < tsbLocData.length; i++) {
                    fileData += String.fromCharCode(TSOS.Utils.hexToDecimal(tsbLocData[i]));
                }
                if (tsbLocData[1] != "*") {
                    let thisNext = tsbLocData[1] + "," + tsbLocData[2] + "," + tsbLocData[3];
                    return this.fileRead(thisNext, fileData);
                }
                else {
                    return fileData;
                }
            }
            else {
                return null;
            }
        }
        fileList() {
            let list = [];
            for (let i = 0; i < _Disk.sectorCount; i++) {
                for (let j = 0; j < _Disk.blockCount; j++) {
                    let thisData = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    if (!((i == 0) && (j == 0))) //ignore master boot record
                     {
                        if (thisData[0] === "1") {
                            let fileName = this.getFileName(thisData);
                            if (fileName.charAt(0) != "~") {
                                list[list.length] = fileName;
                            }
                        }
                    }
                }
            }
            return list;
        }
        nextTSBName() {
            for (let i = 0; i < _Disk.sectorCount; i++) {
                for (let j = 0; j < _Disk.blockCount; j++) {
                    let thisData = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    if (thisData[0] === "0") {
                        return "0" + "," + i + "," + j;
                    }
                }
            }
            return null;
        }
        nextTSBData() {
            for (let i = 1; i < _Disk.trackCount; i++) {
                for (let j = 0; j < _Disk.sectorCount; j++) {
                    for (let k = 0; k < _Disk.blockCount; k++) {
                        let thisData = sessionStorage.getItem(i + "," + j + "," + k).split(" ");
                        if (thisData[0] === "0") {
                            return i + "," + j + "," + k;
                        }
                    }
                }
            }
            return null;
        }
        getFileName(fileNameData) {
            let fileName = "";
            for (let i = 4; i < fileNameData.length; i++) {
                if (fileNameData[i] === "-") {
                    return fileName;
                }
                else {
                    fileName += String.fromCharCode(TSOS.Utils.hexToDecimal(fileNameData[i]));
                }
            }
            return fileName;
        }
        getFileTSB(fileName) {
            for (let i = 0; i < _Disk.sectorCount; i++) {
                for (let j = 0; j < _Disk.blockCount; j++) {
                    let thisData = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    let thisFileName = this.getFileName(thisData);
                    if (thisFileName == fileName) {
                        return "0" + "," + i + "," + j;
                        break;
                    }
                }
            }
            return null;
        }
        deleteFileTSB(fileName) {
            let emptyBlockMemory = this.createEmptyBlock();
            let fileTSB = this.getFileTSB(fileName);
            if (fileTSB != null) {
                sessionStorage.setItem(fileTSB, emptyBlockMemory.join(" "));
                return true;
            }
            else {
                return false;
            }
        }
        deleteFileData(fileLoc) {
            let emptyBlockMemory = this.createEmptyBlock();
            if (fileLoc != null) {
                let prevData = sessionStorage.getItem(fileLoc).split(" ");
                if (prevData[1] === "*") {
                    sessionStorage.setItem(fileLoc, emptyBlockMemory.join(" "));
                    return true;
                }
                else {
                    let nextLoc = prevData[1] + "," + prevData[2] + "," + prevData[3];
                    sessionStorage.setItem(fileLoc, emptyBlockMemory.join(" "));
                    return this.deleteFileData(nextLoc);
                }
            }
            else {
                return false;
            }
        }
        dataTSBFromFileName(fileName) {
            let tsbFile = this.getFileTSB(fileName);
            if (tsbFile != null) {
                let tsbFileName = sessionStorage.getItem(tsbFile).split(" ");
                return tsbFileName[1] + "," + tsbFileName[2] + "," + tsbFileName[3];
            }
            else {
                return null;
            }
        }
        createEmptyBlock() {
            let emptyBlockMemory = new Array(64);
            for (let i = 0; i < 4; i++) {
                emptyBlockMemory[i] = 0;
            }
            for (let j = 4; j < emptyBlockMemory.length; j++) {
                emptyBlockMemory[j] = "-";
            }
            return emptyBlockMemory;
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map