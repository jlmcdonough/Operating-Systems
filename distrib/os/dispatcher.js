var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor() {
        }
        contextSwitch() {
            let currPCB = _Scheduler.runningPCB;
            let nextPCB = _Scheduler.readyQueue.dequeue();
            if (currPCB == undefined) {
                _Kernel.krnTrace("No process to save. Loading Process " + nextPCB.pid);
                nextPCB.state = "Running";
                _PCB = nextPCB;
                _Scheduler.runningPCB = nextPCB;
                this.updateCPU(_PCB);
            }
            else {
                _Kernel.krnTrace("Saving Process " + currPCB.pid + ". Loading Process " + nextPCB.pid);
                currPCB.state = "Ready";
                _Scheduler.readyQueue.enqueue(this.storePCB(currPCB));
                nextPCB.state = "Running";
                _PCB = nextPCB;
                _Scheduler.runningPCB = _PCB;
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
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map