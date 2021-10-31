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
            TSOS.Control.cpuUpdateTable(_CPU.pc);
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            if (_CPU.isExecuting) {
                _Scheduler.quantaCheck();
                let oldPC = this.pc;
                operandCount = 1;
                this.fetch();
                this.decode();
                this.updatePcbMatchCpu();
                TSOS.Control.updateVisuals(oldPC);
                _PCB.runningCycle++;
                _PCB.runningQuanta++;
                _CycleCount++;
            }
        }
        updatePcbMatchCpu() {
            _PCB.pc = this.pc;
            _PCB.ir = this.ir;
            _PCB.acc = this.acc;
            _PCB.xReg = this.xReg;
            _PCB.yReg = this.yReg;
            _PCB.zFlag = this.zFlag;
        }
        updateCpuMatchPcb() {
            this.pc = _PCB.pc;
            this.ir = _PCB.ir;
            this.acc = _PCB.acc;
            this.xReg = _PCB.xReg;
            this.yReg = _PCB.yReg;
            this.zFlag = _PCB.zFlag;
        }
        fetch() {
            this.ir = _MemoryAccessor.read(_PCB.segment, this.pc);
        }
        decode() {
            switch (this.ir) {
                case "00":
                    this.brk();
                    break;
                case "6D":
                    this.adc();
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
                case "D0":
                    this.bne();
                    break;
                case "EA":
                    this.noOperation();
                    break;
                case "EC":
                    this.cpx();
                    break;
                case "EE":
                    this.inc();
                    break;
                case "FF":
                    this.sys();
                    break;
                default:
                    this.opcode();
            }
        }
        // EXECUTE
        //A9
        // Load the accumulator with the constant that appears next
        ldaConstant() {
            this.pc++;
            this.acc = _MemoryAccessor.read(_PCB.segment, this.pc);
            this.pc++;
        }
        //AD
        //
        ldaMemory() {
            this.pc++;
            this.acc = _MemoryAccessor.read(_PCB.segment, TSOS.Utils.hexToDecimal(this.littleEndian(this.pc)));
            this.pc++;
            this.pc++;
        }
        //8D
        staMemory() {
            this.pc++;
            _MemoryAccessor.write(_PCB.segment, this.littleEndian(this.pc), TSOS.Utils.padHex(this.acc));
            this.pc++;
            this.pc++;
        }
        //6D
        adc() {
            this.pc++;
            let param = this.littleEndian(this.pc);
            let accumulator = (TSOS.Utils.hexToDecimal(this.acc));
            let storage = TSOS.Utils.hexToDecimal(_MemoryAccessor.read(_PCB.segment, TSOS.Utils.hexToDecimal(param)));
            this.acc = TSOS.Utils.padHex(TSOS.Utils.decimalToHex(storage + accumulator));
            this.pc++;
            this.pc++;
        }
        //A2
        ldaXConstant() {
            this.pc++;
            this.xReg = TSOS.Utils.padHex(_MemoryAccessor.read(_PCB.segment, this.pc));
            this.pc++;
        }
        //AE
        ldaXMemory() {
            this.pc++;
            let secondValue = _MemoryAccessor.read(_PCB.segment, TSOS.Utils.hexToDecimal(this.littleEndian(this.pc)));
            this.xReg = TSOS.Utils.padHex(secondValue);
            this.pc++;
            this.pc++;
        }
        //A0
        ldaYConstant() {
            this.pc++;
            this.yReg = _MemoryAccessor.read(_PCB.segment, this.pc);
            this.pc++;
        }
        //AC
        ldaYMemory() {
            this.pc++;
            let secondValue = _MemoryAccessor.read(_PCB.segment, TSOS.Utils.hexToDecimal(this.littleEndian(this.pc)));
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
            _StdOut.advanceLine();
            _StdOut.putText("Process " + _PCB.pid + " has finished");
            _StdOut.advanceLine();
            _CPU.isExecuting = false;
            _PCB.state = "Finished";
            _PCB.endingCycle = _CycleCount;
            _StdOut.putText("Turnaround Time: " + TSOS.Utils.calculateTurnaroundTime());
            _StdOut.advanceLine();
            _StdOut.putText("Wait Time: " + TSOS.Utils.calculateWaitTime());
            _StdOut.advanceLine();
            _Scheduler.runningPCB = null;
            _Scheduler.doScheduling();
            _OsShell.putPrompt();
        }
        //EC
        cpx() {
            this.pc++;
            let secondValue = _MemoryAccessor.read(_PCB.segment, TSOS.Utils.hexToDecimal(this.littleEndian(this.pc)));
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
                let fastForward = TSOS.Utils.hexToDecimal(_MemoryAccessor.read(_PCB.segment, this.pc));
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
            let byteLookingFor = _MemoryAccessor.read(_PCB.segment, this.pc);
            let valueToInc = _MemoryAccessor.read(_PCB.segment, TSOS.Utils.hexToDecimal(byteLookingFor));
            let asDeci = TSOS.Utils.hexToDecimal(valueToInc);
            asDeci++;
            let asHex = TSOS.Utils.decimalToHex(asDeci);
            _MemoryAccessor.write(_PCB.segment, byteLookingFor, TSOS.Utils.padHex(asHex.toString()));
            this.pc++;
            this.pc++;
        }
        //FF
        sys() {
            this.pc++;
            console.log("IN SYS CALL WITH xREG OF " + this.xReg);
            if (Number(this.xReg) == 1) {
                console.log("X REG IS 1, THEREFORE PUT yREG - " + this.yReg);
                _StdOut.putText(this.yReg);
            }
            else if (Number(this.xReg) == 2) {
                let location = TSOS.Utils.hexToDecimal(this.yReg);
                console.log("LOCATION IS YREG - " + this.yReg + " IN SEGMENT " + _PCB.segment);
                location += _PCB.base;
                console.log("THEREFORE ADJUSTED BY " + _PCB.base + " TO " + location);
                let output = "";
                let byteString;
                for (let i = 0; i + location < _Memory.memorySize; i++) {
                    byteString = _Memory.memoryBlock[location + i];
                    if (byteString == "00") {
                        break;
                    }
                    else {
                        output += String.fromCharCode(TSOS.Utils.hexToDecimal(byteString));
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
            TSOS.Utils.invalidOPCodeError();
        }
        littleEndian(programCounter) {
            let second = _MemoryAccessor.read(_PCB.segment, programCounter);
            let first = _MemoryAccessor.read(_PCB.segment, (programCounter + 1));
            let result = first + second;
            operandCount = 2;
            return result;
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map