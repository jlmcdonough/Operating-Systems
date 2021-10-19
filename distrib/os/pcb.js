var TSOS;
(function (TSOS) {
    class Pcb {
        constructor(pid = 0, pc = 0, ir = "", acc = "", xReg = "", yReg = "", zFlag = 0, priority = 0, state = "", location = "") {
            this.pid = pid;
            this.pc = pc;
            this.ir = ir;
            this.acc = acc;
            this.xReg = xReg;
            this.yReg = yReg;
            this.zFlag = zFlag;
            this.priority = priority;
            this.state = state;
            this.location = location;
        }
        init(priorityNum) {
            this.pid = _ProcessID;
            _ProcessID++;
            this.pc = 0;
            this.ir = "00",
                this.acc = "00";
            this.xReg = "00";
            this.yReg = "00";
            this.zFlag = 0;
            this.priority = priorityNum;
            this.state = "Resident";
            this.location = "Memory";
            TSOS.Control.pcbUpdateTable();
        }
    }
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map