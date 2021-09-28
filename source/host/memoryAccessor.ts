module TSOS {

    export class MemoryAccessor {

        constructor() {
        }

        public read(atAddress: string) : string
        {
            return _Memory.getAtAddress(atAddress);
        }

        public write(atAddress: string, newData: string) : void
        {
            _Memory.override(atAddress, newData);
        }

        public readPC(atAddress: string) : string
        {
            return _Memory.getAtPC(atAddress);
        }
    }
}