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
            this.schedulingSystem = "FCFS";
            this.readyQueue = new Queue();
        }

        public doScheduling() : void
        {
            if (_Scheduler.readyQueue.getSize() > 0)
            {
                console.log("READY QUEUE > 0");
                if ( (_Scheduler.readyQueue.getSize() == 1) && (_Scheduler.runningPCB == null) )
                {
                    console.log("READY QUEUE = 1")
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]))
                }
                else if (_Scheduler.readyQueue.getSize() > 1)
                {
                    console.log("READY QUEUE > 1");

                    if (_Scheduler.runningPCB == null)
                    {
                        console.log("EMPTY");
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]))
                    }
                    else
                    {
                        console.log("HAS PREVIOUS");
                        if ( ! (_Scheduler.runningPCB.runningQuanta < _Quantum))
                        {
                            console.log("QUANTUM EXPIRED ON PID " + _Scheduler.runningPCB.pid);
                        }
                    }
                }
                else
                {
                    console.log("SOMETHING WRONG");
                }
                _CPU.isExecuting = true;
            }
            else
            {
                console.log("READY QUUEUE <= 0")
                _CPU.isExecuting = false;
            }
        }

        public quantaCheck(): void
        {
            if (_Scheduler.runningPCB.runningQuanta >= _Quantum)
            {
                _Scheduler.runningPCB.runningQuanta = 0;
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]));
            }
        }

        public contextSwitch(): Pcb
        {
            console.log("CONTEXT SWITCHING");
            let currPCB = _Scheduler.runningPCB;
            //console.log("CURR RUNNING PCB: " + currPCB.pid);
            let nextPCB = _Scheduler.readyQueue.dequeue();
            console.log("NEXT IN QUEUE: " + nextPCB.pid)
            console.log("AFTER DEQUEUE, READY QUEUE SIZE = " + _Scheduler.readyQueue.getSize());
            if (currPCB == undefined)
            {
                console.log("CURRENTLY NO PCB RUNNING");
                nextPCB.state = "Running";
                _PCB = nextPCB;
                _Scheduler.runningPCB = nextPCB;
                this.updateCPU(_PCB);
            }
            else
            {
                console.log("SWITCHING FROM AN OLD RUNNING PCB")
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