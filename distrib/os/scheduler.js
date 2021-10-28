var TSOS;
(function (TSOS) {
    class Scheduler {
        constructor(quanta = 0, schedulingSystem = "", readyQueue = new TSOS.Queue(), runningPCB = _PCB) {
            this.quanta = quanta;
            this.schedulingSystem = schedulingSystem;
            this.readyQueue = readyQueue;
            this.runningPCB = runningPCB;
        }
        init() {
            this.quanta = _Quantum;
            this.schedulingSystem = "FCFS";
            this.readyQueue = new TSOS.Queue();
            this.runningPCB = _PCB;
            console.log(this.readyQueue);
        }
        contextSwitch() {
            console.log("CONTEXT SWITCHING");
            let currPCB = _Scheduler.runningPCB;
            console.log("CURR RUNNING PCB: " + currPCB.pid);
            let nextPCB = _Scheduler.readyQueue.dequeue();
            console.log("NEXT IN QUEUE: " + nextPCB.pid);
            if (currPCB == undefined) {
                console.log("CURRENTLY NO PCB RUNNING");
                nextPCB.state = "Running";
                this.updateCPU(nextPCB);
            }
            else {
                console.log("SWITCHING FROM AN OLD RUNNING PCB");
                _Scheduler.readyQueue.enqueue(this.storePCB(currPCB));
                nextPCB.state = "Running";
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