/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            // letters
            if ((keyCode >= 65) && (keyCode <= 90)) {
                // Uppercase A-Z
                if (isShifted === true) {
                    chr = String.fromCharCode(keyCode);
                }
                // Lowercase a-z
                else {
                    chr = String.fromCharCode(keyCode + 32);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            //digits, space, enter
            else if (((keyCode >= 48) && (keyCode <= 57)) ||
                (keyCode == 32) ||
                (keyCode == 13)) {
                //symbols above numbers
                let symbols = [")", "!", "@", "#", "$", "%", "^", "&", "*", "("];
                if (isShifted && (keyCode >= 48) && (keyCode <= 57)) {
                    chr = symbols[keyCode - 48]; //48 is 0 and ) is shifted 0
                }
                else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            }
            // various punctuation
            else if ((keyCode >= 186) && (keyCode <= 191)) {
                let punctuation = [";", "=", ",", "-", ".", "/"];
                let shiftedPunctuation = [":", "+", "<", "_", ">", "?"];
                if (isShifted && (keyCode >= 186) && (keyCode <= 191)) {
                    chr = shiftedPunctuation[keyCode - 186]; //186 is ; and ; is shifted :
                }
                else {
                    chr = punctuation[keyCode - 186];
                }
                _KernelInputQueue.enqueue(chr);
            }
            // rest of punctuation
            else if ((keyCode >= 219) && (keyCode <= 222)) {
                let restPunctuation = ["[", "\\", "]", "'"];
                let restShiftedPunctuation = ["{", "|", "}", "\""];
                if (isShifted && (keyCode >= 219) && (keyCode <= 222)) {
                    chr = restShiftedPunctuation[keyCode - 219]; //219 is [ and [ is shifted {
                }
                else {
                    chr = restPunctuation[keyCode - 219];
                }
                _KernelInputQueue.enqueue(chr);
            }
            // grave/tilde
            else if (keyCode == 192) {
                if (isShifted) {
                    chr = "~";
                }
                else {
                    chr = "`";
                }
                _KernelInputQueue.enqueue(chr);
            }
            // delete, tab, up arrow, down arrow
            else if (keyCode == 8 ||
                keyCode == 9 ||
                keyCode == 38 ||
                keyCode == 40) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map