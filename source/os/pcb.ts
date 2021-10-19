module TSOS {

    export class Pcb {

        constructor(public pid: number = 0,
                    public pc: number = 0,
                    public ir: string = "",
                    public acc: string = "",
                    public xReg: string = "",
                    public yReg: string = "",
                    public zFlag: number = 0,
                    public priority: number = 0,
                    public state: string = "",
                    public location: string = "") {
        }

        public init(priorityNum: number): void
        {
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

            Control.pcbUpdateTable();
        }
    }
}