module TSOS {

    export class MemoryAccessor {

        constructor() {
        }

        public write(atAddress: string, newData: string) : void
        {
            _Memory.override(atAddress, newData);
        }

        public read(atAddress: number) : string
        {
            return _Memory.getAt(atAddress);
        }
    }
}