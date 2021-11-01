module TSOS {

    export class Dispatcher {

        constructor() {
        }

        public contextSwitch(): Pcb
        {
            let currPCB = _Scheduler.runningPCB;
            let nextPCB = _Scheduler.readyQueue.dequeue();
            if (currPCB == undefined)
            {
                nextPCB.state = "Running";
                _PCB = nextPCB;
                _Scheduler.runningPCB = nextPCB;
                this.updateCPU(_PCB);
            }
            else
            {
                currPCB.state = "Ready";
                _Scheduler.readyQueue.enqueue(this.storePCB(currPCB));
                nextPCB.state = "Running";
                _PCB = nextPCB;
                _Scheduler.runningPCB = _PCB;
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