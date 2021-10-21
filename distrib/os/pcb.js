var TSOS;
(function (TSOS) {
    class Pcb {
        constructor(pid = 0, pc = 0, ir = "", acc = "", xReg = "", yReg = "", zFlag = 0, priority = 0, state = "", location = "", segment = 0, base = 0, limit = 0) {
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
            this.segment = segment;
            this.base = base;
            this.limit = limit;
        }
        init(priorityNum, segment) {
            let points = TSOS.Utils.segmentStuff(segment);
            let startingPoint = points[0];
            let maxPoint = points[1];
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
            this.segment = segment;
            this.base = startingPoint;
            this.limit = maxPoint;
        }
    }
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map