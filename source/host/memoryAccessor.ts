module TSOS {

    export class MemoryAccessor {

        constructor() {
        }

        public write(atAddress: string, newData: string) : void
        {
            _Memory.override(atAddress, newData);
        }

        public readPC(atAddress: number) : string
        {
            return _Memory.getAtPC(atAddress);
        }
    }
}