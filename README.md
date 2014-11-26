## QED

Software Defined Projectors :-)

### Architecture

<center>
<picture>
   <source src=https://github.com/harshavardhana/qed/raw/master/QED.png type=image/png >
   <img src="https://github.com/harshavardhana/qed/raw/master/QED.png" alt="QED Overview">
</picture>
</center>

### How To Install QED

#### Dependencies: How do install ``NodeJS`` using NVM (Ubuntu 14.04)

An alternative to installing Node.js through apt is to use a specially designed tool called nvm, which stands for "Node.js version manager".

Using nvm, you can install multiple, self-contained versions of Node.js which will allow you to control your environment easier. It will give you on-demand access to the newest versions of Node.js, but will also allow you to target previous releases that your app may depend on.

To start off, we'll need to get the software packages from our Ubuntu repositories that will allow us to build source packages. The nvm script will leverage these tools to build the necessary components:

    $ sudo apt-get update
    $ sudo apt-get install build-essential libssl-dev

Once the prerequisite packages are installed, you can pull down the nvm installation script from the project's GitHub page. The version number may be different, but in general, you can download and install it with the following syntax:

    $ curl https://raw.githubusercontent.com/creationix/nvm/v0.19.0/install.sh | bash
    $ source ~/.profile

    $ nvm ls-remote
~~~
  . . .
 v0.11.6
 v0.11.7
 v0.11.8
 v0.11.9
v0.11.10
v0.11.11
v0.11.12
v0.11.13
v0.11.14
~~~

As you can see, the newest version at the time of this writing is v0.11.13. You can install that by typing:

    $ nvm install 0.11.14

Usually, nvm will switch to use the most recently installed version. You can explicitly tell nvm to use the version we just downloaded by typing:

    $ nvm use 0.11.14

When you install Node.js using nvm, the executable is called node. You can see the version currently being used by the shell by typing:

    $ node -v
    v0.11.14

#### Installing QED

Prerequisite please install 'git' version control system

    $ sudo apt-get install git

    $ git clone https://github.com/harshavardhana/qed.git
    $ cd qed

After you have cloned the repository, please use npm to install dependencies (all dependencies will be automatically installed)

    $ npm install

At this point in time we should make configuration changes i.e ``config.json``

~~~
$ cat config.json
{
  "server": {
    "port": 4001,
    "root": "web",
    "host": "0.0.0.0"
  },
  "socket": {
    "port": 4002,
    "root": "web",
    "host": "0.0.0.0"
  },
  "projectors": {
    "projector1": "10.0.0.25",
    "projector2": "10.0.0.5",
    "projector3": "10.0.0.53"
  }
}
~~~

Configuration 'server' and 'socket' doesn't require editing since default should work fine, but 'projectors' need to be local to your setup where individual projector boxes get their own static IP's - please make sure the association is in accordance with the projector installation infrastructure.

    $ ./start-services.js

    ### Starting local server
    Web server running at http://0.0.0.0:4001/
    Socket server running at ws://0.0.0.0:4002 ...
    Uploaded files will be saved to web/uploaded
    Remember to wipe this directory if you upload lots and lots.

### Feedback

Please provide your feedback harsha (at) harshavardhana.net