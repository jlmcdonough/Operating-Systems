module TSOS {

    export class Memory {

        constructor( public memorySize: number = 256,
                     public memoryBlock: string[] = new Array(memorySize)
        ) {
        }
    }
}