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

    }
}