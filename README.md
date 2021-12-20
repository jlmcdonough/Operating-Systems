# rhinOS
Operting Systems Course Work - Fall 2021

Allows for a user to:
* Load 6502a machine language op codes (up to 256 bytes)
    * View up to 3 programs in memory
    * Store "unlimited" programs in disk space that can be swapped into memory
    * Execute one or multiple programs continously through scheduling types such as Round Robin (custom quantum), First-Come First-Serve, and Non-Preemptive Priority 
* Create, read, write, delete, execute, copy, rename, and list text files
    * Automatically create swap files as needed but cannot be accessed or modified by user
    * Allow user to create and use hidden files
    
* Dark and light mode available

<a href = https://jlmcdonough.github.io/Operating-Systems/>
<p align="center">
    Can run rhinOS here
    <br>
    <img src="https://i.imgur.com/jQ2Gy7u.png" alt="rhinOS dark" width="75%" height = "auto"/>
</p>
</a>


2019 - 2021 Browser-based Operating System in TypeScript
========================================================

This is Alan's Operating Systems class initial project.
See https://www.labouseur.com/courses/os/ for details.
It was originally developed by Alan and then enhanced by alums Bob Nisco and Rebecca Murphy over the years.
Clone this into your own private repository. Better yet, download it as a ZIP file and use it to initialize your own repository for this class. 
Then add Alan (userid *Labouseur*) as a collaborator.

Setup TypeScript
================

1. Install the [npm](https://www.npmjs.org/) package manager if you don't already have it.
1. Run `npm install -g typescript` to get the TypeScript Compiler. (You probably need to do this as root.)

-- or -- 

1. [Download](https://www.typescriptlang.org/download) it from the TypeScript website.
2. Execute the intstaller.

Workflow
=============

Some IDEs (e.g., [Visual Studio Code](https://code.visualstudio.com), [IntelliJ IDEA](https://www.jetbrains.com/idea/), others) 
natively support TypeScript-to-JavaScript compilation and have tools for debugging, syntax highlighting, and more.
If your development environment lacks these then you'll have to compile your code from the command line, which is not a bad thing. 
(In fact, I kind of like that option.) Just make sure you configure `tsconfig.json` correctly and test it out.

A Few Notes
===========

**What's TypeScript?**
TypeScript is a language that allows you to write in a statically-typed language that outputs standard JavaScript.
It's all kinds of awesome.

**Why should I use it?**
This will be especially helpful for an OS or a Compiler that may need to run in the browser as you will have all of the great benefits of strong type checking and scope rules built right into your language.

**Where can I get more info on TypeScript**
[Right this way!](http://www.typescriptlang.org/)
