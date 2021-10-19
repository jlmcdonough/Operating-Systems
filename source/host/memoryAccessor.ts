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

        public loadMemory(userEntry: string): void
        {
            let userArr = userEntry.split(" ");

            for(let i = 0; i < userArr.length; i++)
            {
                _Memory.memoryBlock[i] = userArr[i];
            }
        }

        public nukeMemory(): void
        {
            _Memory.init();
        }

    }
}