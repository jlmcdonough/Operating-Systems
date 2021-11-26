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
            }
            else {
                _Kernel.krnTrace("Saving Process " + currPCB.pid + ". Loading Process " + nextPCB.pid);
                currPCB.state = "Ready";
                _Scheduler.readyQueue.enqueue(this.storePCB(currPCB));
                nextPCB.state = "Running";
                _PCB = nextPCB;
                _Scheduler.runningPCB = _PCB;
            }
            if (nextPCB.location === "Disk") {
                console.log("IN DISK");
                let destinationSegment;
                let victimPCB;
                // IF AVAILABLE SEGMENT (I.E. EMPTY) - SWAP THAT ONE OUT FIRST
                if (_MemoryManager.segmentEmpty(1)) {
                    console.log("SEGMENT 1 EMPTY");
                    destinationSegment = 1;
                }
                else if (_MemoryManager.segmentEmpty(2)) {
                    console.log("SEGMENT 2 EMPTY");
                    destinationSegment = 2;
                }
                else if (_MemoryManager.segmentEmpty(3)) {
                    console.log("SEGMENT 3 EMPTY");
                    destinationSegment = 3;
                }
                else // IF PURGABLE SEGMENT (I.E. FINISHED) - NEXT IN ORDER
                 {
                    if (_MemoryManager.segmentReallocate(1)) {
                        console.log("SEGMENT 1 PURGABLE");
                        destinationSegment = 1;
                    }
                    else if (_MemoryManager.segmentReallocate(2)) {
                        console.log("SEGMENT 2 PURGABLE");
                        destinationSegment = 2;
                    }
                    else if (_MemoryManager.segmentReallocate(3)) {
                        console.log("SEGMENT 3 PURGABLE");
                        destinationSegment = 3;
                    }
                    else // IF ALL ARE FULL AND READY - CONSIDER SCHEDULING
                     {
                        if (_Scheduler.schedulingSystem === "PRIORITY") // PRIO - RESORT AND EVICT WORST PRIO
                         {
                            console.log("PRIORITY");
                            //victim is tail
                            victimPCB = _Scheduler.readyQueue.getTail();
                            destinationSegment = victimPCB.segment;
                            console.log("VICTIM PCB: " + victimPCB.pid + " DESTINATION SEG: " + destinationSegment);
                            _Swapper.rollOut(victimPCB);
                        }
                        else if (_Scheduler.schedulingSystem === "RR") // RR - ADD IT BEFORE THE MOST RECENTLY RAN (I.E. IF RUNNING 4 PROGRAMS, EVICT MOST RECENTLY USED)
                         {
                            console.log("RR");
                            //victim is tail
                            victimPCB = _Scheduler.readyQueue.getTail();
                            destinationSegment = victimPCB.segment;
                            console.log("VICTIM PCB: " + victimPCB.pid + " DESTINATION SEG: " + destinationSegment);
                            _Swapper.rollOut(victimPCB);
                        }
                        else if (_Scheduler.schedulingSystem === "FCFS") // FCFS - ADD IT TO END OF QUEUE, EVICT DEEPEST (REVERSE PEEK UNTIL APPEARS?)
                         {
                            console.log("FCFS");
                            // only doing 4 programs on FCFS basis, if the scheduler has 4 programs and it reaches the disk, at least one on memory must be completed
                            // this should be acheived via reallocation check
                            victimPCB = _Scheduler.readyQueue.getTail();
                            destinationSegment = victimPCB.segment;
                            console.log("VICTIM PCB: " + victimPCB.pid + " DESTINATION SEG: " + destinationSegment);
                            _Swapper.rollOut(victimPCB);
                            console.log("GOT TO FCFS WITHOUT DOING ANYTHING");
                        }
                        else {
                            console.log("GOT THROUGH EVERYTHING WITHOUT A FIND SOMEHOW");
                        }
                    }
                }
                _Swapper.rollIn(nextPCB, destinationSegment);
            }
            this.updateCPU(nextPCB);
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