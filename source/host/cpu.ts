/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public pc: number = 0,
                    public ir: string = "",
                    public acc: string = "",
                    public xReg: string = "",
                    public yReg: string = "",
                    public zFlag: number = 0,
                    public isExecuting: boolean = false) {
        }

        public init(): void {
            this.pc = 0;
            this.ir = "00";
            this.acc = "00";
            this.xReg = "00";
            this.yReg = "00";
            this.zFlag = 0;
            this.isExecuting = false;

            Control.cpuUpdateTable();
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            console.log("PC: " + this.pc);

            if(_CPU.isExecuting)
            {
                this.fetch();
                this.decode();
            }

            Control.cpuUpdateTable();
            this.updatePcbMatchCpu();
            Control.pcbUpdateTable();
            Control.memoryUpdateTable();
        }

        public updatePcbMatchCpu(): void
        {
            _PCB.pc = this.pc;
            _PCB.ir = this.ir;
            _PCB.acc = this.acc;
            _PCB.xReg = this.xReg;
            _PCB.yReg = this.yReg;
            _PCB.zFlag = this.zFlag;
        }

        public fetch(): void
        {
            let command = _MemoryAccessor.read(this.pc);
            this.ir = command;
            console.log("THIS IR: " + this.ir);
        }

        public decode(): void
        {
            switch (this.ir)
            {
                case "00":
                    this.brk();
                    break;
                case "01":
                    this.opcode();
                    break;
                case "02":
                    this.opcode();
                    break;
                case "03":
                    this.opcode();
                    break;
                case "05":
                    this.opcode();
                    break;
                case "20":
                    this.opcode();
                    break;
                case "33":
                    this.opcode();
                    break;
                case "49":
                    this.opcode();
                    break;
                case "65":
                    this.opcode();
                    break;
                case "69":
                    this.opcode();
                    break;
                case "6D":
                    this.adc();
                    break;
                case "6E":
                    this.opcode();
                    break;
                case "6F":
                    this.opcode();
                    break;
                case "72":
                    this.opcode();
                    break;
                case "74":
                    this.opcode();
                    break;
                case "75":
                    this.opcode();
                    break;
                case "8D":
                    this.staMemory();
                    break;
                case "A0":
                    this.ldaYConstant();
                    break;
                case "A2":
                    this.ldaXConstant();
                    break;
                case "A4":
                    this.opcode();
                    break;
                case "A9":
                    this.ldaConstant();
                    break;
                case "AC":
                    this.ldaYMemory();
                    break;
                case "AD":
                    this.ldaMemory();
                    break;
                case "AE":
                    this.ldaXMemory();
                    break;
                case "BA":
                    this.opcode();
                    break;
                case "D0":
                    this.bne();
                    break;
                case "EA":
                    this.noOperation();
                    break;
                case "EC":
                    this.cpx();
                    break;
                case "ED":
                    this.opcode();
                    break;
                case "EE":
                    this.inc();
                    break;
                case "EF":
                    this.opcode();
                    break;
                case "F1":
                    this.opcode();
                    break;
                case "F8":
                    this.opcode();
                    break;
                case "FF":
                    this.sys();
                    break;
                default:
                    this.opcode();
            }
        }



        //A9
        // Load the accumulator with the constant that appears next
        public ldaConstant(): void
        {
            console.log("LDA CONSTANT");

            this.pc++

            this.acc = _MemoryAccessor.read(this.pc);

            this.pc++;
        }

        //AD
        //
        public ldaMemory(): void
        {
            console.log("LDAMEMORY");

            this.pc++;

            this.acc = _MemoryAccessor.read(
                Utils.hexToDecimal(this.littleEndian(this.pc)));

            this.pc++;
            this.pc++;

        }

        //8D
        public staMemory(): void
        {
            console.log("STAMEMORY");

            this.pc++;

            _MemoryAccessor.write(this.littleEndian(this.pc), Utils.padHex(this.acc));

            this.pc++;
            this.pc++;

        }

        //6D
        public adc(): void
        {
            console.log("ADC");

            this.pc++;

            let param = this.littleEndian(this.pc);

            let accumulator = (Utils.hexToDecimal(this.acc));

            let storage = Utils.hexToDecimal(_MemoryAccessor.read(Utils.hexToDecimal(param)));

            this.acc = Utils.padHex(Utils.decimalToHex(storage + accumulator));

            this.pc++;
            this.pc++;
        }

        //A2
        public ldaXConstant(): void
        {
            console.log("LDA X CONSTANT");

            this.pc++;

            this.xReg = Utils.padHex(_MemoryAccessor.read(this.pc));

            this.pc++;
        }

        //AE
        public ldaXMemory(): void
        {
            console.log("LDA X MEMORY");

            this.pc++;

            let secondValue = _MemoryAccessor.read(
                Utils.hexToDecimal(this.littleEndian(this.pc)));

            this.xReg = Utils.padHex(secondValue);

            this.pc++;
            this.pc++;

        }

        //A0
        public ldaYConstant(): void
        {
            console.log("LDA Y CONSTANT");

            this.pc++

            this.yReg = _MemoryAccessor.read(this.pc);

            this.pc++;
        }

        //AC
        public ldaYMemory(): void
        {
            console.log("LDA Y MEMORY");

            this.pc++;

            let secondValue = _MemoryAccessor.read(
                Utils.hexToDecimal(this.littleEndian(this.pc)));

            this.yReg = secondValue;

            this.pc++;
            this.pc++;
        }

        //EA
        public noOperation(): void
        {
            this.pc++;
        }

        //00
        public brk(): void
        {
            console.log(this.acc);
            console.log("BRK");

            _StdOut.advanceLine();
            _StdOut.putText("Process " + _PCB.pid + " has finished");
            _StdOut.advanceLine();
            _OsShell.putPrompt();

            _CPU.isExecuting = false;
            _PCB.state = "Finished";

        }

        //EC
        public cpx(): void
        {
            this.pc++;

            let secondValue = _MemoryAccessor.read(
                Utils.hexToDecimal(this.littleEndian(this.pc)));

            if (secondValue == this.xReg)
            {
                this.zFlag = 1;
            }
            else
            {
                this.zFlag = 0;
            }

            this.pc++;
            this.pc++;
        }

        //D0
        public bne(): void
        {
            this.pc++;

            if (this.zFlag == 0)
            {
                let fastForward = Utils.hexToDecimal(_MemoryAccessor.read(this.pc));
                this.pc += fastForward;

                if(this.pc > 256)
                {
                    this.pc = this.pc % 256;
                }

                this.pc += 1;
            }
            else
            {
                this.pc++;
            }
        }

        //EE
        public inc(): void
        {
            this.pc++;

            let byteLookingFor = _MemoryAccessor.read(this.pc);
            let valueToInc = _MemoryAccessor.read(Utils.hexToDecimal(byteLookingFor));
            let asDeci = Utils.hexToDecimal(valueToInc);
            asDeci++;
            let asHex = Utils.decimalToHex(asDeci);
            _MemoryAccessor.write(byteLookingFor, Utils.padHex(asHex.toString()));

            this.pc++;
            this.pc++;
        }

        //FF
        public sys(): void
        {
            console.log("IN SYS");
            this.pc++;
            let outputs: string[] = [];

            if(Number(this.xReg) == 1)
            {
                _StdOut.putText(this.yReg);
            }
            else if(Number(this.xReg) == 2)
            {
                let location = Utils.hexToDecimal(this.yReg);
                let output: string = "";
                let byteString: string;
                for (let i = 0; i + location < _Memory.memorySize; i++)
                {
                    console.log("I: " + i);
                    console.log("L: " + location);
                    byteString = _Memory.memoryBlock[location + i];
                    console.log("B STR: " + byteString);
                    if (byteString == "00")
                    {
                        break;
                    } else
                    {
                        output += String.fromCharCode(Utils.hexToDecimal(byteString));
                        console.log("OUT: " + output);
                    }
                }

                _StdOut.putText(output);
            }
        }
        
        //Remainder
        //these are the op codes that appeared on https://www.labouseur.com/courses/os/ under the example
        //the above op codes are defined in the resource provided https://www.labouseur.com/commondocs/6502alan-instruction-set.pdf
        //so far only working with the explicitly defined ones
        public opcode(): void
        {
            console.log("OpCode " + this.ir + " not yet added.");
        }

        public littleEndian(programCounter: number) : string
        {
            let second = _MemoryAccessor.read(programCounter);
            let first = _MemoryAccessor.read((programCounter + 1));
            let result = first + second;

            return result;
        }

    }
}
