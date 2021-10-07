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
var TSOS;
(function (TSOS) {
    class Cpu {
        constructor(pc = 0, ir = "", acc = "", xReg = "", yReg = "", zFlag = 0, isExecuting = false) {
            this.pc = pc;
            this.ir = ir;
            this.acc = acc;
            this.xReg = xReg;
            this.yReg = yReg;
            this.zFlag = zFlag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.pc = 0;
            this.ir = "00";
            this.acc = "00";
            this.xReg = "00";
            this.yReg = "00";
            this.zFlag = 0;
            this.isExecuting = false;
            TSOS.Control.cpuUpdateTable();
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            console.log("PC: " + this.pc);
            if (_CPU.isExecuting) {
                this.fetch();
                this.decode();
            }
            TSOS.Control.cpuUpdateTable();
            this.updatePcbMatchCpu();
            TSOS.Control.pcbUpdateTable();
            TSOS.Control.memoryUpdateTable();
        }
        updatePcbMatchCpu() {
            _PCB.pc = this.pc;
            _PCB.ir = this.ir;
            _PCB.acc = this.acc;
            _PCB.xReg = this.xReg;
            _PCB.yReg = this.yReg;
            _PCB.zFlag = this.zFlag;
        }
        fetch() {
            let command = _MemoryAccessor.read(this.pc);
            this.ir = command;
            console.log("THIS IR: " + this.ir);
        }
        decode() {
            switch (this.ir) {
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
        ldaConstant() {
            console.log("LDA CONSTANT");
            this.pc++;
            this.acc = _MemoryAccessor.read(this.pc);
            this.pc++;
        }
        //AD
        //
        ldaMemory() {
            console.log("LDAMEMORY");
            this.pc++;
            this.acc = _MemoryAccessor.read(TSOS.Utils.hexToDecimal(this.littleEndian(this.pc)));
            this.pc++;
            this.pc++;
        }
        //8D
        staMemory() {
            console.log("STAMEMORY");
            this.pc++;
            _MemoryAccessor.write(this.littleEndian(this.pc), this.acc);
            this.pc++;
            this.pc++;
        }
        //6D
        adc() {
            console.log("ADC");
            this.pc++;
            let param = this.littleEndian(this.pc);
            let accumulator = (TSOS.Utils.hexToDecimal(this.acc));
            let storage = TSOS.Utils.hexToDecimal(_MemoryAccessor.read(TSOS.Utils.hexToDecimal(param)));
            this.acc = TSOS.Utils.padHex(TSOS.Utils.decimalToHex(storage + accumulator));
            this.pc++;
            this.pc++;
        }
        //A2
        ldaXConstant() {
            console.log("LDA X CONSTANT");
            this.pc++;
            this.xReg = TSOS.Utils.padHex(_MemoryAccessor.read(this.pc));
            this.pc++;
        }
        //AE
        ldaXMemory() {
            console.log("LDA X MEMORY");
            this.pc++;
            let secondValue = _MemoryAccessor.read(TSOS.Utils.hexToDecimal(this.littleEndian(this.pc)));
            this.xReg = TSOS.Utils.padHex(secondValue);
            this.pc++;
            this.pc++;
        }
        //A0
        ldaYConstant() {
            console.log("LDA Y CONSTANT");
            this.pc++;
            this.yReg = _MemoryAccessor.read(this.pc);
            this.pc++;
        }
        //AC
        ldaYMemory() {
            console.log("LDA Y MEMORY");
            this.pc++;
            let secondValue = _MemoryAccessor.read(TSOS.Utils.hexToDecimal(this.littleEndian(this.pc)));
            this.yReg = secondValue;
            this.pc++;
            this.pc++;
        }
        //EA
        noOperation() {
            this.pc++;
        }
        //00
        brk() {
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
        cpx() {
            this.pc++;
            let secondValue = _MemoryAccessor.read(TSOS.Utils.hexToDecimal(this.littleEndian(this.pc)));
            if (secondValue == this.xReg) {
                this.zFlag = 1;
            }
            else {
                this.zFlag = 0;
            }
            this.pc++;
            this.pc++;
        }
        //D0
        bne() {
            this.pc++;
            if (this.zFlag == 0) {
                let fastForward = TSOS.Utils.hexToDecimal(_MemoryAccessor.read(this.pc));
                this.pc += fastForward;
                if (this.pc > 256) {
                    this.pc = this.pc % 256;
                }
                this.pc += 1;
            }
            else {
                this.pc++;
            }
        }
        //EE
        inc() {
            this.pc++;
            let byteLookingFor = _MemoryAccessor.read(this.pc);
            let valueToInc = _MemoryAccessor.read(TSOS.Utils.hexToDecimal(byteLookingFor));
            let asDeci = TSOS.Utils.hexToDecimal(valueToInc);
            asDeci++;
            let asHex = TSOS.Utils.decimalToHex(asDeci);
            _MemoryAccessor.write(byteLookingFor, TSOS.Utils.padHex(asHex.toString()));
            this.pc++;
            this.pc++;
        }
        //FF
        sys() {
            console.log("IN SYS");
            this.pc++;
            let outputs = [];
            if (Number(this.xReg) == 1) {
                _StdOut.putText(this.yReg);
            }
            else if (Number(this.xReg) == 2) {
                let location = TSOS.Utils.hexToDecimal(this.yReg);
                let output = "";
                let byteString;
                for (let i = 0; i + location < _Memory.memorySize; i++) {
                    console.log("I: " + i);
                    console.log("L: " + location);
                    byteString = _Memory.memoryBlock[location + i];
                    console.log("B STR: " + byteString);
                    if (byteString == "00") {
                        break;
                    }
                    else {
                        output += String.fromCharCode(TSOS.Utils.hexToDecimal(byteString));
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
        opcode() {
            console.log("OpCode " + this.ir + " not yet added.");
        }
        littleEndian(programCounter) {
            let second = _MemoryAccessor.read(programCounter);
            let first = _MemoryAccessor.read((programCounter + 1));
            let result = first + second;
            return result;
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map