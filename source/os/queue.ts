/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the JavaScript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */

module TSOS {
    export class Queue {
        constructor(public q = new Array()) {
        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty(){
            return (this.q.length == 0);
        }

        public enqueue(element) {
            this.q.push(element);
        }

        public dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }

        public peek()
        {
            if (this.q.length > 0)
            {
                return this.q[0];
            }
            return null;
        }

        public toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }

        public remove(removePcbPid: number) //not a queue function but is this really even more than just a fancy list?
        {

            this.q.forEach((element,index)=>{
                if(element.pid==removePcbPid)
                    this.q.splice(index,1);
                });

            if (_Scheduler.runningPCB.pid == removePcbPid)
            {
                _Scheduler.runningPCB = null;
                _Scheduler.doScheduling();
            }
        }

        public prioritySort()
        {
            this.q = this.q.sort((a, b) => (a.priority > b.priority) ? 1 : -1);
        }
    }
}
