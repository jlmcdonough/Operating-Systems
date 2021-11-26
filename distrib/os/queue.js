/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the JavaScript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */
var TSOS;
(function (TSOS) {
    class Queue {
        constructor(q = new Array()) {
            this.q = q;
        }
        getSize() {
            return this.q.length;
        }
        isEmpty() {
            return (this.q.length == 0);
        }
        enqueue(element) {
            this.q.push(element);
        }
        dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }
        peek() {
            if (this.q.length > 0) {
                return this.q[0];
            }
            return null;
        }
        toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }
        remove(removePcbPid) {
            this.q.forEach((element, index) => {
                if (element.pid == removePcbPid)
                    this.q.splice(index, 1);
            });
            if (_Scheduler.runningPCB.pid == removePcbPid) {
                _Scheduler.runningPCB = null;
                _Scheduler.doScheduling();
            }
        }
        prioritySort() {
            this.q = this.q.sort((a, b) => (a.priority > b.priority) ? 1 : -1);
        }
        getTail() {
            console.log("IN TAIL");
            console.log("Q: " + this.q[0]);
            console.log("SIZE: " + this.q.length);
            return this.q[this.q.length - 1];
        }
    }
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=queue.js.map