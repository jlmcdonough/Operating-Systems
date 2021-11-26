module TSOS {

    export class Scheduler {

        constructor(
            public quanta: number = 0,
            public schedulingSystem: string = "",  //RR, FCFS, PRIORITY
            public readyQueue: Queue = new Queue(),
            public runningPCB: Pcb = undefined
        ) {
        }

        public init(): void
        {
            this.quanta = _RRQuantum;
            this.schedulingSystem = "RR";
            this.readyQueue = new Queue();
        }

        public doScheduling() : void
        {
            if (_Scheduler.schedulingSystem === "RR" || _Scheduler.schedulingSystem === "FCFS")
            {
                if (_Scheduler.readyQueue.getSize() > 0)
                {
                    if ((_Scheduler.readyQueue.getSize() == 1) && (_Scheduler.runningPCB == null))
                    {
                        _Kernel.krnTrace("Scheduling only process");
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]))
                    }
                    else if (_Scheduler.readyQueue.getSize() > 1)
                    {
                        _Kernel.krnTrace("Scheduling " + _Scheduler.readyQueue.getSize() + " processes with " + _Scheduler.schedulingSystem);
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

            if (_Scheduler.schedulingSystem === "PRIORITY")
            {
                if (_Scheduler.readyQueue.getSize() > 0)
                {
                    if ((_Scheduler.readyQueue.getSize() == 1) && (_Scheduler.runningPCB == null))
                    {
                        _Kernel.krnTrace("Scheduling only process");
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]))
                    }
                    else if (_Scheduler.readyQueue.getSize() > 1)
                    {
                        _Kernel.krnTrace("Scheduling " + _Scheduler.readyQueue.getSize() + " processes with " + _Scheduler.schedulingSystem);
                        if (_Scheduler.runningPCB == null)
                        {
                            _Scheduler.readyQueue.prioritySort();
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

        }

        public quantaCheck(): void
        {
            console.log("QUANTA IS: " + _Scheduler.quanta);
            if (_Scheduler.runningPCB != null)
            {
                if ( (_Scheduler.runningPCB.runningQuanta >= _Scheduler.quanta) && (_Scheduler.readyQueue.getSize() > 0) ) //don't care about quanta if there is no process to switch to
                {
                    _Scheduler.runningPCB.runningQuanta = 0;
                    _Kernel.krnTrace("Quanta expired, switching programs");
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]));
                }
            }
        }

    }
}