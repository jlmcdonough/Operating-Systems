var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor(quanta = 0, schedulingSystem = "", readyQueue = new TSOS.Queue(), runningPCB = undefined) {
            this.quanta = quanta;
            this.schedulingSystem = schedulingSystem;
            this.readyQueue = readyQueue;
            this.runningPCB = runningPCB;
        }
        init() {
            this.quanta = _Quantum;
            this.schedulingSystem = "RR";
            this.readyQueue = new TSOS.Queue();
        }
        doScheduling() {
            if (_Scheduler.readyQueue.getSize() > 0) {
                if ((_Scheduler.readyQueue.getSize() == 1) && (_Scheduler.runningPCB == null)) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]));
                }
                else if (_Scheduler.readyQueue.getSize() > 1) {
                    if (_Scheduler.runningPCB == null) {
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]));
                    }
                }
                _CPU.isExecuting = true;
            }
            else {
                _CPU.isExecuting = false;
            }
        }
        quantaCheck() {
            if (_Scheduler.runningPCB.runningQuanta >= _Quantum && _Scheduler.readyQueue.getSize() > 0) //don't care about quanta if there is no process to switch to
             {
                _Scheduler.runningPCB.runningQuanta = 0;
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]));
            }
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map