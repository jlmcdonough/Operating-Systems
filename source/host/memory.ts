module TSOS {

    export class Memory {

        constructor( public memorySize: number = 256,
                     public memoryBlock: string[] = new Array(memorySize)
        ) {
        }

        public init(): void
        {
            for (let i = 0; i < this.memorySize; i++)
            {
                this.memoryBlock[i] = "00";
            }
            Control.memoryUpdateTable();
        }

        public loadMemory(userEntry: string): void
        {
            let userArr = userEntry.split(" ");

            for(let i = 0; i < this.memorySize; i++)
            {
                this.memoryBlock[i] = userArr[i];
            }
        }

    }
}