module TSOS {

    export class Scheduler {

        constructor(
            public quanta: number = 0,
            public schedulingSystem: string = "",
            public readyQueue: Queue = new Queue(),
            public runningPCB: Pcb = undefined
        ) {
        }

        public init(): void
        {
            this.quanta = _Quantum;
            this.schedulingSystem = "RR";
            this.readyQueue = new Queue();
        }

        public doScheduling() : void
        {
            if (_Scheduler.readyQueue.getSize() > 0)
            {
                if ( (_Scheduler.readyQueue.getSize() == 1) && (_Scheduler.runningPCB == null) )
                {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]))
                }
                else if (_Scheduler.readyQueue.getSize() > 1)
                {
                    if (_Scheduler.runningPCB == null)
                    {
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]))
                    }
                }

                _CPU.isExecuting = true;
            }
            else
            {
                _CPU.isExecuting = false;
            }
        }

        public quantaCheck(): void
        {
            if (_Scheduler.runningPCB.runningQuanta >= _Quantum && _Scheduler.readyQueue.getSize() > 0)  //don't care about quanta if there is no process to switch to
            {
                _Scheduler.runningPCB.runningQuanta = 0;
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]));
            }
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