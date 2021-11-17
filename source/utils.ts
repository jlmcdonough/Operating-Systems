/* --------
   Utils.ts

   Utility functions.
   -------- */

module TSOS {

    export class Utils {

        public static trim(str): string {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        }

        public static rot13(str: string): string {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal: string = "";
            for (var i in <any>str) {    // We need to cast the string to any for use in the for...in construct.
                var ch: string = str[i];
                var code: number = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13;  // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                } else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }

        public static hexToDecimal(hexStr: string): number
        {
            return parseInt(hexStr, 16);
        }

        public static decimalToHex(dec: number): string
        {
            return dec.toString(16);
        }

        public static padHex(hexNum: string)
        {
            let withPadding = "00" + hexNum;
            if (withPadding.length > 4)
            {
                return withPadding.substr(2).toUpperCase();
            }
            else
            {
                return withPadding.substr(withPadding.length - 2).toUpperCase();
            }
        }

        public static segmentStuff(segmentNumber: number): number[]
        {
            let startingPoint, maxPoint;
            switch (segmentNumber)
            {
                case 1:
                    startingPoint = _Memory.segmentOneBase;
                    maxPoint = _Memory.segmentOneLimit;
                    break;
                case 2:
                    startingPoint = _Memory.segmentTwoBase;
                    maxPoint = _Memory.segmentTwoLimit;
                    break;
                case 3:
                    startingPoint = _Memory.segmentThreeBase;
                    maxPoint = _Memory.segmentThreeLimit;
                    break;
            }
            return [startingPoint, maxPoint];
        }

        public static calculateTurnaroundTime(turnaroundPcb?: Pcb) : number
        {
            if (typeof turnaroundPcb !== 'undefined')
            {
                return turnaroundPcb.endingCycle - turnaroundPcb.startingCycle;
            }
            else
            {
                return _PCB.endingCycle - _PCB.startingCycle;
            }
        }

        public static calculateWaitTime(waitPcb?: Pcb): number
        {
            if (typeof waitPcb !== 'undefined')
            {
                return this.calculateTurnaroundTime(waitPcb) - waitPcb.runningCycle;
            }
            else
            {
                return this.calculateTurnaroundTime() - _PCB.runningCycle;
            }
        }

        public static displayPCBAllData(stoppingPcb?: Pcb): void
        {
            if (typeof stoppingPcb !== 'undefined')
            {
                _StdOut.putText("Output: " + stoppingPcb.outputData);
                _StdOut.advanceLine();
                _StdOut.putText("Turnaround Time: " + Utils.calculateTurnaroundTime(stoppingPcb));
                _StdOut.advanceLine();
                _StdOut.putText("Wait Time: " + Utils.calculateWaitTime(stoppingPcb));
                _StdOut.advanceLine();
            }
            else
            {
                _StdOut.putText("Output: " + _PCB.outputData);
                _StdOut.advanceLine();
                _StdOut.putText("Turnaround Time: " + Utils.calculateTurnaroundTime());
                _StdOut.advanceLine();
                _StdOut.putText("Wait Time: " + Utils.calculateWaitTime());
                _StdOut.advanceLine();
            }
        }

        public static memoryOutOfBoundsError(): void
        {
            _CPU.isExecuting = false;
            _PCB.state = "Stopped";
            _StdOut.putText("Memory out of bounds error on process " + _PCB.pid + ". CPU stopped.");
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        }

        public static invalidOPCodeError(): void
        {
            _CPU.isExecuting = false;
            _PCB.state = "Stopped";
            _StdOut.putText("Invalid OP Code reached on process " + _PCB.pid + ". CPU stopped.");
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        }

    }
}
