module TSOS {

    export class Disk {

        constructor( public trackCount: number = 4,
                     public sectorCount: number = 8,
                     public blockCount: number = 8,
                     public blockMemory: number = 64
                     ) {
        }
    }
}