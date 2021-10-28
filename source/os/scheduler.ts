module TSOS {

    export class Scheduler {

        constructor(
            public quanta: number = 0,
            public schedulingSystem: string = "",
            public readyQueue: Queue = new Queue(),
            public runningPCB: Pcb = _PCB
        ) {
        }

        public init(): void
        {
            this.quanta = _Quantum;
            this.schedulingSystem = "FCFS";
            this.readyQueue = new Queue();
            this.runningPCB = _PCB;
            console.log(this.readyQueue);
        }

/*        public doScheduling() : void
        {

        }
*/
        public contextSwitch(): Pcb
        {
            console.log("CONTEXT SWITCHING");
            let currPCB = _Scheduler.runningPCB;
            console.log("CURR RUNNING PCB: " + currPCB.pid);
            let nextPCB = _Scheduler.readyQueue.dequeue();
            console.log("NEXT IN QUEUE: " + nextPCB.pid)

            if (currPCB == undefined)
            {
                console.log("CURRENTLY NO PCB RUNNING");
                nextPCB.state = "Running";
                this.updateCPU(nextPCB);
            }
            else
            {
                console.log("SWITCHING FROM AN OLD RUNNING PCB")
                _Scheduler.readyQueue.enqueue(this.storePCB(currPCB));
                nextPCB.state = "Running";
                this.updateCPU(nextPCB);
            }

            return nextPCB;
        }

        public updateCPU(thisPCB: Pcb): void
        {
            _CPU.pc = thisPCB.pc;
            _CPU.ir = thisPCB.ir;
            _CPU.acc = thisPCB.acc;
            _CPU.xReg = thisPCB.xReg;
            _CPU.yReg = thisPCB.yReg;
            _CPU.zFlag = thisPCB.zFlag;
        }

        public storePCB(thisPCB: Pcb): Pcb
        {
            thisPCB.pc = _CPU.pc;
            thisPCB.ir = _CPU.ir;
            thisPCB.acc = _CPU.acc;
            thisPCB.xReg = _CPU.xReg;
            thisPCB.yReg = _CPU.yReg;
            thisPCB.zFlag = _CPU.zFlag;

            return thisPCB;
        }
    }
}