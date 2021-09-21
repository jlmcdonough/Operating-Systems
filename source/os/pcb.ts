module TSOS {

    export class Pcb {

        constructor(public pid: number = 0,
                    public pc: number = 0,
                    public ir: string = "",
                    public acc: number = 0,
                    public xReg: number = 0,
                    public yReg: number = 0,
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
            this.acc = 0;
            this.xReg = 0;
            this.yReg = 0;
            this.zFlag = 0;
            this.priority = priorityNum;
            this.state = "Waiting";
            this.location = "Memory";

            Control.pcbUpdateTable();
        }
    }
}