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
            let emptyBlockMemory = this.createEmptyBlock();

            console.log("EMPTY: " + emptyBlockMemory);
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

            Control.diskUpdateTable();
        }

        public fileCreate(fileName: string): void
        {
            let tsbName = this.nextTSBName();
            let tsbData = this.nextTSBData();

            let tsbNameData = sessionStorage.getItem(tsbName).split(" ");
            let tsbDataData = sessionStorage.getItem(tsbData).split(" ");

            tsbNameData[0] = "1"
            tsbDataData[0] = "1"

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
        }

        public fileWrite(fileName: string, fileData: string): void
        {
            let tsbLocToWrite = this.dataTSBFromFileName(fileName);
            //let tsbLocData = sessionStorage.getItem(tsbLocToWrite).split(" ");
            let tsbLocData = this.createEmptyBlock();

            if (fileData.length <= 60)
            {
                for (let i = 0; i < fileData.length; i++)
                {
                    tsbLocData[i + 4] = Utils.decimalToHex(fileData.charCodeAt(i));
                }
                tsbLocData[0] = "1";
                sessionStorage.setItem(tsbLocToWrite, tsbLocData.join(" "));
            }
            else
            {
                console.log("FILE TO LARGE")
            }

        }

        public fileDelete(fileName: string): void
        {
            this.deleteFileData(fileName);
            this.deleteFileTSB(fileName);
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
            console.log("HELPER NAME: " + fileName);
            for (let i = 0; i < _Disk.sectorCount; i++)
            {
                for (let j = 0; j < _Disk.blockCount; j++)
                {
                    let thisData = sessionStorage.getItem("0," + i + "," + j).split(" ");
                    console.log("THIS : " + thisData);
                    let thisFileName = this.getFileName(thisData);
                    console.log("THIS NAME: " + thisFileName);
                    if (thisFileName == fileName)
                    {
                        return "0" + "," + i + "," + j;
                        break;
                    }

                }
            }
            return null;
        }

        public deleteFileTSB(fileName: string): void
        {
            let emptyBlockMemory = this.createEmptyBlock();
            console.log("GETFILETSB: " + this.getFileTSB(fileName));
            console.log("GETFILETSB type: " + typeof this.getFileTSB(fileName));
            console.log("GETFILETSB[0]: " + this.getFileTSB(fileName)[0]);
            console.log("GETFILETSB[1]: " + this.getFileTSB(fileName)[1]);
            console.log("GETFILETSB[2]: " + this.getFileTSB(fileName)[2]);
            sessionStorage.setItem(this.getFileTSB(fileName), emptyBlockMemory.join(" "));
        }

        public deleteFileData(fileName: string): void
        {
            console.log("DELETE FILE NAMED: " + fileName);
            let emptyBlockMemory = this.createEmptyBlock();
            let tsbToDelete = this.dataTSBFromFileName(fileName);
            console.log("SECONDL: " + tsbToDelete);
            console.log("SECONDL type: " + typeof tsbToDelete);
            console.log("SECONDL[0]: " + tsbToDelete[0]);
            console.log("SECONDL[1]: " + tsbToDelete[1]);
            console.log("SECONDL[2]: " + tsbToDelete[2]);
            console.log("SECONDL[3]: " + tsbToDelete[3]);
            console.log("SECONDL[4]: " + tsbToDelete[4]);
            sessionStorage.setItem(tsbToDelete, emptyBlockMemory.join(" "));
        }

        public dataTSBFromFileName(fileName: string): string
        {
            console.log("FILE NAME: " + fileName);
            let tsbFile = this.getFileTSB(fileName);
            console.log("TSB FILE: " + tsbFile);
            console.log("FILE NAME TSB: " + sessionStorage.getItem(tsbFile));
            let tsbFileName = sessionStorage.getItem(tsbFile).split(" ");

            return tsbFileName[1] + "," + tsbFileName[2] + "," + tsbFileName[3];
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
