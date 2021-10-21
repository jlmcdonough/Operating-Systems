module TSOS {

    export class Memory {

        public segmentOneBase: number = 0;
        public segmentOneLimit: number = 255;

        public segmentTwoBase: number = 256;
        public segmentTwoLimit: number = 511;

        public segmentThreeBase: number = 512;
        public segmentThreeLimit: number = 767;

        constructor( public memorySize: number = 768,
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

        public getAt(atPC: number): string
        {
            return this.memoryBlock[atPC];
        }

        public override(atAddress: number, newData: string): void
        {
            this.memoryBlock[atAddress] = newData;
        }

    }
}