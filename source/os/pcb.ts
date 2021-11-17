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
                    public location: string = "",
                    public runningQuanta: number = 0,
                    public segment: number = 0,
                    public base: number = 0,
                    public limit: number = 0,
                    public startingCycle: number = 0,
                    public endingCycle: number = 0,
                    public runningCycle: number = 0,
                    public outputData: string = "") {
        }

        public init(priorityNum: number, segment: number): void
        {
            let points = Utils.segmentStuff(segment);
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
            this.runningQuanta = 0,
            this.segment = segment;
            this.base = startingPoint;
            this.limit = maxPoint;
            this.startingCycle = _CycleCount;
        }
    }
}