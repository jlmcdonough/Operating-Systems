/* ----------------------------------
   DeviceDriverDisk.ts

   The Kernel Disk Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
        }

        public krnKbdDriverEntry(): void
        {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public format(): void
        {
            _Kernel.krnTrace("Beginning disk format");

            let emptyBlockMemory = this.createEmptyBlock();

            for (let x = 0; x < _Disk.trackCount; x++)
            {
                for (let y = 0; y < _Disk.sectorCount; y++)
                {
                    for (let z = 0; z < _Disk.blockCount; z++)
                    {
                        if ( (x == 0) && (y == 0) && (z == 0) ) //Master Boot Record set to used so never overriden
                        {
                            emptyBlockMemory[0] = 1;
                            sessionStorage.setItem(x + "," + y + "," + z,
                                emptyBlockMemory.join(" ") );
                            emptyBlockMemory[0] = 0;
                        }
                        else
                        {
                            sessionStorage.setItem(x + "," + y + "," + z,
                                emptyBlockMemory.join(" ") );
                        }
                    }
                }
            }

            _Kernel.krnTrace("Disk formatted");

            Control.diskUpdateTable();
        }

        public fileCreate(fileName: string): boolean
        {
            _Kernel.krnTrace("Beginning file " + fileName + " create");

            let nameCheck = this.getFileTSB(fileName);

            if (nameCheck != null)
            {
                _Kernel.krnTrace("File " + fileName + " already exists and cannot be created");

                return false;
            }
            else
            {
                let tsbName = this.nextTSBName();
                let tsbData = this.nextTSBData();

                let tsbNameData = this.createEmptyBlock();
                let tsbDataData = this.createEmptyBlock();

                tsbNameData[0] = "1";
                tsbDataData[0] = "1";

                let tsbDataSplit = tsbData.split(",")
                tsbNameData[1] = tsbDataSplit[0];
                tsbNameData[2] = tsbDataSplit[1];
                tsbNameData[3] = tsbDataSplit[2];

                for (let i = 0; i < fileName.length; i++)
                {
                    tsbNameData[i + 4] = Utils.decimalToHex(fileName.charCodeAt(i));
                }

                sessionStorage.setItem(tsbName, tsbNameData.join(" "));
                sessionStorage.setItem(tsbData, tsbDataData.join(" "));

                _Kernel.krnTrace("File " + fileName + " created");

                return true;
            }
        }

        public fileCreateSwap(pid: number, fileData: string[]): boolean
        {
            let fileName = "~" + pid;

            _Kernel.krnTrace("Beginning swap file " + fileName + " create");

            if ( this.fileCreate(fileName) )
            {
                if ( this.fileWrite(fileName, fileData.join(" ")) )
                {
                    _Kernel.krnTrace("Swap file " + fileName + " created");
                }
                else
                {
                    _Kernel.krnTrace("File " + fileName + " had issues writing");

                    return false;
                }
            }
            else
            {
                _Kernel.krnTrace("File " + fileName + " cannot be created");

                return false;
            }

            return true;
        }

        public fileWrite(fileName: string, fileData: string, nextTSB?: string): boolean
        {
            _Kernel.krnTrace("Beginning file " + fileName + " write");

            let tsbLocToWrite = this.dataTSBFromFileName(fileName);

            if (tsbLocToWrite != null)
            {
                let tsbLocData = this.createEmptyBlock();

                if (fileData.length <= 60)
                {
                    for (let i = 0; i < fileData.length; i++)
                    {
                        tsbLocData[i + 4] = Utils.decimalToHex(fileData.charCodeAt(i));
                    }
                    tsbLocData[0] = "1";

                    let newLoc;

                    if (nextTSB != undefined)
                    {
                        newLoc = nextTSB;
                    }
                    else
                    {
                        newLoc = tsbLocToWrite;
                    }

                    tsbLocData[1] = "*";
                    tsbLocData[2] = "*";
                    tsbLocData[3] = "*";

                    sessionStorage.setItem(newLoc, tsbLocData.join(" "));
                    _Kernel.krnTrace("File " + fileName + " has been written to completion");
                }
                else
                {
                    let tsbLocData = this.createEmptyBlock();

                    for (let j = 0; j < 60; j++)
                    {
                        tsbLocData[j + 4] = Utils.decimalToHex(fileData.charCodeAt(j));
                    }
                    tsbLocData[0] = "1";

                    let newLoc;
                    if (nextTSB != undefined)
                    {
                        newLoc = nextTSB;
                    }
                    else
                    {
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

                    _Kernel.krnTrace("File " + fileName + " has is being written, more to go");

                    this.fileWrite(fileName, dataLeft, goNext);
                }
                return true;
            }
            else
            {
                _Kernel.krnTrace("File " + fileName + " cannot be written to");

                return false;
            }
        }

        public fileDelete(fileName: string): boolean
        {
            _Kernel.krnTrace("Beginning file " + fileName + " delete");

            let tsbToDelete = this.dataTSBFromFileName(fileName);

            if ( ( this.deleteFileData(tsbToDelete) ) && ( this.deleteFileTSB(fileName) ) )
            {
                _Kernel.krnTrace("File " + fileName + " deleted");

                return true;
            }
            else
            {
                _Kernel.krnTrace("File " + fileName + " cannot be deleted");

                return false;
            }
        }

        public fileShellRead(fileName: string): string
        {
            _Kernel.krnTrace("Beginning file " + fileName + " read");
            let tsbLocToWrite = this.dataTSBFromFileName(fileName);
            let ans = this.fileRead(tsbLocToWrite, "");
            _Kernel.krnTrace("File " + fileName + " read");
            return ans;
        }

        public fileRead(fileLoc: string, fileData: string): string
        {
            if (fileLoc != null)
            {
                let tsbLocDataStr = sessionStorage.getItem(fileLoc);

                if (tsbLocDataStr[0] == "1")
                {
                    if (tsbLocDataStr[2] != "0")
                    {
                        let tsbLocData = tsbLocDataStr.split(" ");

                        for (let i = 4; i < tsbLocData.length; i++)
                        {
                            fileData += String.fromCharCode(Utils.hexToDecimal(tsbLocData[i]));
                        }

                        if (tsbLocData[1] != "*")
                        {
                            let thisNext = tsbLocData[1] + "," + tsbLocData[2] + "," + tsbLocData[3];

                            _Kernel.krnTrace("File location " + fileLoc + " read, onto next");

                            return this.fileRead(thisNext, fileData);
                        }
                        else
                        {
                            _Kernel.krnTrace("Last file location " + fileLoc + " read");

                            return fileData;
                        }
                    }
                    else
                    {
                        _Kernel.krnTrace("Trying to read from directory, failing");

                        return "";
                    }
                }
            }
            else
            {
                _Kernel.krnTrace("File location " + fileLoc + " doesn't exist and cannot be read");

                return null;
            }
        }

        public fileList(suffix?: string): string[]
        {
            let list = [];
            let hidden = false;

            if (suffix === "-a")
            {
                hidden = true;
            }

            for (let i = 0; i < _Disk.sectorCount; i++)
            {
                for (let j = 0; j < _Disk.blockCount; j++)
                {
                    let thisData = sessionStorage.getItem("0," + i + "," + j).split(" ");

                    if ( !( (i == 0) && (j == 0) ) ) //ignore master boot record
                    {
                        if (thisData[0] === "1")
                        {
                            let fileName = this.getFileName(thisData);

                            if (fileName.charAt(0) != "~")
                            {
                                if (fileName.charAt(0) === ".")
                                {
                                    if (hidden)
                                    {
                                        list[list.length] = fileName;
                                    }
                                }
                                else
                                {
                                    list[list.length] = fileName;
                                }

                            }
                        }
                    }
                }
            }

            return list;
        }

        public nextTSBName(): string
        {
            for (let i = 0; i < _Disk.sectorCount; i++)
            {
                for (let j = 0; j < _Disk.blockCount; j++)
                {
                    let thisData = sessionStorage.getItem("0," + i + "," + j).split(" ");

                    if (thisData[0] === "0")
                    {
                        return "0" + "," + i + "," + j;
                    }

                }
            }
            return null;
        }

        public nextTSBData(): string
        {
            for (let i = 1; i < _Disk.trackCount; i++)
            {
                for (let j = 0; j < _Disk.sectorCount; j++)
                {
                    for (let k = 0; k < _Disk.blockCount; k++)
                    {
                        let thisData = sessionStorage.getItem(i + "," + j + "," + k).split(" ");

                        if (thisData[0] === "0")
                        {
                            return i + "," + j + "," + k;
                        }
                    }
                }
            }

            return null;
        }

        public getFileName(fileNameData: string[]): string
        {
            let fileName = "";

            for (let i = 4; i < fileNameData.length; i++)
            {
                if (fileNameData[i] === "-")
                {
                    return fileName;
                }
                else
                {
                    fileName += String.fromCharCode(Utils.hexToDecimal(fileNameData[i]));
                }
            }

            return fileName;
        }

        public getFileTSB(fileName: string): string
        {
            for (let i = 0; i < _Disk.sectorCount; i++)
            {
                for (let j = 0; j < _Disk.blockCount; j++)
                {
                    let thisData = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    let usedBit = thisData[0];
                    let thisFileName = this.getFileName(thisData);

                    if (thisFileName == fileName)
                    {
                        if (usedBit == "1")
                        {
                            return "0" + "," + i + "," + j;
                            break;
                        }
                        else if (usedBit == "0")
                        {
                            return null;
                        }
                        else
                        {
                            console.log("USED BIT HAS ERROR AND IS: " + usedBit);
                        }
                    }

                }
            }
            return null;
        }

        public deleteFileTSB(fileName: string): boolean
        {
            let fileTSB = this.getFileTSB(fileName);
            let prevData = sessionStorage.getItem(fileTSB).split(" ");
            prevData[0] = "0";

            if (fileTSB != null)
            {
                sessionStorage.setItem(fileTSB, prevData.join(" "));
                return true;
            }
            else
            {
                return false;
            }
        }

        public deleteFileData(fileLoc: string): boolean
        {
            if (fileLoc != null)
            {
                let prevData = sessionStorage.getItem(fileLoc).split(" ");
                prevData[0] = "0";

                if ( prevData[1] === "*" || prevData[1] === "0")
                {
                    sessionStorage.setItem(fileLoc, prevData.join(" "));
                    return true;
                }
                else
                {
                    let nextLoc = prevData[1] + "," + prevData[2] + "," + prevData[3];
                    sessionStorage.setItem(fileLoc, prevData.join(" "));
                    return this.deleteFileData(nextLoc);
                }
            }
            else
            {
                return false;
            }
        }

        public dataTSBFromFileName(fileName: string): string
        {
            let tsbFile = this.getFileTSB(fileName);

            if (tsbFile != null)
            {
                let tsbFileName = sessionStorage.getItem(tsbFile).split(" ");

                return tsbFileName[1] + "," + tsbFileName[2] + "," + tsbFileName[3];
            }
            else
            {
                return null;
            }
        }

        public createEmptyBlock(): any[]
        {
            let emptyBlockMemory = new Array(64)

            for (let i = 0; i < 4; i++)
            {
                emptyBlockMemory[i] = 0;
            }
            for (let j = 4; j < emptyBlockMemory.length; j++)
            {
                emptyBlockMemory[j] = "-";
            }

            return emptyBlockMemory;
        }
    }
}
