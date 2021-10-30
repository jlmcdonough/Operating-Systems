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
            this.schedulingSystem = "FCFS";
            this.readyQueue = new TSOS.Queue();
            console.log(this.readyQueue);
        }
        doScheduling() {
            console.log("SCHEDULING WITH: " + _Scheduler.readyQueue.toString());
            console.log("GLOBAL PCB: " + _PCB.priority);
            console.log("PEEK QUEUE: " + _Scheduler.readyQueue.peek());
            if (_Scheduler.readyQueue.getSize() > 0) {
                console.log("READY QUEUE > 0");
                if ((_Scheduler.readyQueue.getSize() == 1) && (_Scheduler.runningPCB == null)) {
                    console.log("READY QUEUE = 1");
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_Scheduler.readyQueue.peek()]));
                }
                else {
                    console.log("SOMETHING WRONG");
                }
                _CPU.isExecuting = true;
            }
            else {
                console.log("READY QUUEUE <= 0");
            }
        }
        contextSwitch() {
            console.log("CONTEXT SWITCHING");
            let currPCB = _Scheduler.runningPCB;
            //console.log("CURR RUNNING PCB: " + currPCB.pid);
            let nextPCB = _Scheduler.readyQueue.dequeue();
            console.log("NEXT IN QUEUE: " + nextPCB.pid);
            if (currPCB == undefined) {
                console.log("CURRENTLY NO PCB RUNNING");
                nextPCB.state = "Running";
                _PCB = nextPCB;
                this.updateCPU(_PCB);
            }
            else {
                console.log("SWITCHING FROM AN OLD RUNNING PCB");
                _Scheduler.readyQueue.enqueue(this.storePCB(currPCB));
                nextPCB.state = "Running";
                _PCB = nextPCB;
                this.updateCPU(nextPCB);
            }
            return nextPCB;
        }
        updateCPU(thisPCB) {
            _CPU.pc = thisPCB.pc;
            _CPU.ir = thisPCB.ir;
            _CPU.acc = thisPCB.acc;
            _CPU.xReg = thisPCB.xReg;
            _CPU.yReg = thisPCB.yReg;
            _CPU.zFlag = thisPCB.zFlag;
        }
        storePCB(thisPCB) {
            thisPCB.pc = _CPU.pc;
            thisPCB.ir = _CPU.ir;
            thisPCB.acc = _CPU.acc;
            thisPCB.xReg = _CPU.xReg;
            thisPCB.yReg = _CPU.yReg;
            thisPCB.zFlag = _CPU.zFlag;
            return thisPCB;
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map